/**
 * jQuery.sendMail
 * Version: 2.0.3
 * Repo: https://github.com/WahaWaher/sendmail-js
 * Author: Sergey Kravchenko
 * Contacts: wahawaher@gmail.com
 * License: MIT
 */

;(function($) {

	/**
	 * Настройки по умолчанию
	 *
	 * @default
	 */
	var defaults = {
		url: 'mail/sendmail.php',
		reset: true,
		freeze: 0
	};

	/**
	 * Конструктор
	 *
	 * @constructor
	 * @param {HTMLElement} el - HTML-элемент в DOM
	 * @param {Object=} options - Объект с параметрами
	 */
	var SendMail = function(el, options) {
		this.form = el;
		this.init(options);
	}, __, meth = SendMail.prototype;

	/**
	 * Инициализация плагина
	 *
	 * @public
	 * @param {object={}} options - Объект с параметрами
	 * @example
	 * 
	 * $(element).sendMail('init', {});
	 * $(element).sendMail('init');
	 */
	meth.init = function(options) {
		var _ = this,
			 $form = $(_.form);

		if( _.inited === true || _.form.tagName != 'FORM' ) return;

		// console.log( 'Метод: Init'/*, arguments, _*/ );

		// Настройки: По умолчанию
		_.defaults =  $.extend(true, {}, defaults, $.fn.sendMail.defaults);
		// Настройки: Пользовательские
		_.options = options || {};
		// Настройки: Data-атрибут
		_.dataOptions = $form.data('sendmail') || {};
		// Настройки: Объединенные
		_.settings = $.extend(true, {}, _.defaults, _.options, _.dataOptions);

		// Событие: 'beforeInit'
		$form.trigger('beforeInit.sml', [_, _.form]);

		_.nsid = __.getRndNum(10000, 99999);
		_.stop = false;

		$form
			.addClass('sendmail-form')
			.on('submit' + '.sml-' + _.nsid, function() {
				_.send.call(_);
				return false;
			});

		// Плагин инициализирован
		_.inited = true;

		// Событие: 'afterInit'
		$form.trigger('afterInit.sml', [_, _.form]);
		
	};

	/**
	 * Отправка формы
	 *
	 * @public
	 * @example
	 * 
	 * $(element).sendMail('send');
	 */
	meth.send = function() {

		var _ = this,
			 form = _.form,
			 $form = $(form),
			 sets = _.settings;

		if( !_.inited || _.stop ) return;

		// Запрет повторной отправки
		_.stop = true;

		// console.log( 'Метод: Send', arguments );

		// Событие: 'beforeSend'
		$form.trigger('beforeSend.sml', [_, _.form]);

		// Нет полей для загрузки файлов? Использ. Serialize
		if( !$form.find('input[type="file"]').length ) {

			var fd = {
				data: $form.serialize() + '&js=on',
				ajaxProcData: true,
				ajaxContType: 'application/x-www-form-urlencoded; charset=UTF-8'
			}

			if( _.addData )
				fd.data += '&' + $.param(_.addData);

		// Есть поля для загрузки файлов? Использ. FormData
		} else {

			var fd = {
				data: new FormData(form),
				ajaxProcData: false,
				ajaxContType: false,
			}

			fd.data.append('js', 'on');

			if( _.addData )
				$.each(_.addData, function(key, value) {
					fd.data.append(key, value);
				});

			// FormData не поддерживается? Отключить отправку AJAX-ом
			// Поддержка FormData браузерами: IE 10+, Firefox 4.0+, Chrome 7+, Safari 5+, Opera 12+
			if( !window.FormData ) {

				$form
					.off( 'submit.sml-' + _.nsid )
					.trigger('submit');

			}

		}

		$.ajax({
			type: 'POST',
			url: sets.url,
			data: fd.data,
			processData: fd.ajaxProcData,
			contentType: fd.ajaxContType,
			success: function( resp, status, xhr ) {

				if( xhr.getResponseHeader('sendmail') == 1 ) {

					_.pullFreeze();

					// Событие: 'success'
					$form.trigger('success.sml', [_, _.form, resp]);

					// Очистка полей формы
					if( sets.reset ) $form.trigger('reset');

				} else {

					// Событие: 'serverError'
					$form.trigger('serverError.sml', [_, _.form, resp]);

				}

				// Событие: 'afterSend'
				$form.trigger('afterSend.sml', [_, _.form, resp]);

			},
			error: function( resp ) {

				_.pullFreeze();

				// Событие: 'afterSend'
				$form.trigger('afterSend.sml', [_, _.form, resp]);

				// Событие: 'ajaxError'
				$form.trigger('ajaxError.sml', [_, _.form, resp]);

			}

		});

	};

	/**
	 * Снимает запрет на отправку формы
	 *
	 * @public
	 * @param {number=} time - Время заморозки, мс
	 * 
	 * 
	 */
	meth.pullFreeze = function(time) {
		var _ = this;

		setTimeout(function() {
			_.stop = false;
		}, time || this.settings.freeze);

	};

	/**
	 * Деинициализация
	 *
	 * @public
	 * @example
	 * 
	 * $(element).sendMail('destroy');
	 */
	meth.destroy = function() {
		var _ = this,
			 form = _.form;

		if( !_.inited ) return;

		// console.log( 'Метод: Destroy', arguments );

		$(form)
			.removeClass('sendmail-form')
			.off( 'submit.sml-' + _.nsid );

		delete form.SendMail;

	};

	/**
	 * Реинициализация
	 *
	 * @public
	 * @param {object=} newSets - Объект с новыми параметрами
	 * @example
	 * 
	 * $(element).sendMail('reinit');
	 * $(element).sendMail('reinit', {});
	 */
	meth.reinit = function(newSets) {
		var _ = this,
			 $form = $(_.form),
			 sets = (typeof newSets == 'object' && Object.keys(newSets).length != 0 )
					  ? newSets : $.extend(true, {}, _.settings);

		// console.log( 'Метод: Reinit', arguments );

		// Код здесь...
		_.destroy();
		$form.sendMail(sets);

	};

	__ = {

		/**
		 * Генерирует случайное число
		 *
		 * @private
		 * @param {Number} min - от
		 * @param {Number} max - до
		 */
		getRndNum: function(min, max) {
			return Math.round(min - 0.5 + Math.random() * (max - min + 1));
		}

	};

	$.fn.sendMail = function() {

		var pn = 'SendMail',
			 args = arguments,
			 mth = args[0];

		$.each(this, function(i, it) {
			if( typeof mth == 'object' || typeof mth == 'undefined' )
				it[pn] = crtInst(it, mth);
			else if( mth === 'init' || mth === 'reinit' )
				it[pn] ? getMeth(it, mth, args) : it[pn] = crtInst(it, args[1]);
			else getMeth( it, mth, args );
		});

		function getMeth(it, mth, args) {
			if( !(it[pn] instanceof SendMail) ) return;
			if( !(mth in it[pn]) ) return;
			return it[pn][mth].apply(it[pn], Array.prototype.slice.call(args, 1));
		};

		function crtInst(it, mth) {
			if( it[pn] instanceof SendMail ) return;
			return new SendMail(it, mth);
		};

		return this;
	};

	$.fn.sendMail.prototype = SendMail.prototype;
	$.fn.sendMail.defaults = defaults;

})(jQuery);