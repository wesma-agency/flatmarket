$(document).ready(function () {
	$.each($(".js-mobile-menu > li"), function (index, val) {
		let clone = $(val).clone();
		clone.find("a").removeClass("animate-link");
		$("#menu > ul").append(clone);
	});

	let cloneBuutton = $(".header__button").clone();
	cloneBuutton.removeClass("main-btn animButton");
	cloneBuutton.wrap("<li>").parent();
	$("#menu > ul").append(cloneBuutton);

	// Активация мобильного меню

	$("#menu").mmenu({
		extensions: ["pagedim-black", "position-left"],
		navbar: {
			title: `<img src="${$(".header__logo img").attr("src")}">`,
		},
	});

	var $menu = $("#menu");
	var $icon = $(".js-ham");
	var API = $menu.data("mmenu");

	function openMenu() {
		API.open();
	}

	function closeMenu() {
		API.close();
	}

	API.bind("open:finish", function () {
		$icon.addClass("active");
		$("html").addClass("lock");
	});
	API.bind("close:finish", function () {
		$icon.removeClass("active");
		$("html").removeClass("lock");
	});

	$(".js-ham").on("click", openMenu);

	// Скрипт табов
	$(".js-tab").on("click", function (e) {
		e.preventDefault();

		let elementId = $(this).attr("href");

		$(this).parent().find(".js-tab").removeClass("active");

		$(elementId).parent().find(".js-tab-item").removeClass("active");

		$(this).addClass("active");

		$(elementId).addClass("active");
	});

	$("select").niceSelect();

	// Активация range в фильтрах, минимальное значение передается в атрибут data-min-value, максимальное data-max-value,
	//если data-fractional установлено 1 шаг будет целым числом, если 0 шаг дробное число
	$.each($(".wrap-input__range"), function (index, val) {
		let sliderTooltip = function (event, ui) {
			let tooltip = '<span class="tooltip --one"></span>';
			$(val).find(".ui-slider-handle").eq(0).html(tooltip);

			let tooltipTwo = '<span class="tooltip --two"></span>';
			$(val).find(".ui-slider-handle").eq(1).html(tooltipTwo);
		};

		let stepRange,
			minNumber = parseInt($(val).parent().find(".wrap-input__range-input.--one").attr("data-min-value")),
			maxNumber = parseInt($(val).parent().find(".wrap-input__range-input.--two").attr("data-max-value")),
			minCurrentNumber = parseInt($(val).parent().find(".wrap-input__range-input.--one").val()) > 0 ? parseInt($(val).parent().find(".wrap-input__range-input.--one").val()) : minNumber,
			maxCurrentNumber = parseInt($(val).parent().find(".wrap-input__range-input.--two").val()) > 0 ? parseInt($(val).parent().find(".wrap-input__range-input.--two").val()) : maxNumber;
		$(val).attr("data-fractional") == "1" ? (stepRange = 0.01) : (stepRange = 1);
		$(val).slider({
			range: true,
			step: stepRange,
			min: minNumber,
			max: maxNumber,
			values: [minCurrentNumber, maxCurrentNumber],
			create: sliderTooltip,
			slide: function (event, ui) {
				$(val).parent().find(".wrap-input__range-input.--one").val(ui.values[0]);
				$(val).parent().find(".wrap-input__range-input.--two").val(ui.values[1]);

				$(val).parent().find(".ui-slider-handle .tooltip.--one").text(ui.values[0]);
				$(val).parent().find(".ui-slider-handle .tooltip.--two").text(ui.values[1]);
			},
			change: function (event, ui) {
				$(val).parent().find(".wrap-input__range-input.--one").trigger("change");
			},
		});

		$(val).parent().find(".wrap-input__range-input.--one").val($(val).slider("values", 0));
		$(val).parent().find(".wrap-input__range-input.--two").val($(val).slider("values", 1));

		$(val).parent().find(".ui-slider-handle .tooltip.--one").text($(val).slider("values", 0));

		$(val).parent().find(".ui-slider-handle .tooltip.--two").text($(val).slider("values", 1));
	});

	$.each($(".filter-form"), function (index, val) {
		$(val)
			.find(".filter-form__all")
			.on("click", function (e) {
				$(this).toggleClass("active");
				let currentForm = $(this).parents(".filter-form");
				currentForm.find(".filter-form__wrap-input.js-filter-toggle").fadeToggle();
			});
	});

	$(".lightgallery").lightGallery({
		selector: "a",
	});

	$(".product-currency__current").on("click", function (e) {
		$(this).toggleClass("open");
		$(this).parents(".product-currency").find(".product-currency__list").fadeToggle();
	});

	$(".product-currency__item").on("click", function () {
		if (!$(this).hasClass("current")) {
			$(this).parent().find(".product-currency__item").removeClass("current");
			$(this).addClass("current");

			$(this).parents(".product-currency").find(".product-currency__current").text($(this).text());

			$(this).parents(".product-currency").find(".product-currency__list").fadeToggle();
		}
	});

	$(document).on("click", function (e) {
		if (!$(".product-currency__current").is(e.target) && $(".product-currency__current").has(e.target).length == 0 && !$(".product-currency__list").is(e.target) && $(".product-currency__list").has(e.target).length == 0 && !$(".product-currency__list").is(":hidden")) {
			$(".product-currency__list").fadeToggle();
		}
	});

	// Активация плавающего блока консультации
	let stickyElement;

	if ($(".consultation").length > 0) {
		stickyElement = $(".consultation").sticksy({ topSpacing: 10, listen: true }, true);
	}

	$.each($(".product-extensions"), function (index, val) {
		let allEl = $(val).find(".product-extensions__list ul li");
		let visabledEl = parseInt($(val).attr("data-visabled-el"));

		if (parseInt(allEl.length) > visabledEl) {
			$(val).find(".product-extensions__list").append("<span class='product-extensions__views-all'>Еще</span>");

			$.each(allEl, function (i, el) {
				if (i > visabledEl - 1) {
					$(el).addClass("--hidden");
					$(el).css({ display: "none" });
					if (stickyElement != undefined) {
						stickyElement[0].hardRefresh();
					}
				}
			});

			$(val)
				.find(".product-extensions__views-all")
				.on("click", function (e) {
					$(this).toggleClass("active");

					if ($(this).hasClass("active")) {
						$(this).text("Скрыть");
					} else {
						$(this).text("Еще");
					}

					$.each(allEl, function (i, element) {
						if ($(element).hasClass("--hidden")) {
							$(element).fadeToggle();
							if (stickyElement != undefined) {
								stickyElement[0].hardRefresh();
							}
						}
					});
				});
		}
	});

	let TextBlock = $(".js-text-all").find(".js-text-wrap");
	let heightTextBlock = TextBlock.height();

	if (heightTextBlock > 240) {
		if (stickyElement != undefined) {
			stickyElement[0].hardRefresh();
		}

		TextBlock.css({ height: "240px" });
		TextBlock.addClass("--hidden");

		$(".js-text-all").append("<span class='js-text-all-button'>Показать полный текст</span>");

		$(".js-text-all")
			.find(".js-text-all-button")
			.on("click", function (e) {
				$(this).toggleClass("active");

				if ($(this).hasClass("active")) {
					$(this).text("Скрыть текст");
				} else {
					$(this).text("Показать полный текст");
				}

				if (TextBlock.hasClass("--hidden")) {
					TextBlock.css({ height: "100%" });
					if (stickyElement != undefined) {
						stickyElement[0].hardRefresh();
					}
					TextBlock.removeClass("--hidden");
				} else {
					TextBlock.css({ height: "240px" });
					if (stickyElement != undefined) {
						stickyElement[0].hardRefresh();
					}
					TextBlock.addClass("--hidden");
				}
			});
	}

	// ПЛАВНЫЙ ЯКОРЬ
	$(".js-anchor").click(function () {
		let target = $(this).attr("href");
		$("html, body").animate(
			{
				scrollTop: $(target).offset().top - 150,
			},
			800
		);
		return false;
	});

	//===============ANIMATION SCROLL======================
	const animItems = $(".anim-items");

	if (animItems.length > 0) {
		$(window).on("scroll", animOnScroll);
		function animOnScroll() {
			$.each(animItems, function (index, val) {
				const animItem = animItems.eq(index);
				const animItemHeight = animItem.innerHeight();
				const animItemOffset = animItem.offset().top;
				const animStart = 10; // начало анимации при достижении скролом 1/10 части элемента

				let animItemPoint = $(window).height() - animItemHeight / animStart;

				if (animItemHeight > $(window).height()) {
					animItemPoint = $(window).height() - $(window).height() / animStart;
				}

				if ($(window).scrollTop() > animItemOffset - animItemPoint && $(window).scrollTop() < animItemOffset + animItemHeight) {
					animItem.addClass("animate");
					if (stickyElement != undefined) {
						stickyElement[0].hardRefresh();
					}
				} else {
					if (!animItem.hasClass("anim-no-scrollTop")) {
						animItem.removeClass("animate");
					}
				}
			});
		}
		setTimeout(animOnScroll, 0);
	}

	//переключение языков
	$(".js-lang").on("click", function () {
		if (!$(this).hasClass("current")) {
			$(".js-lang").removeClass("current");
			$(this).addClass("current");
		}
	});

	let match = [window.matchMedia("(max-width: 1170px)")];

	function moveFooterItem() {
		if (match[0].matches) {
			$(".footer__column.--js-bottom-one").append($(".footer__info"));
			$(".footer__column.--js-bottom-two").prepend($(".footer__text"));
		} else {
			$(".footer__column.--js-bottom-one").append($(".footer__text"));
			$(".footer__column.--js-bottom-two").prepend($(".footer__info"));
		}
	}

	moveFooterItem();
	match[0].addListener(moveFooterItem);

	function moveHeaderWork() {
		if (match[0].matches) {
			$(".js-ham").before($(".header__work"));
		} else {
			$(".header__middle").append($(".header__work"));
		}
	}

	moveHeaderWork();
	match[0].addListener(moveHeaderWork);

	$(".--js-show-tel").on("click", function (e) {
		let curretText = "Телефон";
		let textPhone = $(this).attr("data-tel");

		if (!$(this).hasClass("show")) {
			e.preventDefault();
			$(this).text(textPhone);
			$(this).addClass("show");
		}
	});

	//Попапы
	$(".js-show-popup").on("click", function (e) {
		e.preventDefault();
		$(".modal").fadeOut();

		$(".popup-overlay").fadeIn();
		$($(this).attr("href")).fadeIn();
		$($(this).attr("href")).css({ "max-height": $(window).height() });

		$("body").addClass("lock");

		if ($(this).hasClass("--video")) {
			let srcVideo = $(this).attr("data-video-src");
			let srcIframe = $($(this).attr("href")).find("iframe").attr("src");
			if (!srcIframe.includes(srcVideo)) {
				$($(this).attr("href"))
					.find("iframe")
					.attr("src", srcIframe + srcVideo);
			}
		}
	});

	$(".js-modal-close").on("click", function (e) {
		$(this).parents(".modal").fadeOut();
		$(".popup-overlay").fadeOut();
		$("body").removeClass("lock");
	});

	$(".popup-overlay").on("click", function (e) {
		$(".modal").fadeOut();
		$(this).fadeOut();
		$("body").removeClass("lock");
	});
});

document.addEventListener(
	"DOMContentLoaded",
	function () {
		let arrSliderCard = document.querySelectorAll(".card-product__slider");

		if (arrSliderCard != null) {
			arrSliderCard.forEach((element) => {
				let cardProductSlider = new Swiper(element, {
					fadeEffect: { crossFade: true },
					speed: 1000,
					virtualTranslate: true,
					slidersPerView: 1,
					effect: "fade",
					pagination: {
						el: element.querySelector(".card-product__pagination"),
					},
				});

				let arrBulet = element.querySelectorAll(".swiper-pagination-bullet");
				arrBulet.forEach((el, index) => {
					el.addEventListener("mouseenter", () => {
						cardProductSlider.slideTo(index);
					});
				});
			});
		}

		let commonSlider = new Swiper(".common-slider__slider", {
			slidesPerView: 1,
			spaceBetween: 30,

			navigation: {
				nextEl: ".common-slider__next",
				prevEl: ".common-slider__prev",
			},

			breakpoints: {
				500: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				600: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				768: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
				1170: {
					slidesPerView: 5,
					spaceBetween: 30,
				},
			},
		});

		let sliderProductSmall = new Swiper(".product-card__slider-small", {
			slidesPerView: 1,
			spaceBetween: 30,

			navigation: {
				nextEl: ".product-card__slider-small-next",
				prevEl: ".product-card__slider-small-prev",
			},

			breakpoints: {
				500: {
					slidesPerView: 2,
					spaceBetween: 30,
				},

				1170: {
					slidesPerView: 3,
					spaceBetween: 43,
				},
			},
		});

		let sliderProductBig = new Swiper(".product-card__slider-big", {
			slidesPerView: 1,
			spaceBetween: 30,

			thumbs: {
				swiper: sliderProductSmall,
			},
		});

		let bookSlider = new Swiper(".consulting-book__slider", {
			slidesPerView: 2,
			spaceBetween: 25,

			navigation: {
				nextEl: ".consulting-book__next",
				prevEl: ".consulting-book__prev",
			},

			breakpoints: {
				600: {
					slidesPerView: 3,
					spaceBetween: 25,
				},

				768: {
					slidesPerView: 2,
					spaceBetween: 25,
				},

				1170: {
					slidesPerView: 4,
					spaceBetween: 32,
				},
			},
		});
	},
	false
);
