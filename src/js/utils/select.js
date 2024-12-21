const inputChange = new Event('input')

export default function initSelect() {
    /**
     * кастомный селект хранящий значение в инпуте
     * 1. присваивание нового значения инпуту на прямую
     * (значение для инпута берется из data-value или textContent кнопки)
     * 
     * 2. тригер input ивента на инпуте для тригера валидации формы и записи новго значения
     * 
     * 3-4. переключение дизейбла у кнопок
     * 
     * 5. тригер дропдауна для закрытия
     */

    const selects = document.querySelectorAll('.select')
    if (!selects) return

    selects.forEach((select) => {
        const options = select.querySelectorAll('.select__items-list-e')

        options.forEach((option) => {
            option.addEventListener('click', (ev) => {
                const input = select.querySelector('.select__target-input')

                input.value = ev.target.dataset.value || ev.target.textContent
                input.dispatchEvent(inputChange)

                options.forEach((btn) => btn.removeAttribute('disabled'))
                ev.target.setAttribute('disabled', 'true')
                select.querySelector('.drop-down-target').click()

            })
        })

    })



}