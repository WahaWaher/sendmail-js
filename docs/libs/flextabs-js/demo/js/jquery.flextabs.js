;(function($, window) {

	/**
	 * Конструктор
	 *
	 * @constructor
	 * @param {HTMLElement} el - HTML-элемент в DOM
	 * @param {Object=} options - Объект с параметрами
	 */
	function FlexTabs(element, options) {
		var _ = this;

		_.it = element;
		_.init(options);

	};

	var fn = FlexTabs.prototype,

		 // Сокращения
		 _tabs_ = 'tabs',
		 _accordion_ = 'accordion',
		 
		 _control_ = 'control',
		 _controls_ = 'controls',
		 _status_ = 'status',
		 _content_ = 'content',
		 _active_ = 'active',
		 _auto_  = 'auto',
		 _flexTabs_ = 'flexTabs',

		 _dataIndex_ = 'data-index',
		 _dataId_ = 'data-id',

		 _addClass_ = 'addClass',

		 _div_ = '<div/>';


	/**
	 * Настройки по умолчанию
	 *
	 * @default
	 */
	FlexTabs.defaults = {

		// Базовый тип разметки:
		// "tabs" / "accordion"
		type: _tabs_,

		// Ширина окна браузера, при которой вкладки
		// будут преобразованы в аккордеон, px
		breakpoint: 768,

		// Событие переключающее вкладки,
		// При значении false — событие на вкладки назначено не будет
		event: 'click',

		// Базовая продолжительность анимации, мс
		fade: 200,

		// Преобразование 'tabs' в 'accordion'
		responsive: true,

		// Иконка для вкладок в режиме 'accordion'
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M48.293 23.293l-16.293 16.293-16.293-16.293-1.414 1.561 17 17.146h1.414l17-17.146z"/></svg>',

		// Способ переключения вкладок в режиме "accordion"
		// true — вкладки можно сворачивать и разворачивать,
		// 	разворачивание новой вкладки не влечет сворачивание остальных.
		// false — вкладки можно только разварачивать,
		// 	разворачивание новой вкладки влечет сворачивание всех остальных.
		collapsible: true,

		// Тема оформления (CSS-класс осн. контейнера)
		theme: 'ft-theme-default',

		// CSS-классы
		classes: {
			// Общий контейнер
			container: 'ft-container',

			// Общий контейнер. Режим: Tabs
			mtb: 'ft-'+ _tabs_,
			// Общий контейнер. Режим: Accordion
			mac: 'ft-'+ _accordion_,

			// Контейнер для содержимого вкладок
			contents: 'ft-'+ _content_ +'s',
			// Контейнер для вкладок
			nav: 'ft-nav',

			// Вкладка
			tab: 'ft-tab',
			// Вкладка, содержащая иконку
			tabIcon: 'ft-tab-icon',

			// Контент вкладки
			content: 'ft-' + _content_,

			// Контейнер с иконкой
			icon: 'ft-icon',

			// Активная вкладка/контент
			active: _active_,
		}

	};

	/**
	 * Экземпляры
	 *
	 * @default
	 */
	FlexTabs.instances = {};

	/**
	 * Инициализация
	 *
	 * @public
	 * @param {object={}} options - Объект с польз. настройками
	 * @example
	 * 
	 * $(element).flexTabs('init', {});
	 * $(element).flexTabs('init');
	 */
	fn.init = function(options) {
		var _ = this,
			 it = _.it,
			 $it = $(it),
			 event, sets, cls;

		if( _.inited === true ) return;

		_[_active_] = {};
		_.animation = _auto_;
		_.nsid = __.getRndNum(10000, 90000);
		_.ns = 'ft-' + _.nsid;

		_.id = $it.attr('id') || _.ns;
		$it.attr('id', _.id);
		FlexTabs.instances[_.id] = _;

		// Исходники: содержимое и атрибуты
		_.origin = {
			attrs: { class: '' },
			html: $it.html()
		};

		$.each(it.attributes, function() {
			_.origin.attrs[this.name] = this.value;
		});

		// Настройки
		sets = _.defineSets(options);
		cls = sets.classes;
		_.origin.type = sets.type;

		// Разметка
		_.createMarkup();

		// Режимы
		_.defineMode();
		$(window).on('resize' + '.' + _.ns, function() {
			_.defineMode();
		});

		// Вкладки. Обработчик
		if( event = sets.event ) {

			$(it).on(event + '.' + _.ns, '.' + cls.tab, function(e) {

				var target = $(e.target),
					 index;

				if( !target.hasClass(cls.tab) )
					target = target.parents('.' + cls.tab);

				index = Number(target.attr(_dataIndex_)) || 0;

				_.switch(index);

				e.preventDefault();
				e.stopPropagation();
				
			});

		}

		// Hash
		if( !_.inited ) {
			var hash = location.hash,
				 rexExp = new RegExp('' + _.id + '=([a-zA-Z0-9.,-_]+)', 'igm'),
				 tabsString, tabs = [];

			if( rexExp.test(hash) ) {

				FlexTabs.hasHash = true;

				tabsString = hash.match(rexExp)[0];
				tabsString = tabsString.replace(_.id + '=', '');
				tabs = tabsString.split(',');

				_.closeAll(true, 0);

				for (var i = tabs.length - 1; i >= 0; i--) {

					if( Number(tabs[i] ) ) {
						tabs[i] = Number(tabs[i]);
					}
					
					_.open(tabs[i], false, 0);
				};

			}
		}

		// Плагин инициализирован
		_.inited = true;

		// Callback: 'afterInit'
		$(it).trigger('afterInit.ft', [_]);

		// Анимация появления
		if( it.style.display == 'none' )
			$(it).fadeIn(sets.fade);
		
		// console.log( 'Метод: Init', arguments, _ );

	};


	/**
	 * Создание разметки
	 *
	 * @public
	 */
	fn.createMarkup = function() {
		var _ = this,
			 sets = _.sets,
			 cls = sets.classes,
			 lt = _.layout = {
			 	controls: {},
			 	navElems: {}
			 };

		// Контейнер
		lt.it = $(_.it)[_addClass_](cls.container + ' ' + sets.theme);

		switch( sets.type ) {

			// ТАБЫ
			case _tabs_: {

				// Контент
				lt.cnt = lt.it.find('.'+cls.contents);
				if( !lt.cnt.length )
					lt.cnt = lt.it.find('>*').eq(1);
				if( !lt.cnt.length )
					lt.cnt = $(_div_).appendTo(lt.it);

				lt.cnt[_addClass_](cls.contents);

				// Контент, элементы
				lt.cntElems = lt.cnt.children();


				// Навигация
				lt.nav = lt.it.find('.'+cls.nav);
				if( !lt.nav.length )
					lt.nav = lt.it.find('>*').eq(0);
				lt.nav[_addClass_](cls.nav);

				// Навигация, элементы
				lt.navElems = {
					tabs: lt.nav.children(),
					accordion: $()
				};

				build(sets.type);

				break;
			}

			// АККОРДЕОН
			case _accordion_: {

				// Контент
				lt.cnt = lt.it.wrapInner($(_div_, { class: cls.contents })).children().eq(0);

				// Контент, элементы
				lt.cntElems = lt.cnt.children().filter(':odd');


				// Навигация
				lt.nav = $('<nav/>', { class: cls.nav }).prependTo(lt.it);

				// Навигация, элементы
				lt.navElems = {
					tabs: $(),
					accordion: lt.cnt.find('>*').filter(':even')
				};

				build(sets.type);

				break;
			}

		}

		function build(type) {

			$.each(lt.navElems[type], function(index, tab) {

				var tab = $(tab),
					 content = lt.cntElems.eq(index),
					 id, attrID, href, dataID,
					 active = tab.hasClass(cls[_active_]) ? 1 : 0,
					 tabInfo = {},
					 tabAlter; 

				// Вкладка
				tab
					[_addClass_](cls.tab)
					.attr(_dataIndex_, index);

				if( href = tab.attr('href') ) {
					id = href.replace('#', '');
					attrID = 'href';
					tab.attr('href', '#' + _.id + '=' + id);
				} else if( dataID = tab.attr(_dataId_) ) {
					id = dataID;
					attrID = _dataId_;
				} else {
					id = 'ft-' + __.getRndNum(10000, 90000);
					attrID = _dataId_;
					tab.attr(_dataId_, id);
				}

				
				// Контент вкладки
				if( !content.length )
					content = $(_div_).appendTo(lt.cnt);

				content
					.attr('id', id)
					[_addClass_](cls[_content_])
					.attr(_dataIndex_, index)
					.hide();

				// Альтернативная вкладка
				tabAlter = tab.clone(true, true);
				if( type == _tabs_ ) content.before(tabAlter);
				else if( type == _accordion_ ) lt.nav.append(tabAlter);

				tabInfo = {
					id: id,
					attrID: attrID,
					index: index,
					control: {
						tabs: $(),
						accordion: $()
					},
					content: content,
					status: 0 // 1 - откр. 0 - закр.
				};

				if( type == _tabs_ ) {

					tabInfo[_control_][_tabs_] = tab;
					tabInfo[_control_][_accordion_] = tabAlter;
					lt.navElems[_accordion_] = lt.navElems[_accordion_].add(tabAlter);

				} else if( type == _accordion_ ) {

					tabInfo[_control_][_tabs_] = tabAlter;
					tabInfo[_control_][_accordion_] = tab;
					lt.navElems[_tabs_] = lt.navElems[_tabs_].add(tabAlter);

				}

				// Иконка
				if( sets.icon ) {

					tabInfo[_control_][_accordion_]
						[_addClass_](cls.tabIcon)
						.append($('<div class="' + cls.icon + '">' + sets.icon + '</div>'));

				}
				
				lt[_controls_][index] = tabInfo;

				if( active )
					_[_active_][index] = tabInfo;

			});
		}

	};


	/**
	 * Открытие вкладки
	 *
	 * @param {Number|String|Object} tab - Индекс(число), ID(строка) или Object вкладки
	 * @param {Boolean=false} forcibly - Принудительный режим запуска
	 * @param {Number=} fade - Продолжительность анимации, мс
	 *
	 * @public
	 */
	fn.open = function(tab, forcibly, fade) {
		var _ = this,
			 mode = _.mode,
			 cls = _.sets.classes,
			 fade = (fade >= 0) ? fade : _.sets.fade,
			 targetTab = _.getTab(tab);

		// Вкладка не найдена или открыта — выход
		if( !targetTab || targetTab[_status_] ) return;

		// Непринудительный запуск в табах
		if( !forcibly && mode == _tabs_ )
			_.closeAll(true); // принудительно

		// Открытие
		targetTab[_content_]
			.add(targetTab[_control_][_tabs_])
			.add(targetTab[_control_][_accordion_])
			[_addClass_](cls[_active_]);
		targetTab[_status_] = 1;
		_[_active_][targetTab.index] = targetTab;

		if( !forcibly )
		// Callback: 'afterOpen'
		$(_.it).trigger('afterOpen.ft', [_, targetTab]);

		// Анимация открытия
		if( _.animation == _auto_ ) {
			if( _.mode == _accordion_ ) {
				targetTab[_content_].slideDown({
					duration: fade,
					easing: 'swing'
				});
			} else {
				targetTab[_content_].fadeIn(fade);
			}
		}

		_.animation = _auto_;

		// console.log( 'Open', _ );

	};


	/**
	 * Закрытие вкладки
	 *
	 * @param {Number|String|Object} tab - Индекс(число), ID(строка) или Object вкладки
	 * @param {Boolean=false} forcibly - Принудительный режим запуска
	 * @param {Number=} fade - Продолжительность анимации, мс
	 *
	 * @public
	 */
	fn.close = function(tab, forcibly, fade) {
		var _ = this,
			 mode = _.mode,
			 cls = _.sets.classes,
			 fade = (fade >= 0) ? fade : _.sets.fade,
			 targetTab = _.getTab(tab);

		// Вкладка не найдена или закрыта — выход
		if( !targetTab || !targetTab[_status_] ) return;

		// В режиме вкладок, не принудительно, не закрывать активную вкладку
		if( !forcibly && mode == _tabs_ && targetTab[_status_] ) return;

		// Закрытие
		targetTab[_content_]
			.add(targetTab[_control_][_tabs_])
			.add(targetTab[_control_][_accordion_])
			.removeClass(cls[_active_]);
		targetTab[_status_] = 0;
		delete _[_active_][targetTab.index];

		if( !forcibly )
		// Callback: 'afterClose'
		$(_.it).trigger('afterClose.ft', [_, targetTab]);

		// Анимация закрытия
		if( _.animation == _auto_ ) {
			if( _.mode == _accordion_ ) {
				targetTab[_content_].slideUp({
					duration: fade,
					easing: 'linear'
				});
			} else {
				targetTab[_content_].hide();
			}
		}

		_.animation = _auto_;
		
		// console.log( 'Close', _ );

	};


	/**
	 * Закрытие всех вкладок
	 * 
	 * @param {Boolean=false} forcibly - Принудительный режим запуска
	 * @param {Number=} fade - Продолжительность анимации, мс
	 * 
	 * @public
	 */
	fn.closeAll = function(forcibly, fade) {
		var _ = this,
			 fade = (fade >= 0) ? fade : _.sets.fade;

		$.each(_.layout[_controls_], function(i, tab) {
			_.close(tab, forcibly, fade);
		});

		// console.log( 'Close All', _ );

	};


	/**
	 * Переключение вкладки в зависимости от текущего режима
	 *
	 * @param {Number|String|Object} tab - Индекс(число), ID(строка) или Object вкладки
	 * @param {Number=} fade - Продолжительность анимации, мс
	 *
	 * @public
	 */
	fn.switch = function(tab, fade) {
		var _ = this,
			 sets = _.sets,
			 mode = _.mode,
			 fade = (fade >= 0) ? fade : _.sets.fade,
			 targetTab = _.getTab(tab);
		
		if( !targetTab ) return;

		// Режим: Tabs
		if( mode == _tabs_ ) {

			// Игнор, если целевая вкладка уже открыта 
			if( targetTab[_status_] ) return;

			_.closeAll(true); // принудительно
			_.open(targetTab, false, fade);

		// Режим: Accordion
		} else if( mode == _accordion_ ) {

			if( sets.collapsible ) {

				targetTab[_status_] ? _.close(targetTab, false, fade) : _.open(targetTab, false, fade);

			} else if( !sets.collapsible ) {

				// Игнор, если целевая вкладка уже открыта 
				if( targetTab[_status_] ) return;

				_.closeAll(false); // принудительно
				_.open(targetTab, false, fade);

			}

		}

		// console.log( 'Переключение вкладки. Режим: ', mode );

	};


	/**
	 * Принимает ID, Index или объект вкладки.
	 * Возвращает объект вкладки
 	 *
 	 * @param {Number|String|Object} tab - Индекс(число), ID(строка) или Object вкладки
 	 *
	 * @public
	 */
	fn.getTab = function(tab) {
		var _ = this,
			 tabs = _.layout[_controls_],
			 tabType = typeof tab,
			 tabTarget;

		switch(tabType) {
			case 'number': {
				tabTarget = tabs[tab];
				break;
			}
			case 'string': {
				tab = tab.replace('#', '');
				tabTarget = tabs[_.getTabIndex(tab)];
				break;
			}
			case 'object': {
				tabTarget = tab;
				break;
			}
		}

		return tabTarget;

	};


	/**
	 * Возвращает Index вкладки по ее ID
	 *
	 * @param {String} id - ID вкладки
	 *
	 * @public
	 */
	fn.getTabIndex = function(id) {
		var _ = this,
			 index;

		id.replace('#', '');
		$.each(_.layout[_controls_], function(i, tab) {
			if( tab.id === id ) {
				index = tab.index;
				return false;
			}
		});

		return index;

	};


	/**
	 * Определение режима отображения
	 *
	 * @public
	 */
	fn.defineMode = function() {
		var _ = this,
			 sets = _.sets,
			 type = sets.type,
			 width;

		// Режим: Tabs
		if( type == _tabs_ ) {

			if( !sets.responsive ) {
				_.changeMode(_tabs_, true);
				return;
			}

			width = $(window).outerWidth();

			// Режим: Tabs Tabs
			if( ( !_.mode || _.mode == _accordion_) && ( width >= sets.breakpoint ) ) {

				_.changeMode(_tabs_, true);

			// Режим: Tabs Accordion
			} else if( ( !_.mode || _.mode == _tabs_) && ( width < sets.breakpoint ) ) {

				_.changeMode(_accordion_, true);

			}

		// Режим: Accordion
		} else if( type == _accordion_ && _.mode != _accordion_ ) {

			_.changeMode(_accordion_, true);

		}

		return _.mode;

	};


	/**
	 * Смена режима отображения
	 *
	 * @param {String} mode - Режим, на который нужно сменить ( 'tabs', 'accordion' )
	 * @param {Boolean=false} flow - Глобальная(true)/Поточная(false) смена режима
	 * @param {Function=} cb - Колбэк-функция. Сработает до выполнения метода changeMode()
	 *
	 * @public
	 */
	fn.changeMode = function(mode, flow, cb) {
		var _ = this,
			 cls = _.sets.classes,
			 active = _[_active_],
			 cb = (typeof cb === 'function' ) ? cb : $.noop;

		if( !mode ) return;

		cb.call(_);

		if( !flow ) {

			// Смена режима по умолчанию
			_.sets.type = mode;

			if( mode == _tabs_ ) {
				_.defineMode();
				return;
			}
		}

		// Callback: beforeChangeMode
		$(_.it).trigger('beforeChangeMode.ft', [_]);

		// Смена текущего режима
		_.mode = mode;

		switch( mode ) {
			case _tabs_: {

				$(_.it).removeClass(cls.mac)[_addClass_](cls.mtb);

				$.each(active, function() {
					_.closeAll(true, 0);
					_.open(this, true, 0);
					return false;
				});

				if( $.isEmptyObject(active) ) _.switch(0, 0);

				break;
			}
			case _accordion_: {

				$(_.it)[_addClass_](cls.mac).removeClass(cls.mtb);

				$.each(active, function() {
					_.open(this, true, 0);
				});

				break;
			}
		}

		// Callback: afterChangeMode
		$(_.it).trigger('afterChangeMode.ft', [_]);

	};


	/**
	 * Формирование настроек
	 *
	 * @param {Object=} opts - Объект с польз. настройками
	 *
	 * @public
	 *
	 */
	fn.defineSets = function(opts) {
		var _ = this,
			 // Настройки: Пользовательские
			 options = _.options = opts || {};
			 // Настройки: Data-атрибут
			 data = _.dataOptions = $(_.it).data('ft') || {};

		if( typeof(data) === 'string' )
			data = { type: data };

		// Настройки: Итоговые
		return _.sets = $.extend(true, {}, FlexTabs.defaults, options, data);

	};


	/**
	 * Деинициализация
	 *
	 * @public
	 * @example
	 * 
	 * $(element).flexTabs('destroy');
	 */
	fn.destroy = function() {
		var _ = this,
			 it = _.it,
			 $it = $(it),
			 ns = '.' + _.ns;

		if( !_.inited ) return;

		// console.log( 'Метод: Destroy', arguments );
		
		$it.empty()
			.html(_.origin.html)
			.off(_.sets.event + ns);

		$(window).off('resize' + ns);

		$.each(_.origin.attrs, function(name, value) {
			$it.attr(name, value);
		});

		delete FlexTabs.instances[$it.attr('id')];
		delete it[_flexTabs_];

	};


	/**
	 * Реинициализация
	 *
	 * @public
	 * @param {object=} newSets - Объект с новыми параметрами
	 * @example
	 * 
	 * $(element).flexTabs('reinit');
	 * $(element).flexTabs('reinit', {});
	 */
	fn.reinit = function(newSets) {
		var _ = this,
			 it = _.it,
			 sets = (typeof newSets == 'object' && Object.keys(newSets).length != 0 )
					  ? newSets : $.extend(true, {}, _.sets, {type:_.origin.type});

		// console.log( 'Метод: Reinit' );

		_.destroy();
		$(it)[_flexTabs_](sets);

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

	$.fn[_flexTabs_] = function() {

		var args = arguments,
			 mth = args[0],
			 length = this.length, i = 0;

		$.each(this, function(i, it) {
			if( typeof mth == 'object' || typeof mth == 'undefined' )
				it[_flexTabs_] = createInstance(it, mth);
			else if( mth == 'init' || mth == 'reinit' )
				it[_flexTabs_] ? getMethod(it, mth, args) : it[_flexTabs_] = createInstance(it, args[1]);
			else getMethod( it, mth, args );

			// Очистка Hash на последней инициализации
			if( FlexTabs.hasHash && (i == length - 1) )
				history.pushState({ a: 'a' }, '', location.href.replace(location.hash, ''));

			i++;
		});

		function getMethod(it, mth, args) {
			if( !(it[_flexTabs_] instanceof FlexTabs) ) return;
			if( !(mth in it[_flexTabs_]) ) return;
			return it[_flexTabs_][mth].apply(it[_flexTabs_], Array.prototype.slice.call(args, 1));
		};

		function createInstance(it, mth) {
			if( it[_flexTabs_] instanceof FlexTabs ) return;
			return new FlexTabs(it, mth);
		};

		return this;
	};

	window.FlexTabs = FlexTabs;

})(jQuery, window);