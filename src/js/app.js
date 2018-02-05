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
            setTimeout( function() {
                popUpBlock.classList.remove('open');
            }, 2000 );
            document.body.classList.remove('fixed');
        }
    })
});





var mySwiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    initialSlide: 0,
    loop: true,
    spaceBetween: 50
});

