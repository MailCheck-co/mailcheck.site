const btnUp = document.querySelector('.btn-top');
const windowHeight = window.innerHeight;

function showBtnUp() {
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > windowHeight) {
            btnUp.classList.add('show');
        }else{
            btnUp.classList.remove('show');
        }
    });

}

showBtnUp();
