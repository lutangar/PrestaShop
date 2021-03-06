/*
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2014 PrestaShop SA
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

$(document).ready(function() {

	$("[name^='checkBoxShopGroupAsso_theme']").change(function(){
		$(this).parents('.tree-folder').find("[name^='checkBoxShopAsso_theme']").each(function(){
			var id = $(this).attr('value');
			var checked = $(this).prop('checked');
			toggleShopModuleCheckbox(id, checked);
		});
	});

	$("[name^='checkBoxShopAsso_theme']").click(function(){
		var id = $(this).attr('value');
		var checked = $(this).prop('checked');
		toggleShopModuleCheckbox(id, checked);
	});

	//set main navigation aside
	function navSidebar(){
		var sidebar = $('#nav-sidebar');
		sidebar.off();
		$('.expanded').removeClass('expanded');
		$('.maintab').not('.active').closest('.submenu').hide();
		sidebar.on('click','.submenu_expand', function(){
			var $navId = $(this).parent();
			$('.submenu-collapse').remove();
			if($('.expanded').length ){
				$('.expanded > ul').slideUp('fast', function(){
					var $target = $('.expanded');
					$target.removeClass('expanded');
					$($navId).not($target).not('.active').addClass('expanded');
					$($navId).not($target).not('.active').children('ul:first').hide().slideDown();
				});
			}
			else {
				$($navId).not('.active').addClass('expanded');
				$($navId).not('.active').children('ul:first').hide().slideDown();
			}
		});
		//sidebar menu collapse
		sidebar.find('.menu-collapse').on('click',function(){
			$('body').toggleClass('page-sidebar-closed');
			$('.expanded').removeClass('expanded');
			$.ajax({
				url: "index.php",
				cache: false,
				data: "token="+employee_token+'&ajax=1&action=toggleMenu&tab=AdminEmployees&collapse='+Number($('body').hasClass('page-sidebar-closed'))
			});
		});
	}

	//set main navigation on top
	function navTopbar(){
		$('#nav-sidebar').attr('id','nav-topbar');
		var topbar = $('#nav-topbar');
		topbar.off();
		$('span.submenu_expand').remove();
		$('.expanded').removeClass('expanded');
		// expand elements with submenu
		topbar.on('mouseenter', 'li.has_submenu', function(){
			$(this).addClass('expanded');
		});
		topbar.on('mouseleave', 'li.has_submenu', function(){
			$(this).removeClass('expanded');
		});
		// hide element over menu width on load
		topbar.find('li.maintab').each(function(){
			navTopbarEllipsis();
		});
		//hide element over menu width on resize
		$(window).on('resize', function() {
			navTopbarEllipsis();
		});
	}
	//agregate out of bounds items from top menu into ellipsis dropdown
	function navTopbarEllipsis() {
		var ellipsed = [];
		$('#ellipsistab').remove();
		$('#nav-topbar ul.menu').find('li.maintab').each(function(){
			$(this).removeClass('hide');
			if ($(this).position().top > 0) {
				ellipsed.push($(this));
				$(this).addClass('hide');
			}
		});
		if (ellipsed.length > 0) {
			$('#nav-topbar ul.menu').append('<li id="ellipsistab" class="subtab has_submenu"><a href="#"><i class="icon-ellipsis-horizontal"></i></a><ul id="ellipsis_submenu" class="submenu"></ul></li>');
			for (var i = 0; i < ellipsed.length; i++) {
				$('#ellipsis_submenu').append('<li class="subtab has_submenu">'+ellipsed[i].html()+'</li>');
			}
		}
	}

	//set main navigation for mobile devices
	function mobileNav() {
		// clean actual menu type
		// get it in navigation whatever type it is
		var navigation = $('#nav-sidebar,#nav-topbar');
		var submenu = "";
		// clean trigger
		navigation.off().attr('id','nav-mobile');
		$('span.menu-collapse').off();
		navigation.on('click.collapse','span.menu-collapse',function(){
			if ($(this).hasClass('expanded')){
				$(this).html('<i class="icon-align-justify"></i>');
				navigation.find('ul.menu').hide();
				navigation.removeClass('expanded');
				$(this).removeClass('expanded');
				//remove submenu when closing nav
				$('#nav-mobile-submenu').remove();
			}
			else {
				$(this).html('<i class="icon-remove"></i>');
				navigation.find('ul.menu').removeClass('menu-close').show();
				navigation.addClass('expanded');
				$(this).addClass('expanded');
			}
		});
		//get click for item which has submenu
		navigation.on('click.submenu','.maintab.has_submenu a.title', function(e){
			e.preventDefault();
			navigation.find('.menu').addClass('menu-close');
			$('#nav-mobile-submenu').remove();
			//create submenu
			submenu = $('<ul id="nav-mobile-submenu" class="menu"><li><a href="#" id="nav-mobile-submenu-back"><i class="icon-arrow-left"></i>'+ $(this).html() +'</a></li></ul>');
			submenu.append($(this).closest('.maintab').find('.submenu').html());
			//show submenu
			navigation.append(submenu);
			submenu.show();
		});
		navigation.on('click.back','#nav-mobile-submenu-back',function(e){
			e.preventDefault();
			submenu.remove();
			navigation.find('.menu').removeClass('menu-close').show();
		});
	}

	//unset mobile nav
	function removeMobileNav(){
		var navigation = $('#nav-mobile');
		$('#nav-mobile-submenu').remove();
		$('span.menu-collapse').html('<i class="icon-align-justify"></i>');
		navigation.off();
		if ($('body').hasClass('page-sidebar')){
			navigation.attr('id',"nav-sidebar");
			navSidebar();
		} else if ($('body').hasClass('page-sidebar')){
			navigation.attr('id',"nav-topbar");
			navTopbar();
		}
	}

	// switch between top and side nav without reloading page
	function navSwitch(){
		if ($('body').hasClass('page-sidebar')){
			navTopbar();
		} else {
			navSidebar();
		}
	}

	//init main navigation
	function initNav(){
		if ($('body').hasClass('page-sidebar')){
			navSidebar();
		}
		else if ($('body').hasClass('page-topbar')) {
			navTopbar();
		}
	}
	initNav();

	// prevent mouseout + direct path to submenu on sidebar uncollapsed navigation + avoid out of bounds
	var closingMenu, openingMenu;
	$('li.maintab.has_submenu').hover(function() {
		var submenu = $(this);
		if (submenu.is('.active') && submenu.children('ul.submenu').is(':visible')) {
			return;
		}
		clearTimeout(openingMenu);
		clearTimeout(closingMenu);
		openingMenu = setTimeout(function(){
			$('li.maintab').removeClass('hover');
			$('ul.submenu.outOfBounds').removeClass('outOfBounds').css('top',0);
			submenu.addClass('hover');
			h = $( window ).height();
			x = submenu.find('.submenu li').last().offset();
			l = x.top + submenu.find('.submenu li').last().height();
			f = 25;
			if ($('#footer').is(':visible')){
				f = $('#footer').height() + f;
			}
			s = $(document).scrollTop();
			position = h - l - f + s;
			var out = false;
			if ( position < 0) {
				out = true;
				submenu.find('.submenu').addClass('outOfBounds').css('top', position);
			}
		},50);
	}, function() {
		var submenu = $(this);
		closingMenu = setTimeout(function(){
			submenu.removeClass('hover');
		},250);
	});

	$('ul.submenu').on('mouseenter', function(e){
		clearTimeout(openingMenu);
	});

	//bootstrap components init
	$('.dropdown-toggle').dropdown();
	$('.label-tooltip, .help-tooltip').tooltip();
	$('#error-modal').modal('show');

	//scroll top
	function animateGoTop() {
		if ($(window).scrollTop()) {
			$('#go-top:hidden').stop(true, true).fadeIn();
			$('#go-top:hidden').removeClass('hide');
		} else {
			$('#go-top').stop(true, true).fadeOut();
		}
	}
	//show footer when reach bottom
	function animateFooter(){
		if($(window).scrollTop() + $(window).height() === $(document).height()) {
			$('#footer:hidden').removeClass('hide');
		} else {
			$('#footer').addClass('hide');
		}
	}
	//init footer
	animateFooter();

	// go on top of the page
	$('#go-top').on('click',function() {
		$('html, body').animate({ scrollTop: 0 }, 'slow');
		return false;
	});

	$(window).scroll(function() {
		animateGoTop();
		animateFooter();
	});

	// 
	function toggleShopModuleCheckbox(id_shop, toggle){
		var formGroup = $("[for='to_disable_shop"+id_shop+"']").parent();
		if (toggle === true) {
			formGroup.removeClass('hide');
			formGroup.find('input').each(function(){$(this).prop('checked', 'checked');});
		}
		else {
			formGroup.addClass('hide');
			formGroup.find('input').each(function(){$(this).prop('checked', '');});
		}
	}

	//media queries - depends of enquire.js
	enquire.register('screen and (max-width: 768px)', {
		match : function() {
			$('body.page-sidebar').addClass('page-sidebar-closed');
		},
		unmatch : function() {
			$('body.page-sidebar').removeClass('page-sidebar-closed');
		}
	});
	enquire.register('screen and (max-width: 480px)', {
		match : function() {
			$('body').addClass('mobile-nav');
			mobileNav();
		},
		unmatch : function() {
			$('body').removeClass('mobile-nav');
			removeMobileNav();
		}
	});

	// search with nav sidebar closed
	$(document).on('click', '.page-sidebar-closed .searchtab' ,function(){
		$(this).addClass('search-expanded');
		$(this).find('#bo_query').focus();
	});
	$('#bo_query').on('blur',function(){
		$('.searchtab').removeClass('search-expanded');
	});

	//erase button search input
	if ($('#bo_query').val() !== ''){
		$('.clear_search').removeClass('hide');
	}
	$('.clear_search').on('click', function(e){
		e.preventDefault();
		$('#bo_query').val('').focus();
		$('.clear_search').addClass('hide');
	});
	$('#bo_query').on('change', function(){
		if ($('#bo_query').val() !== ''){
			$('.clear_search').removeClass('hide');
		}
	});

	// open contextual help into popup
	$('a.btn-help').on('click', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		window.open(
			url,
			'PrestaShop',
			'width=500,height=600,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=50,top=50'
		);
	});
});

function confirm_modal(heading, question, left_button_txt, right_button_txt, left_button_callback, right_button_callback) {
	var confirmModal =
		$('<div class="bootstrap modal hide fade">' +
			'<div class="modal-dialog">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<a class="close" data-dismiss="modal" >&times;</a>' +
			'<h3>' + heading + '</h3>' +
			'</div>' +

			'<div class="modal-body">' +
			'<p>' + question + '</p>' +
			'</div>' +
			'<div class="modal-footer">' +
			'<a href="#" id="confirm_modal_left_button" class="btn btn-primary">' +
			left_button_txt +
			'</a>' +
			'<a href="#" id="confirm_modal_right_button" class="btn btn-primary">' +
			right_button_txt +
			'</a>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');

	confirmModal.find('#confirm_modal_left_button').click(function (event) {
		left_button_callback();
		confirmModal.modal('hide');
	});

	confirmModal.find('#confirm_modal_right_button').click(function (event) {
		right_button_callback();
		confirmModal.modal('hide');
	});
	confirmModal.modal('show');
};

$(".reset_ready").click(function () {
	var href = $(this).attr('href');
	confirm_modal(header_confirm_reset, body_confirm_reset, left_button_confirm_reset, right_button_confirm_reset,
		function ()
		{
			window.location.href = href + '&keep_data=1';
		}, function ()
		{
			window.location.href = href + '&keep_data=0';
		});
	return false;
});