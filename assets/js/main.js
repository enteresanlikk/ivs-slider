(function() {

    document.querySelector('.homeCarousel').W3Slider({
        loop: 1,
        autoplay: 1,
        autoplayHoverPause: 1,
        timeout: 3,
        nav: 1,
        dots: 1,
        activeSlide: 1,
        transition: 1,

        rtl: 0,
        spaceBetween: 5,
        slidesPerView: 2,
        dotNumber: 1,
        direction: 'h'
    });

})();