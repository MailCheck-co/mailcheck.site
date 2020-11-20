const btnUp = document.querySelector('.btn-top');
const windowHeight = window.innerHeight;
console.log(windowHeight);

function showBtnUp() {
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > windowHeight) {
            btnUp.classList.add('show');
        }else{
            btnUp.classList.remove('show');
        }
        console.log(window.pageYOffset);
    });

}

showBtnUp();
