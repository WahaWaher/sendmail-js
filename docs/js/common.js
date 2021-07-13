$(document).ready(function() {

	/* SVG For Everybody */
	svg4everybody();


	/* StickyNav: Start */
	var nav = $('.nav-doc');
	$(window).scroll(function() {

		var top = $(document).scrollTop();

		if( top >= nav.parent().offset().top )
			nav.addClass('fixed');
		else nav.removeClass('fixed');

	}).scroll();
	/* StickyNav: End */

	/* Scroll to block: Start */
	$('.scroll-to').click(function() {
		var id = $(this).attr('href'),
			 dest = 0;

		if( id == '#top' ) dest = 0;
		else dest = $(id).offset().top;

		jQuery('html:not(:animated),body:not(:animated)').animate({
			scrollTop: dest
		}, 750);
		
		// if( id ) document.location = id;
		// else if( id == '#top' ) document.location = '';
		// else document.location = '';

		return false;

	});
	/* Scroll to block: End */

	/* Back to top button: Start */
	var scrHeight = $(window).height(),
	    topBtn = $('#top-button'),
		 topShow = scrHeight, // Не показывать до (scrHeight или Number), px 
		 topSpeed = 1000; // Скорость прокрутки, мс 

	function topCalc() {
		var topScroll = $(window).scrollTop();

		if ( topScroll > topShow && ( topBtn.attr('class') == '' || topBtn.attr('class') == undefined ) )
			topBtn.fadeIn().removeClass('down').addClass('up').attr('title', 'Наверх');
		if ( topScroll < topShow && topBtn.attr('class') == 'up' )
			topBtn.fadeOut().removeClass('up down');
		if ( topScroll > topShow && topBtn.attr('class') == 'down' )
			topBtn.fadeIn().removeClass('down').addClass('up');
	}

	$(window).bind('scroll', topCalc);
	var lastPos = 0;

	topBtn.bind('click', function() {
		var topScroll = $(window).scrollTop();

		if ( topBtn.attr('class') == 'up' ) {
			lastPos = topScroll;
			$(window).unbind('scroll', topCalc);
			
			$('body, html').animate({
				scrollTop: 0
			}, topSpeed, 'easeOutQuart', function () {
				topBtn.removeClass('up').addClass('down').attr('title', 'Вернуться');
				$(window).bind('scroll', topCalc);
			});
		}
		if ( topBtn.attr('class') == 'down' ) {
			$(window).unbind('scroll', topCalc);
			
			$('body, html').animate({
				scrollTop: lastPos
			}, topSpeed, 'easeOutQuart', function () {
				topBtn.removeClass('down').addClass('up').attr('title', 'Наверх');
				$(window).bind('scroll', topCalc);
			});
		}
	});
	/* Back to top button: End */

});