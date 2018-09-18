var navbar = document.querySelector('.navbar')

let lastScroll = window.scrollY
window.onscroll = event => {
    let thisScroll = window.scrollY
    if (lastScroll < thisScroll && thisScroll > 30) {
        navbar.classList.add('hide')
    } else {
        navbar.classList.remove('hide')
    }
    lastScroll = thisScroll
}
