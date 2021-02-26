/*!
 * Bootstrap 4 multi dropdown navbar (https://github.com/bootstrapthemesco/bootstrap-4-multi-dropdown-navbar)
 * Copyright 2017.
 * Licensed under the GPL license
 */
$(document).ready(function(){$(".dropdown-menu a.dropdown-toggle").on("click",function(){var o=$(this),s=$(this).offsetParent(".dropdown-menu");return $(this).next().hasClass("show")||$(this).parents(".dropdown-menu").first().find(".show").removeClass("show"),$(this).next(".dropdown-menu").toggleClass("show"),$(this).parent("li").toggleClass("show"),$(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown",function(){$(".dropdown-menu .show").removeClass("show")}),s.parent().hasClass("navbar-nav")||o.next().css({top:o[0].offsetTop,left:s.outerWidth()-4}),!1})});