const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    document.body.classList.toggle('fixed');
    mobileMenu.classList.toggle('open');
});

mobileMenu.addEventListener('click', function (e) {
    let target = e.target;
    if (target.classList.contains('nav-link') || target.classList.contains('mobile-btn')) {
        document.body.classList.toggle('fixed');
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
    }
});
