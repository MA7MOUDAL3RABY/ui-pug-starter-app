$(document).ready(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 10) {
			$('.app-header').addClass('sticky-header');
		} else {
			$('.app-header').removeClass('sticky-header');
		}
	});
});
