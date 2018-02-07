const form = document.getElementById('contact-us');
const popUp = document.getElementById('popup-itself');
const popUpBlock = document.getElementById('popup-block');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    popUpBlock.classList.add("open");

    document.body.classList.add('fixed');

    popUpBlock.addEventListener("click", function (event) {
        let target = event.target;
        if (target.classList.contains('popup-close') || target.classList.contains("popup-container")) {
            popUpBlock.classList.add('close');
            setTimeout(function () {
                popUpBlock.classList.remove('open', 'close');
            }, 1000);
            document.body.classList.remove('fixed');
        }
    })
});


const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', function () {
    if (!burger.classList.contains('open')) {
        burger.classList.add('open');
        document.body.classList.add('fixed');
        mobileMenu.classList.add('open');
        mobileMenu.addEventListener('click',  function (event) {
            let target = event.target;
            if (target.classList.contains('nav-link') || target.classList.contains('mobile-btn')) {
                mobileMenu.classList.add('close');
                burger.classList.remove('open');
                setTimeout(function () {
                    mobileMenu.classList.remove('open');
                    document.body.classList.remove('fixed');
                    mobileMenu.classList.remove('open');
                    mobileMenu.classList.remove('close');
                }, 1000);
            }
        });
    } else {
        mobileMenu.classList.add('close');
        burger.classList.remove('open');
        setTimeout(function () {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('fixed');
            mobileMenu.classList.remove('open');
            mobileMenu.classList.remove('close');
        }, 1000);
    }
});


var mySwiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    initialSlide: 0,
    loop: true,
    spaceBetween: 50
});

