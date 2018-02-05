const form = document.getElementById('contact-us');
const popUp = document.getElementById('popup-itself');
const popUpBlock = document.getElementById('popup-block');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    popUp.classList.add("open");
    popUpBlock.classList.add("open");

    document.body.classList.add('fixed');

    popUpBlock.addEventListener("click", function (event) {
        let target = event.target;
        if (target.classList.contains('popup-close') || target.classList.contains("popup-container")) {
            popUpBlock.classList.remove('open');
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

