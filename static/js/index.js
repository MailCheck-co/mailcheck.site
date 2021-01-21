(function () {
  // scrollmagic
  let controller = new ScrollMagic.Controller();

  let movementParameters = { y: '+=50', opacity: 0 };

  let tween = new TweenMax.from('#features', 1.5, movementParameters);
  let tween1 = new TweenMax.from('#choose-your', 1.5, movementParameters);
  let tween2 = new TweenMax.from('#pricing', 1.5, movementParameters);
  let tween3 = new TweenMax.from('#faq', 1.5, movementParameters);
  let tween4 = new TweenMax.from('#contact-us', 1.5, movementParameters);
  let tween5 = new TweenMax.from('#partners', 1.5, movementParameters);
  let tween6 = new TweenMax.from('#reviews', 1.5, movementParameters);
  let tween7 = new TweenMax.from('#team', 1.5, movementParameters);
  let tween8 = new TweenMax.from('#testimonials', 1.5, movementParameters);

  // eslint-disable-next-line no-unused-vars
  let scene = new ScrollMagic.Scene({
    triggerElement: '#features',
    duration: 0,
    offset: -250,
    reverse: false,
  })
    .setTween(tween)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene1 = new ScrollMagic.Scene({
    triggerElement: '#choose-your',
    duration: 0,
    offset: -100,
    reverse: false,
  })
    .setTween(tween1)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene2 = new ScrollMagic.Scene({
    triggerElement: '#pricing',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween2)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene3 = new ScrollMagic.Scene({
    triggerElement: '#faq',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween3)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene4 = new ScrollMagic.Scene({
    triggerElement: '#contact-us',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween4)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene5 = new ScrollMagic.Scene({
    triggerElement: '#partners',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween5)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene6 = new ScrollMagic.Scene({
    triggerElement: '#reviews',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween6)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene7 = new ScrollMagic.Scene({
    triggerElement: '#team',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween7)
    .addTo(controller);

  // eslint-disable-next-line no-unused-vars
  let scene8 = new ScrollMagic.Scene({
    triggerElement: '#testimonials',
    duration: 0,
    offset: -200,
    reverse: false,
  })
    .setTween(tween8)
    .addTo(controller);
})();
