//alert on unlinked anchor
/* ----------------------------------------------------- */
null_link = document.querySelectorAll('a[href="#"]')

null_link.forEach(link => {
    link.onclick = () => {
        alert('Coming soon...')
    }
});
/* ----------------------------------------------------- */

