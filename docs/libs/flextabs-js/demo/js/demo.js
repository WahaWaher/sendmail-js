$(document).ready(function() {

	function animateCSS(elements, animationName, duration, delay, callback) {

		var duration = duration >= 0 ? duration/1000 : '',
			 delay = delay >= 0 ? delay/1000 : '';

		elements.addClass('animated ' + animationName)
				 .css({
				 	'animation-duration': duration + 's',
				 	'animation-delay': delay + 's',
				 });

		function handleAnimationEnd() {
			elements.removeClass('animated ' + animationName)
			.css({
			 	'animation-duration': '',
			 	'animation-delay': '',
			});
			elements.off('animationend', handleAnimationEnd);
			if (typeof callback === 'function') callback();
		}

		elements.on('animationend', handleAnimationEnd);

	}

	function animateCSSRemove(elements, animationName) {
		elements.removeClass('animated ' + animationName);
	}

	console.time('t');

	var ex = $('[data-ft]');

	// События
	ex.on('afterInit.ft', function(e, instance) {});
	ex.on('afterOpen.ft', function(e, instance, targetTab) {});
	ex.on('afterClose.ft', function(e, instance, targetTab) {});
	ex.on('beforeChangeMode.ft', function(e, instance) {});
	ex.on('afterChangeMode.ft', function(e, instance) {});

	ex.flexTabs('init', {
		// fade: 0,
		// theme: false,
		// icon: false,
		// collapsible: false
	});

	console.timeEnd('t');

	$('[data-meth]').on('click', function() {
		var string = $(this).data('meth').split(':'),
			 meth = string[0],
			 arg =  string[1];

		console.log( 'Ручной вызов метода: ' + $(this).text() );
		ex.flexTabs(meth, arg);
	});

	$('[data-control-meth]').on('click', function() {
		var meth = $(this).attr('data-control-meth'),
			 target = Number($(this).next().val());

		if( meth === 'closeAll' )
			ex.flexTabs(meth);
		else
			ex.flexTabs(meth, target);

	});

	// ex.on('afterOpen.ft', function(e, instance, targetTab) {
	// 	console.log( $(instance.it).attr('id'), instance.active );

	// 	var query = '';
	// 	$.each({
	// 		"animals": [0,1,2],
	// 		"planets": [2,3]
	// 	}, function(instID, params) {
	// 		query += instID;
	// 		if( params ) {
	// 			query += '=';
	// 			for (var i = 0; i < params.length; i++) {
	// 				query += params[i];
	// 				if( i < params.length - 1 )
	// 					query += ',';
	// 			};
	// 		}
	// 		query += '&';
	// 	});
	// 	query = query.replace(/\&$/ig, '');

	// });
	// ex.on('afterClose.ft', function(e, instance, targetTab) {
	// 	console.log( $(instance.it).attr('id'), instance.active );
	// });

});