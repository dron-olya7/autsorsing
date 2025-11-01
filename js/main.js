$(document).ready(function(){

	if(localStorage.getItem('citiStorage')){
		$('.select_city_btn span').text(localStorage.getItem('citiStorage'));
		$('input[name="cityval"]').each(function(){
			$(this).val(localStorage.getItem('citiStorage'));
		});
	}

	$(document).on('click', 'ul#insideCitiesJs li', function(){
		var thisCityVal = $(this).text();
		localStorage.setItem('citiStorage', thisCityVal);
		$('.select_city_btn span').text(thisCityVal);
		$('input[name="cityval"]').each(function(){
			$(this).val(thisCityVal);
		});
		$('.openedPopup').removeClass('openedPopup');
		console.log(thisCityVal);
	});

	$('.mobile_menu').click(function(){
		$(this).parent().toggleClass('openedMenu');
	});

    $('a[href^="#"]').click(function(){
        var linkPath = $(this).attr('href');
        $('html, body').animate({ scrollTop: $(linkPath).offset().top - 100 }, 500);
        $('.main_menu').removeClass('openedMenu');
        return false;
    });

	$(window).scroll(scroll_active);

    // Animation
	$(".image_about, .item_work, .item_podbor").animated("fadeInDown");
    $('.block_reviews, .block_pisma').animated("fadeIn");
    $(".left_block_about").animated("fadeInLeftBig");

	$(".scroll_block").niceScroll();

	var listCities = $('#cities_list').html();
	$('#insertSities').html('<ul id="insideCitiesJs">' + listCities + '</ul>');

	$('.title_question').click(function(){
		$(this).parent().toggleClass('openQuestion');
	});


	$('.zakazat_pers').on('click', function(){
		var pers = $(this).parent().parent().find('.title_podbor').text().trim();
		$('.popup.form .user_hepl').val(pers);
		$('.shadow').addClass('openedPopup');
		$('.popup.form').addClass('openedPopup');
		$('.popup.form input[type="submit"]').val('Подобрать');
	});
	$('.zakazat_zvonok').on('click', function(){
		$('.shadow').addClass('openedPopup');
		$('.popup.form').addClass('openedPopup');
		$('.popup.form input[type="submit"]').val('Получить коммерческое предложение');
	});
	$('.shadow, .close_popup').click(function(){
		$('.popup.form .user_hepl').val('');
		$('.openedPopup').removeClass('openedPopup');
	});
	$('.shadow, .close_popup_form').click(function(){
		$('.popup.form .user_hepl').val('');
		$('.openedPopup').removeClass('openedPopup');
	});
	$('.select_city_btn').click(function(){
		$('.shadow').addClass('openedPopup');
		$('.popup.cities').addClass('openedPopup');
	});

    $('#slider').rotateSlider({
        'itemClass': 'item_review'
    });

	var before_tri_grey_width = parseInt($('.before_tri_grey').width())/2;
	var before_tri_grey_height = parseInt($('.before_tri_grey').height())/2;
	$('.before_tri_grey').css({
		'border-left-width': before_tri_grey_width + 'px',
		'border-right-width': before_tri_grey_width + 'px',
		'border-top-width': before_tri_grey_height + 'px',
		'border-bottom-width': before_tri_grey_height + 'px'
	});

	var before_tri_grey_seo_width = parseInt($('.before_tri_grey_seo').width())/2;
	var before_tri_grey_seo_height = parseInt($('.before_tri_grey_seo').height())/2;
	$('.before_tri_grey_seo').css({
		'border-left-width': before_tri_grey_seo_width + 'px',
		'border-right-width': before_tri_grey_seo_width + 'px',
		'border-top-width': before_tri_grey_seo_height + 'px',
		'border-bottom-width': before_tri_grey_seo_height + 'px'
	});


	var after_tri_white_width = parseInt($('.after_tri_white').width())/2;
	var after_tri_white_height = parseInt($('.after_tri_white').height())/2;
	$('.after_tri_white').css({
		'border-left-width': after_tri_white_width + 'px',
		'border-right-width': after_tri_white_width + 'px',
		'border-top-width': after_tri_white_height + 'px',
		'border-bottom-width': after_tri_white_height + 'px'
	});

	var after_tri_white_seo_width = parseInt($('.after_tri_white_seo').width())/2;
	var after_tri_white_seo_height = parseInt($('.after_tri_white_seo').height())/2;
	$('.after_tri_white_seo').css({
		'border-left-width': after_tri_white_seo_width + 'px',
		'border-right-width': after_tri_white_seo_width + 'px',
		'border-top-width': after_tri_white_seo_height + 'px',
		'border-bottom-width': after_tri_white_seo_height + 'px'
	});

	var before_work_white_width = parseInt($('.before_work_white').width())/2;
	$('.before_work_white').css({
		'border-left-width': before_work_white_width + 'px',
		'border-right-width': before_work_white_width + 'px'
	});
	
	var after_work_white_width = parseInt($('.after_work_white').width())/2;
	$('.after_work_white').css({
		'border-left-width': after_work_white_width + 'px',
		'border-right-width': after_work_white_width + 'px'
	});

	var bottom_review_grey_width = parseInt($('.bottom_review_grey').width())/2;
	$('.bottom_review_grey').css({
		'border-left-width': bottom_review_grey_width + 'px',
		'border-right-width': bottom_review_grey_width + 'px'
	});

});
$(window).on('scroll', function(){
	if ($(window).scrollTop() > 20){
		$('.header').addClass('fixed_mini');
	} else {
		$('.header').removeClass('fixed_mini');
	}
});
$(window).on('resize', function(){

	var before_tri_grey_width = parseInt($('.before_tri_grey').width())/2;
	var before_tri_grey_height = parseInt($('.before_tri_grey').height())/2;
	$('.before_tri_grey').css({
		'border-left-width': before_tri_grey_width + 'px',
		'border-right-width': before_tri_grey_width + 'px',
		'border-top-width': before_tri_grey_height + 'px',
		'border-bottom-width': before_tri_grey_height + 'px'
	});

	var before_tri_grey_seo_width = parseInt($('.before_tri_grey_seo').width())/2;
	var before_tri_grey_seo_height = parseInt($('.before_tri_grey_seo').height())/2;
	$('.before_tri_grey_seo').css({
		'border-left-width': before_tri_grey_seo_width + 'px',
		'border-right-width': before_tri_grey_seo_width + 'px',
		'border-top-width': before_tri_grey_seo_height + 'px',
		'border-bottom-width': before_tri_grey_seo_height + 'px'
	});


	var after_tri_white_width = parseInt($('.after_tri_white').width())/2;
	var after_tri_white_height = parseInt($('.after_tri_white').height())/2;
	$('.after_tri_white').css({
		'border-left-width': after_tri_white_width + 'px',
		'border-right-width': after_tri_white_width + 'px',
		'border-top-width': after_tri_white_height + 'px',
		'border-bottom-width': after_tri_white_height + 'px'
	});

	var after_tri_white_seo_width = parseInt($('.after_tri_white_seo').width())/2;
	var after_tri_white_seo_height = parseInt($('.after_tri_white_seo').height())/2;
	$('.after_tri_white_seo').css({
		'border-left-width': after_tri_white_seo_width + 'px',
		'border-right-width': after_tri_white_seo_width + 'px',
		'border-top-width': after_tri_white_seo_height + 'px',
		'border-bottom-width': after_tri_white_seo_height + 'px'
	});

	var before_work_white_width = parseInt($('.before_work_white').width())/2;
	$('.before_work_white_width').css({
		'border-left-width': before_work_white_width + 'px',
		'border-right-width': before_work_white_width + 'px'
	});
	
	var after_work_white_width = parseInt($('.after_work_white').width())/2;
	$('.after_work_white').css({
		'border-left-width': after_work_white_width + 'px',
		'border-right-width': after_work_white_width + 'px'
	});

	var bottom_review_grey_width = parseInt($('.bottom_review_grey').width())/2;
	$('.bottom_review_grey').css({
		'border-left-width': bottom_review_grey_width + 'px',
		'border-right-width': bottom_review_grey_width + 'px'
	});

});


function scroll_active() {
    let window_top = $(window).scrollTop();
    let sections = [
        { id: '#podbor', offset: $('#podbor').offset().top - 100 },
        { id: '#benefit', offset: $('#benefit').offset().top - 100 },
        { id: '#about', offset: $('#about').offset().top - 100 },
		{ id: '#seo', offset: $('#seo').offset().top - 100 },
        { id: '#work', offset: $('#work').offset().top - 100 },
        { id: '#reviews', offset: $('#reviews').offset().top - 100 },
        { id: '#question', offset: $('#question').offset().top - 100 }
    ];
    
    $(".main_menu li a, .menu_f a").removeClass("active");
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (window_top >= sections[i].offset) {
            $('a[href="' + sections[i].id + '"]').addClass("active");
            break;
        }
    }
    
    // Если мы в самом верху, активируем первый пункт
    if (window_top < sections[0].offset) {
        $('a[href="' + sections[0].id + '"]').addClass("active");
    }
}


