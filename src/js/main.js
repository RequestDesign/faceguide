
import $ from 'jquery'
import { Navigation, Pagination, Grid, Autoplay, EffectCreative } from 'swiper/modules';
import Swiper from 'swiper';
import { rem } from './utils/constants'


/* import './js/main' */

$(function () {

    initSwipers()
    initdropDowns()
    modalsHandler()
})

function initSwipers() {
    const adv = document.querySelector('.advantages')
    if (adv) {
        new Swiper(adv.querySelector('.swiper'), {
            modules: [Navigation, EffectCreative],
            effect: window.innerWidth > 768 ? "creative" : "slide",
            slidesPerView: 1.2,
            centeredSlides: true,
            initialSlide: 1,
            spaceBetween: rem(3),
            creativeEffect: {

                prev: {
                    translate: ["-140%", 0, -400],
                },
                next: {
                    translate: ["140%", 0, -400],
                },
            },
            breakpoints: {
                768: {
                    spaceBetween: 0,
                    slidesPerView: 3,
                }
            },
            navigation: {
                prevEl: adv.querySelector('.swiper-btn-prev'),
                nextEl: adv.querySelector('.swiper-btn-next')
            }
        })
    }
    const ourProjects = document.querySelector('.our-products')
    if (ourProjects) {
        new Swiper(ourProjects.querySelector('.swiper'), {
            modules: [Navigation],
            spaceBetween: rem(2.4),
            slidesPerView: 2.3,
            centeredSlides: true,
            initialSlide: 2,
            breakpoints: {
                768: {
                    initialSlide: 1,
                    centeredSlides: false,
                    slidesPerView: 4,
                }
            },
            navigation: {
                prevEl: ourProjects.querySelector('.swiper-btn-prev'),
                nextEl: ourProjects.querySelector('.swiper-btn-next'),
            }
        })
    }
    const ourCategories = document.querySelector('.our-categories')
    if (ourCategories) {
        new Swiper(ourCategories.querySelector('.swiper'), {
            modules: [Navigation],
            navigation: {
                prevEl: ourCategories.querySelector('.swiper-btn-prev'),
                nextEl: ourCategories.querySelector('.swiper-btn-next')
            },
            slidesPerView: 1,
            spaceBetween: rem(3),
            breakpoints: {
                768: {
                    slidesPerView: 'auto'
                }
            },
            on: {
                init: (s) => {
                    s.slides.forEach((e, i) => {
                        e.querySelector('.our-categories__slide-count')
                            .textContent = (i + 1).toString().padStart(2, '0')
                    })
                }
            }
        })
    }
    const structure = document.querySelector('.structure')
    if (structure) {
        new Swiper(structure.querySelector('.swiper'), {
            modules: [Navigation, Grid],
            slidesPerView: 1,
            slidesPerGroup: 2,
            spaceBetween: rem(3),
            grid: {
                fill: 'column',
                rows: 2
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    grid: {
                        fill: 'row',
                        rows: 1
                    }
                }
            },
            navigation: {
                prevEl: structure.querySelector('.swiper-btn-prev'),
                nextEl: structure.querySelector('.swiper-btn-next'),
            }
        })
    }

    const catalog = document.querySelector('.catalog')
    if (catalog) {
        new Swiper(catalog.querySelector('.swiper'), {
            modules: [Navigation],
            slidesPerView: 3.3,
            spaceBetween: rem(3),
            centeredSlides: true,
            breakpoints: {
                768: {
                    slidesPerView: 8,
                    centeredSlides: false
                }
            },
            navigation: {
                prevEl: catalog.querySelector('.swiper-btn-prev'),
                nextEl: catalog.querySelector('.swiper-btn-next')
            }
        })
    }
}


function initdropDowns() {
    const ddBtn = $('.drop-down-target')
    if (!ddBtn) return

    ddBtn.on('click', (e) => {
        e.preventDefault()
        e.currentTarget.classList.toggle('_opened')
        e.currentTarget.closest('.drop-down-container')
            .classList.toggle('_opened')
    })

}

function modalsHandler() {
    const modalOpeners = $('[data-modal]'),
        modalClosers = $('.modal-closer'),
        html = $('html')


    if (!modalOpeners || !modalClosers) return

    modalOpeners.on('click', (ev) => {
        const { modal } = ev.currentTarget.dataset

        $(`.modal-${modal}`)
            .fadeIn()
            .addClass('_opened')
        html.addClass('_lock')
    })


    modalClosers.on('click', (ev) => {
        const { classList } = ev.target
        if (!classList.contains('modal-closer')) return

        if (classList.contains('modal')) {
            $(ev.target).fadeOut().removeClass('_opened')

        } else {
            $(ev.target.closest('.modal')).fadeOut().removeClass('_opened')

        }
        html.removeClass('_lock')
    })
}

function initSwichers() {
    /*   const basketDelivery = document.querySelector('.switcher-delivery')
      if (basketDelivery) {
          new Switcher(basketDelivery, 0)
      } */
}