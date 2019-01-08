import 'normalize.css/normalize.css';
import './scss/styles.scss';

(function () {
  const form = document.getElementById('contact-us');
  const popUp = document.getElementById('popup-itself');
  const popUpBlock = document.getElementById('popup-block');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    popUpBlock.classList.add('open');

    popUp.classList.add('open');

    document.body.classList.add('fixed');
    window.dataLayer.push({
      'eventCategory': 'site',
      'eventAction': 'contactform',
      'eventLabel': 'submit',
      'eventValue': '',
      'event':'gaEvent',
    });

    popUpBlock.addEventListener('click', function (event) {
      let target = event.target;
      if (target.classList.contains('popup-close') || target.classList.contains('popup-container')) {
        popUpBlock.classList.add('close');

        popUp.classList.add('close');
        setTimeout(function () {
          popUpBlock.classList.remove('open', 'close');
          popUp.classList.remove('open', 'close');
        }, 200);
        document.body.classList.remove('fixed');
      }
    });
  });

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

  // scrollmagic
  let controller = new ScrollMagic.Controller();

  let movementParameters = {y: '+=50', opacity: 0};

  let tween = new TweenMax.from('#features', 1.5, movementParameters);
  let tween1 = new TweenMax.from('#choose-your', 1.5, movementParameters);
  let tween2 = new TweenMax.from('#pricing', 1.5, movementParameters);
  let tween3 = new TweenMax.from('#faq', 1.5, movementParameters);
  let tween4 = new TweenMax.from('#contact-us-section', 1.5, movementParameters);

  let scene = new ScrollMagic.Scene({
    triggerElement: '#features',
    duration: 0,
    offset: -250,
    reverse: false,
  })
      .setTween(tween)
      .addTo(controller);

  let scene1 = new ScrollMagic.Scene({
    triggerElement: '#choose-your',
    duration: 0,
    offset: -100,
    reverse: false,
  })
      .setTween(tween1)
      .addTo(controller);

  let scene2 = new ScrollMagic.Scene({
    triggerElement: '#pricing',
    duration: 0,
    offset: -200,
    reverse: false,
  })
      .setTween(tween2)
      .addTo(controller);

  let scene3 = new ScrollMagic.Scene({
    triggerElement: '#faq',
    duration: 0,
    offset: -200,
    reverse: false,
  })
      .setTween(tween3)
      .addTo(controller);

  let scene4 = new ScrollMagic.Scene({
    triggerElement: '#contact-us-section',
    duration: 0,
    offset: -200,
    reverse: false,
  })
      .setTween(tween4)
      .addTo(controller);

  const pagination = document.getElementById('pagination');
  const arr = document.querySelectorAll('.pag-item');

  pagination.addEventListener('click', function (e) {
    let target = e.target;
    for (let i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        mySwiper.slideTo(i + 1);
      }
    }
  });

  const mySwiper = new Swiper('.swiper-container', {
    slidesPerView: 1.25,
    initialSlide: 0,
    loop: true,
    spaceBetween: 5,
    centeredSlides: true
  });

  const slide1 = document.getElementById('slide1');
  const slide2 = document.getElementById('slide2');
  const slide3 = document.getElementById('slide3');
  const slide4 = document.getElementById('slide4');

  const arrayOfSlides = [slide1, slide2, slide3, slide4];

  mySwiper.on('slideChangeTransitionStart', function () {
    for (let i = 0; i < arrayOfSlides.length; i++) {
      let j = arrayOfSlides.findIndex(x => x.classList.contains('swiper-slide-active')
          || x.classList.contains('swiper-slide-duplicate-active'));
      arr.forEach(function (item) {
        item.classList.remove('active');
      });
      arr[j].classList.add('active');
    }
  });
})();
