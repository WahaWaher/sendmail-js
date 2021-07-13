
// опеределяет тип: Вкладки, Аккордеон, Спойлер
fn.getType = function () {};

// ВКЛАДКИ

fn.createMarkup = function () {} // созд. разметку
fn.getAdaptive = function () {} // адаптив

fn.go = function () {}; // перейти на вкладку
fn.next = function () {}; // перейти на след. вкладку
fn.prev = function () {}; // перейти на пред. вкладку 


fn.closeAll = function () {}; // закрыть все вкладки


fn.close = function () {}; // закрыть вкладку (или перейти на первую, если невозм.)

mode // режим (desktop, mobile)


;(function($) {

	var methods = {

		init: function(options) {

			var defaults = $.extend(true, {
				
				breakpoint: 768, // ширина окна браузера в "px", при достиж. котор. будет переход между режимами
				listIcon: $('<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M48.293 23.293l-16.293 16.293-16.293-16.293-1.414 1.561 17 17.146h1.414l17-17.146z"/></svg></div>'),
				transformFade: 0, // эфф. появления вкладок при смене режима, мс

				beforeInit:   function() {},
				afterInit:    function() {},
				beforeChange: function() {},
				afterChange:  function() {},
				onChangeMode: function() {},

				// Вспомог.
				layout: { nav: null, content: null, items: {}, },
				curItemID: { id: 0, name: null },
				curMode: null,
				firstTabIndex: null,
				modeChanged: false

			}, $.fn.flexTabs.defaults);

			this.each(function() {
				var $ths = $(this);

				if( $ths.data('_init') == true ) return false;

				$ths.data('defaults', defaults);
				$ths.data('options', options);

				var data = $ths.attr('data-flextabs');
				data = eval('(' + data + ')');
				if( typeof(data) != 'object') data = {};

				$ths.data('settings', $.extend(true, {}, defaults, options, data));
				var sets = $ths.data('settings');

				// Callback: beforeInit()
				sets.beforeInit.call($ths, sets);

				sets.layout.container = $ths.addClass('flextabs');
				sets.layout.nav = $ths.find('.ft-nav');
				sets.layout.contents = $ths.find('.ft-contents');

				$.each(sets.layout.nav.find('>*'), function(key, value) {
					// "value" - отдельный таб из навигации

					var item = {
						id: key,
						name: $(value).attr('href').replace(/#/, ''),
						tab: {
							desktop: $(value).addClass('ft-tab'),
							mobile: $(value)
										.clone(true)
										.insertBefore($ths.find('#' + $(value).attr('href').replace(/#/, '')))
										.addClass('mobile').hide(),
						},
						content: $ths.find('#' + $(value).attr('href').replace(/#/, '')).addClass('ft-content'),
					};

					// сохр. изначально активную вкладку при "reinit"
					if( $(value).hasClass('active') && sets.firstTabIndex == null )
						sets.firstTabIndex = key;

					// доб. иконки свор./развор. в моб режиме
					if( sets.listIcon ) {
						item.tab.mobile.addClass('has-icon');
						sets.listIcon.addClass('ft-icon').clone().appendTo(item.tab.mobile);
					}

					if( item.tab.desktop.hasClass('active') ) {

						// активный класс у контента, если не проставлен
						item.content.addClass('active');

						// помеч. текущую активную вкладку в настройках
						sets.curItemID = {
							id: item.id,
							name: item.name
						};
					
					}

					sets.layout.items[item.name] = item;

				});

				// ID для генерации уник. имени пространства имен (для обработчиков)
				sets._nsid = ranвInt(10000000, 99999999);

				// Переходы по вкладкам. Событие
				$ths.on('click.ft-'+sets._nsid, function(e) {

					var target = $(e.target), needTab;

					if( target.hasClass('ft-tab') ) {
						needTab = target;
					} else {
						var closest = target.closest('.ft-tab', $ths);
						if( closest.length ) needTab = closest;
							else return;
					}

					methods.go.call($ths, needTab.attr('href').replace(/#/g, ''));

					return false;

				});

				// Режимы
				var mode,
					 mobileTabs = sets.layout.nav.find('.ft-tab'),
					 desktopTabs = sets.layout.contents.find('.ft-tab');

				$(window).bind('resize.ft-'+sets._nsid+' load.ft-'+sets._nsid, getAdaptive).resize();

				function getAdaptive() {

					var win = $(this);

					// Режим "Desktop"
					if( win.outerWidth() >= sets.breakpoint && (mode === true || mode === undefined) ) {
						
						mobileTabs.fadeIn(sets.transformFade);
						desktopTabs.hide();
						$.each(sets.layout.items, function() {
							this.content.css({
								display: ''
							});
						});
						sets.curMode = 'desktop';
						methods.go.call($ths, sets.curItemID.id, 'resize');

						mode = false;


						// Callback: onChangeMode()
						if( sets.modeChanged )
							sets.onChangeMode.call($ths, sets);
						sets.modeChanged = true;

					// Режим "Mobile"
					} else if( win.outerWidth() < sets.breakpoint && (mode === false || mode === undefined) ) {
						
						mobileTabs.hide();
						desktopTabs.fadeIn(sets.transformFade);
						sets.curMode = 'mobile';

						mode = true;

						// Callback: onChangeMode()
						if( sets.modeChanged )
							sets.onChangeMode.call($ths, sets);
						sets.modeChanged = true;

					}
				}

				$ths.data('_init', true);

				// Callback: afterInit()
				sets.afterInit.call($ths, sets);

			});

			return $(this);
		},

		destroy: function() {
			var $ths = $(this), sets = $ths.data('settings');

			if( $ths.data('_init') === true ) {

				// удал. мобильные табы
				sets.layout.contents.find('.mobile').remove();

				// удал. обработчик со вкладок
				$ths.off('click.ft-'+sets._nsid);

				// удал. обработчик с window (адапт. режим)
				$(window).unbind('resize.ft-'+sets._nsid+' load.ft-'+sets._nsid);

				// восст. изначально открытую вкладку
				$.each(sets.layout.items, function(key, value) {

					value.tab.desktop.removeClass('active');
					value.tab.mobile.removeClass('active');
					value.content.removeClass('active').css('display', '');

					if( value.id == sets.firstTabIndex ) {
						value.tab.desktop.addClass('active');
						value.tab.mobile.addClass('active');
						value.content.addClass('active').css('display', '');
					}

				});

				$ths.removeData();

			}

			return $(this);

		},

		reinit: function(newOpts) {
			var $ths = $(this);

			var oldOpts = $ths.data('options');
			methods.destroy.call($ths);

			if( newOpts && typeof(newOpts) == 'object' )
				methods.init.call($ths, newOpts);
			else methods.init.call($ths, oldOpts);

			return $(this);

		},

		go: function(next, switching) {
			// "next" - number(id) или name(href)
			// switch - источник переключения; 'resize' - перекл. при ресайзе
			var $ths = $(this), sets = $ths.data('settings');

			var curItem = sets.layout.items[sets.curItemID.name],
				 nextItem = {};

			if( typeof(next) == 'string' ) {
				nextItem = sets.layout.items[next];
			} else if ( typeof(next) == 'number' ) {
				$.each(sets.layout.items, function(key, value) {
					if( value.id != next ) return;
					else {
						nextItem = value;
						return false;
					}

				});
			}

			// Callback: beforeChange()
			if( switching != 'resize' )
				sets.beforeChange.call($ths, sets, curItem, nextItem);
		
			if( sets.curMode == 'desktop' ) {

				methods.closeAll.call($ths);
				nextItem.tab.desktop.addClass('active');
				nextItem.tab.mobile.addClass('active');
				nextItem.content.addClass('active');
				
			} else if( sets.curMode == 'mobile' ) {

				nextItem.tab.mobile.toggleClass('active');
				nextItem.content.toggleClass('active');

			}

			sets.curItemID = {
				id: nextItem.id,
				name: nextItem.name
			};

			// Callback: afterChange()
			if( switching != 'resize' )
				sets.afterChange.call($ths, sets, nextItem);

			return $(this);

		},

		closeAll: function() {
			var $ths = $(this), sets = $ths.data('settings');

			$.each(sets.layout.items, function() {
				this.tab.desktop.removeClass('active');
				this.tab.mobile.removeClass('active');
				this.content.removeClass('active');
			});

			sets.curItemID = {
				id: null,
				name: null
			};

			return $(this);

		},

	};

	// Генератор случайного числа
	function ranвInt(min, max) {
		var rand = min - 0.5 + Math.random() * (max - min + 1)
		rand = Math.round(rand);
		return rand;
	}

	$.fn.flexTabs = function(metOrOpts) {
		if ( methods[metOrOpts] ) {
			return methods[ metOrOpts ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof metOrOpts === 'object' || ! metOrOpts ) {
			methods.init.apply( this, arguments );
			return this;
		} else {
			$.error( 'Method ' +  metOrOpts + ' does not exist on jQuery.flexTabs' );
		}    
	};

})(jQuery);