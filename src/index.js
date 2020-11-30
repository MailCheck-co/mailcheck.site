import 'normalize.css/normalize.css';
import './scss/styles.scss';

import './js/refer';
import './js/mob-menu';
import './js/scroll';

(function () {
  const contactForm = document.getElementById('contact-us');
  const verifyEmailForm = document.getElementById('verify-email');
  const popUpSuccess = document.getElementById('popup-success');
  const popUpError = document.getElementById('popup-error');
  const popUpBlock = document.getElementById('popup-block');

  verifyEmailForm.addEventListener('submit', (e) => {
    const emailValue = verifyEmailForm.querySelector('input[type=email]').value;
    const socialLinks = document.querySelectorAll('.social-link');
    const validity = document.getElementById('email-risk');
    const closeBtn = document.getElementById('close-btn');

    e.preventDefault();

    fetch('/checkMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailValue
      })
    })
      .then(res => res.json())
      .then((data) => {
          const exist = data.mxExists ? '+' : '-';
          const smpt = data.smtpExists ? '+' : '-';
          const disposable = data.isNotDisposable ? '+' : '-';
          const catchAll = data.isNotSmtpCatchAll ? '+' : '-';
          document.querySelector('.email-results').style.display = 'block';
          document.getElementById('email-result').innerHTML = data.email;
          document.getElementById('exists-result').innerHTML = exist;
          document.getElementById('smtp-result').innerHTML = smpt;
          document.getElementById('rate-result').innerHTML = data.trustRate;
          document.getElementById('disposable-result').innerHTML = disposable;
          document.getElementById('catch-result').innerHTML = catchAll;
          const gravatar = data.gravatar && data.gravatar.entry && data.gravatar.entry[0];
          const links = ((gravatar && gravatar.accounts) || []).reduce((acc, el) => {
            acc[el.shortname] = el.url;
            return acc;
          }, {gravatar: gravatar && gravatar.profileUrl || ''});

          socialLinks.forEach(link => {
            const id = link.title.toLowerCase();
            if (links[id]) {
              link.href = links[id];
              link.classList.add('active');
            } else {
              link.href = '#';
              link.classList.remove('active');
            }

          });
          if (data.trustRate <= 49) {
            validity.innerHTML = 'invalid';
            validity.className = 'error';
          } else if (data.trustRate >= 50 && data.trustRate <= 80) {
            validity.innerHTML = 'risky';
            validity.className = 'warning';
          } else {
            validity.innerHTML = 'valid';
            validity.className = 'success';
          }
      })
      .then(() => verifyEmailForm.reset())
      .catch(e => console.error(e));

    closeBtn.addEventListener('click', () => {
      document.querySelector('.email-results').style.display = 'none';
    })
  });

  contactForm.addEventListener('submit', function (e) {
    const nameValue = contactForm.querySelector('input[type=text]').value;
    const mailValue = contactForm.querySelector('input[type=email]').value;
    const textareaValue = contactForm.querySelector('.input-message').value;
    const referrerValue = document.referrer;

    e.preventDefault();

    const data = {
      name: nameValue,
      email: mailValue,
      subject: textareaValue,
      referrer: referrerValue
    };

    const formData = new FormData();

    for (let name in data) {
      formData.append(name, data[name]);
    }

    fetch('/sendMail', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(res => res.text())
      .then(() => {
        popUpBlock.classList.add('open');
        popUpSuccess.classList.add('open');
        contactForm.reset();
      })
      .catch(e => {
        document.querySelector('popup-text').textContent = e;
        popUpBlock.classList.add('open');
        popUpError.classList.add('open');
      });

    document.body.classList.add('fixed');
    window.dataLayer.push({
      'eventCategory': 'site',
      'eventAction': 'contactform',
      'eventLabel': 'submit',
      'eventValue': '',
      'event': 'gaEvent',
    });

    popUpBlock.addEventListener('click', function (event) {
      let target = event.target;
      if (target.classList.contains('popup-close') || target.classList.contains('popup-container')) {
        popUpBlock.classList.add('close');

                  popUpSuccess.classList.add('close');
                  popUpError.classList.add('close');
                  setTimeout(function () {
                      popUpBlock.classList.remove('open', 'close');
                      popUpSuccess.classList.remove('open', 'close');
                      popUpError.classList.remove('open', 'close');
                  }, 200);
                  document.body.classList.remove('fixed');
              }
          });
      });

  // scrollmagic
  let controller = new ScrollMagic.Controller();

  let movementParameters = { y: '+=50', opacity: 0 };

  let tween = new TweenMax.from('#features', 1.5, movementParameters);
  let tween1 = new TweenMax.from('#choose-your', 1.5, movementParameters);
  let tween2 = new TweenMax.from('#pricing', 1.5, movementParameters);
  let tween3 = new TweenMax.from('#faq', 1.5, movementParameters);
  let tween4 = new TweenMax.from('#contact-us-section', 1.5, movementParameters);
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
    triggerElement: '#contact-us-section',
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

  const mySwiper = new Swiper('.swiper-container', {
    slidesPerView: 2,
    initialSlide: 1, // index of centered slide
    loop: true,
    centeredSlides: true,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  const testimonials = new Swiper('.testimonials-container', {
    slidesPerView: 2,
    spaceBetween: 20,
    wrapperClass: 'testimonials-wrapper',
    slideClass: 'testimonial-slide',
    loop: true,
    navigation: {
      nextEl: '.testimonials-button-next',
      prevEl: '.testimonials-button-prev',
    },
    breakpoints: {
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
      }
    }
  });
})();
