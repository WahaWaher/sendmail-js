;(function($) {

	/**
	 * Настройки по умолчанию
	 *
	 * @default
	 */
	var defaults = {

		height: 175,
		useCss: true,
		speed: 250,
		open: false,
		event: 'click',
		shadow: false,
		easing: 'swing',
		textClose: 'Читать полностью',
		textOpen: 'Свернуть',
		tpl: {
			content: '<div class="mrc-content"></div>',
			contentWrap: '<div class="mrc-content-wrap"></div>',
			btn: '<button class="mrc-btn" type="button"></button>',
			btnWrap: '<div class="mrc-btn-wrap"></div>',
			controls: '<div class="mrc-controls"></div>',
			shadow: '<div class="mrc-shadow"></div>',
		}

	};

	/**
	 * Конструктор
	 *
	 * @constructor
	 * @param {HTMLElement} el - HTML-элемент в DOM
	 * @param {Object=} options - Объект с параметрами
	 */
	var MoreContent = function(el, options) {
		this.$self = el;
		this.init(options);
	}, __, meth = MoreContent.prototype;

	/**
	 * Инициализация
	 *
	 * @public
	 * @param {object={}} options - Объект с параметрами
	 * @example
	 * 
	 * $(element).moreContent('init', {});
	 * $(element).moreContent('init');
	 */
	meth.init = function(options) {
		var _ = this,
			 self = _.$self,
			 $self = $(self),
			 adp;

		// console.log( 'Метод: Init', arguments, _ );

		if( _.inited === true ) return;

		// Настройки: По умолчанию
		_.defaults =  $.extend(true, {}, defaults, $.fn.moreContent.defaults);
		// Настройки: Пользовательские
		_.options = options || {};
		// Настройки: Data-атрибут
		_.dataOptions = $(self).data('mrc') || {};
		// Настройки: Объединенные
		_.settings = sets = $.extend(true, {}, _.defaults, _.options, _.dataOptions);

		_.src = {
			html:  $self.html() || '',
			class: $self.attr('class') || '',
			style: $self.attr('style') || ''
		};

		_.nsid = __.getRndNum(10000, 99999);
		_.status = sets.open;
		
		// Форм. перв. разметки
		_.createMarkup();

		// Опр. режим отображения
		_.getCurMode();

		// Обработчик. Переключатель
		_.layout.btn.on(sets.event, function() {
			_.toggle.call(_);
		});

		// Обработчик. Адаптивность
		adp = __.debounce(function() {
			_.getAdaptive.call(_);
		}, 150);

		$(window).on('resize.mrc-'+_.nsid, adp);

		_.status ? _.open(true) : _.close(true);

		/* SetTimeout с задержкой "sets.speed" для
		учета выполнения методов close/open,
		которые работают с асинхр. "animate" */
		setTimeout(function() {

			// Плагин инициализирован
			_.inited = true;

		}, sets.speed + 5);

	};

	/**
	 * Создает первичную разметку
	 *
	 * @public
	 */
	meth.createMarkup = function() {
		var _    = this,
			 self = _.$self,
			 sets = _.settings,
			 lt   = _.layout = {},
			 cssh;

		// Self
		lt.self = $(self).addClass('mrc');

		// Content
		lt.self.wrapInner(sets.tpl.content);
		lt.content = lt.self.children().css('overflow','hidden');

		// Content Wrap
		lt.content.wrapInner(sets.tpl.contentWrap);
		lt.contentWrap = lt.content.children().css('overflow','hidden');

		// Controls
		lt.controls = $(sets.tpl.controls).appendTo(lt.self);

		// Button
		lt.btn = $(sets.tpl.btn)
					.text(sets.textClose)
					.insertAfter(lt.controls)
					.wrap($(sets.tpl.btnWrap))
					.hide().fadeIn(sets.speed);

		// Button Wrap
		lt.btnWrap = lt.btn.parent().appendTo(lt.controls);

		// Shadow
		if( sets.shadow ) {
			lt.content.css('position', 'relative');
			lt.shadow = $(sets.tpl.shadow).appendTo(lt.content);
		}

		// CSS Height
		if( sets.useCss )
			cssh = parseInt(getComputedStyle(self).maxHeight);

		lt.self.css({
			'max-height': 'none',
			'min-height': 'none'
		});

		if( cssh && cssh > 0 ) {
			_.setContent(cssh);
			sets.height = cssh;
		}

	};


	/**
	 * Устанавливает блок с контентом
	 * на всю высоту 
	 *
	 * @public
	 * @param {boolean=} force - Запуск принудительно, если true
	 * @example
	 *
	 * $(element).moreContent('open');
	 */
	meth.open = function(force) {
		var _    = this,
			 sets = _.settings,
			 lt   = _.layout;

		if( _.status && !force ) return;

		// console.log( 'Метод: Open', _.mode );

		if( !_.mode )
			lt.btnWrap.hide();

		lt.btn.text(sets.textOpen);

		if( sets.shadow ) 
			lt.shadow.fadeOut(sets.speed);

		lt.content.animate({
			height: _.fullHeight + 'px'
		}, ( _.mode ? sets.speed : 0 ), sets.easing, function() {
			_.afterChange('open');
		});

		_.status = true;

	};


	/**
	 * Скрывает часть контента,
	 * который выходит за рамки указанной высоты
	 *
	 * @public
	 * @param {boolean=} force - Запуск принудительно, если true
	 * @example
	 *
	 * $(element).moreContent('close');
	 */
	meth.close = function(force) {
		var _    = this,
			 sets = _.settings,
			 lt   = _.layout;

		if( (!_.status && !force) ) return;

		// console.log( 'Метод: Close', _.mode );

		if( !_.mode && sets.useCss ) _.setContent();

		if( !_.mode )
			lt.btnWrap.hide();

		lt.btn.text(sets.textClose);

		if( sets.shadow ) {
			_.mode ? lt.shadow.fadeIn(sets.speed) : lt.shadow.fadeOut(sets.speed);
		}

		lt.content.animate({
			height: (_.mode ? sets.height : '') + 'px'
		}, sets.speed, sets.easing, function() {
			_.afterChange('close');
		});

		_.status = false;

	};

	/**
	 * Переключает состояния Open/Close
	 *
	 * @public
	 * @example
	 *
	 * $(element).moreContent('tiggle')
	 */
	meth.toggle = function() {
		var _ = this;

		// console.log( 'Метод: Toggle' );

		_.status ? _.close(true) : _.open(true);

	};


	/**
	 * Выполняет опр. действия после завершения методов
	 * "Open", "Close" или "Drop"
	 *
	 * @param {string} act - Имя метода ("open", "close")
	 * @public
	 */
	meth.afterChange = function(act) {
		var _    = this,
			 sets = _.settings,
			 lt   = _.layout;

		_.calcSizes();

		switch(act) {
			case 'open':

				_.setContent();
				lt.self.addClass('open');

				break;

			case 'close':

				lt.self.removeClass('open');

				break;

			default: return;
		}

	};


	/**
	 * Устанавливает высоту
	 * блоку с контентом (без анимации)
	 *
	 * @param {string|number=} i - Кол-во пикселей 
	 * @public
	 */
	meth.setContent = function(i) {

		this.layout.content.css('height', i || '');

	};


	/**
	 * Пересчитывает полную высоту контента
	 * и высоту видимой его части, заносит в экземпляр объекта
	 *
	 * @public
	 */
	meth.calcSizes = function() {
		var _    = this,
			 sets = _.settings,
			 lt   = _.layout;

		_.curHeight  = lt.content.get(0).clientHeight || 0;
		_.fullHeight = lt.contentWrap.get(0).clientHeight || 0;

	};


	/**
	 * Получает и устанавливает условный режим отображения (mode),
	 * который используется для решения проблем, связанных с 
	 * некорректным отображением эл-ов в случае, если высота контента
	 * менее указанной в параметрах высоты.
	 * (используется при адаптивности)
	 *
	 * @public
	 */
	meth.getCurMode = function() {
		var _    = this,
			 sets = _.settings,
			 h    = sets.height;

		_.calcSizes();

		if( _.fullHeight >= h && _.mode != true ) _.mode = true;
		else if( _.fullHeight < h && _.mode != false ) _.mode = false;

	};


	/**
	 * Корректирует отображение некоторых эл-ов
	 * при изменении ширины окна браузера
	 *
	 * @public
	 */
	meth.getAdaptive = function() {
		var _    = this,
			 sets = _.settings,
			 lt   = _.layout,
			 height;

		_.getCurMode();

		if( _.mode ) {
		
			lt.btnWrap.fadeIn(sets.speed);

			if( _.status ) _.setContent();
			else {
				_.setContent(_.curHeight);
				if( sets.shadow ) lt.shadow.fadeIn(sets.speed);
			}

		} else {

			lt.btnWrap.hide();
			_.setContent();
			if( sets.shadow )
				lt.shadow.fadeOut(sets.speed);

		}

	};

	__ = {

		/**
		 * Генерирует случайное число
		 * Назначение: Обработчики событий (пространства имен)
		 *
		 * @private
		 * @param {Number} min - целое число "от"
		 * @param {Number} max - целое число "до"
		 */
		getRndNum: function(min, max) {
			return Math.round(min - 0.5 + Math.random() * (max - min + 1));
		},

		/**
		 * Не позволяет указ. функции выполниться более одного раза
		 * в заданный промежуток времени
		 *
		 * @private
		 * @param {function} fn - выполняемая функция
		 * @param {Number} wait - задержка, мс
		 */
		debounce: function(fn, wait) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					fn.apply(context, args);
				};
				var callNow = !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) fn.apply(context, args);
			};
		}
	};

	$.fn.moreContent = function() {

		var pn = 'MoreContent',
			 args = arguments,
			 mth = args[0];

		$.each(this, function(i, it) {
			if( typeof mth == 'object' || typeof mth == 'undefined' )
				it[pn] = crtInst(it, mth);
			else if( mth === 'init' )
				it[pn] ? getMeth(it, mth, args) : it[pn] = crtInst(it, args[1]);
			else getMeth( it, mth, args );
		});

		function getMeth(it, mth, args) {
			if( !(it[pn] instanceof MoreContent) ) return;
			if( !(mth in it[pn]) ) return;
			return it[pn][mth].apply(it[pn], Array.prototype.slice.call(args, 1));
		};

		function crtInst(it, mth) {
			if( it[pn] instanceof MoreContent ) return;
			return new MoreContent(it, mth);
		};

		return this;
	};

	$.fn.moreContent.defaults = defaults;

})(jQuery);