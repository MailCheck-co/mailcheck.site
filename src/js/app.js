import HammerSlider from "hammer-slider";

if (document.getElementById('hammer-slider')) {
  const slider = HammerSlider(document.getElementById('hammer-slider'), {
    slideSpeed: 60,
    slideShow: true,
    slideInterval: 4000,
    dots: false,
    mouseDrag: true
  });
}
