/**
 * jQuery.sendMail
 * Version: 1.0.7
 * Repo: https://github.com/WahaWaher/sendmail-js
 * Author: Sergey Kravchenko
 * Contacts: wahawaher@gmail.com
 * License: MIT
 */

;(function($) {

	var methods = {

		init: function(options) {

			var defaults = $.extend(true, {

				url: 'mail/mail.php', // Путь к обработчику
				reset: true, // Очистка полей формы после успешной отправки

				beforeInit:    function() {}, // Перед инициализацей
				afterInit:     function() {}, // После инициализации
				beforeSend:    function() {}, // Перед отправкой формы
				afterSend:     function() {}, // После попытки отправки формы, независимо от ответа 
				onSuccess:     function() {}, // Успешная отправка AJAX-запроса.
				onAjaxError:   function() {}, // Ошибка при отправке AJAX-запроса.
				onServerError: function() {} // Ошибка на сервере при отправке формы.

			}, $.fn.sendMail.defaults);

			this.each(function() {

				var $ths = $(this);

				if( $ths.data('_init') == true ) return false;

				$ths.data('defaults', defaults);
				$ths.data('options', options);

				var data = $ths.attr('data-sendmail');
				data = eval('(' + data + ')');
				if( typeof(data) != 'object') data = {};

				$ths.data('settings', $.extend(true, {}, defaults, options, data));
				var sets = $ths.data('settings');

				// Callback: beforeInit()
				sets.beforeInit.call($ths, sets);

				$ths.addClass('sendmail-form');

				// ID для генерации уник.числа (пространство имен, обраб.)
				sets._nsid = randInt(10000000, 99999999);

				$ths.on('submit' + '.sm-' + sets._nsid, function() {
					methods.send.call($ths);
					return false;
				});

				$ths.data('_init', true);

				// Callback: afterInit()
				sets.afterInit.call($ths, sets);

			});

			return $(this);

		},

		destroy: function() {

			if( !$(this).data('_init') ) return false;

			var $ths = $(this), sets = $ths.data('settings');

				$ths.removeClass('sendmail-form')
					 .off( 'submit' + '.sm-' + sets._nsid )
					 .removeData();

			return $(this);

		},

		reinit: function(newOpts) {

			var $ths = $(this), sets = $ths.data('settings');

			var oldOpts = $ths.data('options');
			methods.destroy.call($ths);

			if( newOpts && typeof(newOpts) == 'object' )
				methods.init.call($ths, newOpts);
			else methods.init.call($ths, oldOpts);

			return $(this);

		},

		send: function() {

			var $ths = $(this), sets = $ths.data('settings');

			// Callback: beforeSend()
			if( sets.beforeSend.call($ths, sets) === false ) return false;

			// Не отправлять письмо, если форма не валидна (для JQ Validate)
			if( $.validator && !$ths.valid() ) return false;

			// Нет полей для загрузки файлов? Использ. Serialize
			if( !$ths.find('input[type="file"]').length ) {

				var fd = {
					data: $ths.serialize() + '&errorReport=true',
					ajaxProcData: true, ajaxContType: 'application/x-www-form-urlencoded; charset=UTF-8'
				}

			// Есть поля для загрузки файлов? Использ. FormData
			} else {

				var fd = {
					data: new FormData($ths.get(0)),
					ajaxProcData: false, ajaxContType: false,
				}

				fd.data.append('errorReport', true);

				// FormData не поддерживается? Отключить отправку AJAX-ом
				// Поддержка FormData браузерами: IE 10+, Firefox 4.0+, Chrome 7+, Safari 5+, Opera 12+
				if( !window.FormData ) {
					$ths.unbind('submit');
					$ths.trigger('submit');
				}

			}

			$.ajax({
				type: 'POST',
				url: sets.url,
				data: fd.data,
				processData: fd.ajaxProcData,
  				contentType: fd.ajaxContType,
				success: function( resp ) {
					if( !resp.match(/sendmail-server-error/igm)  ) {
						// Callback: onSuccess()
						sets.onSuccess.call($ths, sets, resp);
						// Очистка полей формы
						if( sets.reset ) $ths.trigger('reset');
					} else {
						// Callback: onServerError()
						sets.onServerError.call($ths, sets, resp);
					}
					// Callback: afterSend()
					sets.afterSend.call($ths, sets);
				},
				error: function( resp ) {
					// Callback: afterSend()
					sets.afterSend.call($ths, sets);
					// Callback: onAjaxError()
					sets.onAjaxError.call($ths, sets, resp);
				}
			});

			return $(this);

		},

	};

	// Генератор случайного числа
	function randInt(min, max) {
		var rand = min - 0.5 + Math.random() * (max - min + 1)
		rand = Math.round(rand);
		return rand;
	}

	$.fn.sendMail = function(methOrOpts) {
		if ( methods[methOrOpts] ) {
			return methods[ methOrOpts ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methOrOpts === 'object' || ! methOrOpts ) {
			methods.init.apply( this, arguments );
			return this;
		} else {
			$.error( 'Method ' +  methOrOpts + ' does not exist on jQuery.sendMail' );
		}    
	};

})(jQuery);