export class Switcher {
    /**
     * 
     * @param {string | Element } container 
     * @param {number} initstate 
     */
    constructor(container, initstate = null) {
        this._container = typeof container == 'string' ? document.querySelector(container) : container
        this._initState = initstate
        this._btnSelector = '.switcher-btn'
        this._slideSelector = '.switcher-slide'
        this._datasetBtn = 'switchto'
        this._datasetSlide = 'switchslide'
        this._btns = this._initBtns(this._container)
        this._slides = this._initSlides(this._container)

    }


    _initBtns(container) {

        const list = container.querySelectorAll(this._btnSelector)
        

        list.forEach((e, i) => {
            e.setAttribute('data-' + this._datasetBtn, i)
            if (e.tagName == 'INPUT') {
                e.addEventListener('change', (ev) => {
                    e.setAttribute('checked', true)
                    this._switcher(ev)
                })


            } else {
                e.addEventListener('click', (ev) => {
                    ev.preventDefault()
                    this._switcher(ev)
                })
            }

            if (this._initState !== null && i === this._initState) {
                e.classList.add('_opened')
            }
        })
      
        return list
    }


    _initSlides(container) {
        const list = container.querySelectorAll(this._slideSelector)
 
        list.forEach((e, i) => {
            e.setAttribute('data-' + this._datasetSlide, i)

            if (this._initState !== null && i !== this._initState) {
                e.style.display = 'none'
            }
        })
      

        return list
    }


    _switcher(e) {

        if (e.currentTarget.classList.contains('_opened')) return

        e = e.currentTarget

        this._slides.forEach((slide) => {
      
            if (slide.dataset[this._datasetSlide] == e.dataset[this._datasetBtn]) {
                slide.style.display = 'block'

            } else {
                slide.style.display = 'none'
            }
        })

        this._btns.forEach((btn) => {

            if (btn.dataset[this._datasetBtn] == e.dataset[this._datasetBtn]) {
                btn.classList.add('_opened')
            } else if (btn.classList.contains('_opened')) {
                btn.classList.remove('_opened')
            }
        })

    }


}