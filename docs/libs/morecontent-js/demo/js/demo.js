$(document).ready(function() {

	/* Изменение настроек по умолчанию (свойство) */
	// $.fn.moreContent.defaults.color = '#fa0';

	/* Изменение настроек по умолчанию (объект) */
	// $.fn.moreContent.defaults = $.extend(true, {}, $.fn.moreContent.defaults, {
	// 	color: '#bbb'
	// });

	/* Расширить плагин методом */
	// $.fn.moreContent.prototype.newMethod = function() {
	// 	console.log( 'newMethod', this );
	// };

	var example = $('[data-mrc]');

	example.on('beforeInitSwitch.mrc', function(e, inst, sets) {

		// console.log( 'onChange', inst.mode, inst.status );

		// Кнопка DROP
		// inst.layout.drop = $('<button type="button">Показать больше</button>')
		// .on('click', function() {
		// 	inst.layout.self.moreContent('drop', 15, '%');
		// }).appendTo(inst.layout.controls).hide();

		// Прогресс
		// inst.layout.progress = $('<div></div>')
		// 	.insertBefore(inst.layout.content);
	});

	example.on('onChange.mrc', function(e, inst, sets) {

		// console.log( 'onChange', inst.mode, inst.status );

		// Кнопка DROP
		// if( inst.layout.drop ) {

		// 	if( !inst.mode || inst.status ) {
		// 		inst.layout.drop.fadeOut(sets.speed);
		// 	} else {
		// 		inst.layout.drop.fadeIn(sets.speed);
		// 	}

		// }

		// Прогресс
		// if( inst.layout.progress ) {
		// 	inst.layout.progress.text(Math.ceil(inst.curHeight/(inst.fullHeight/100)) + '%');
		// }
		
		// inst.manually = true;

		// content.animate({
		// 	height: height
		// }, 1500, function() {
		// 	inst.afterChange('open');
		// });

	});

	example.on('beforeOpen.mrc', function(e, inst, sets, content, height) {

		// console.log( 'beforeOpen', height );

		// inst.manually = true;

		// content.animate({
		// 	height: height
		// }, 1000, 'easeOutBounce', function() {
		// 	inst.afterChange('open');
		// });
		
	});

	example.on('beforeClose.mrc', function(e, inst, sets, content, height) {

		// console.log( 'beforeClose', height );

		// inst.manually = true;

		// content.animate({
		// 	// opacity: 1,
		// 	height: height
		// }, 1000, 'easeOutBounce', function() {
		// 	inst.afterChange('close');
		// });
		
	});

	example.on('beforeDrop.mrc', function(e, inst, sets, content, height) {

		// console.log( inst.layout.btn.addClass('animated shake') );

		// console.log( 'beforeDrop', height );

		// inst.manually = true;

		// content.animate({
		// 	// opacity: 1,
		// 	height: height
		// }, 1000, 'easeOutBounce', function() {
		// 	inst.afterChange('drop');
		// });
		
	});

	example.on('afterDrop.mrc', function(e, inst, sets, content) {});
	example.on('afterOpen.mrc', function(e, inst, sets, content) {});
	example.on('afterOpen.mrc', function(e, inst, sets, content) {});

	// Инициализация
	example.moreContent({
		// useCss: false,
		// open: true,
		speed: 800,
		// // event: 'mouseover',
		shadow: true,
		easing: 'easeOutBounce'
	});

	// Методы:
	$('.method-controls button').on('click', function() {
		var methName = $(this).data('meth');
		console.log( 'Ручной вызов метода: ' + $(this).text() );
		example.moreContent(methName);
	});

	/*
	
	- Не всегда срабатывает adaptive+animate
	
	*/

});