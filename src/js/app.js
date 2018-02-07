document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById('contact-us');
    const popUp = document.getElementById('popup-itself');
    const popUpBlock = document.getElementById('popup-block');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        popUpBlock.classList.add("open");

        popUp.classList.add("open");

        document.body.classList.add('fixed');

        popUpBlock.addEventListener("click", function (event) {
            let target = event.target;
            if (target.classList.contains('popup-close') || target.classList.contains("popup-container")) {
                popUpBlock.classList.add('close');

                popUp.classList.add('close');
                setTimeout(function () {
                    popUpBlock.classList.remove('open', 'close');
                    popUp.classList.remove('open', 'close');
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
            mobileMenu.addEventListener('click', function (event) {
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


    // scrollmagic
    let controller = new ScrollMagic.Controller();


    let tween = new TweenMax.from('#features', 1.5, {y: '+=50', opacity:0});
    let tween1 = new TweenMax.from('#choose-your', 1.5, {y: '+=50', opacity:0});
    let tween2 = new TweenMax.from('#pricing', 1.5, {y: '+=50', opacity:0});
    let tween3 = new TweenMax.from('#faq', 1.5, {y: '+=50', opacity:0});
    let tween4 = new TweenMax.from('#contact-us-section', 1.5, {y: '+=50', opacity:0});

    let scene = new ScrollMagic.Scene({
        triggerElement: "#features",
        duration: 0,
        offset: -250,
        reverse: false,
        })
        .setTween(tween)
        .addTo(controller);

    let scene1 = new ScrollMagic.Scene({
        triggerElement: "#choose-your",
        duration: 0,
        offset: -100,
        reverse: false,
        })
        .setTween(tween1)
        .addTo(controller);

    let scene2 = new ScrollMagic.Scene({
        triggerElement: "#pricing",
        duration: 0,
        offset: -200,
        reverse: false,
    })
        .setTween(tween2)
        .addTo(controller);

    let scene3 = new ScrollMagic.Scene({
        triggerElement: "#faq",
        duration: 0,
        offset: -200,
        reverse: false,
    })
        .setTween(tween3)
        .addTo(controller);

    let scene4 = new ScrollMagic.Scene({
        triggerElement: "#contact-us-section",
        duration: 0,
        offset: -200,
        reverse: false,
    })
        .setTween(tween4)
        .addTo(controller);
});

