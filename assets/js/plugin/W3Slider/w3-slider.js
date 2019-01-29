var _,
    sliders,
    sliderCount;

var argsObject = {
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    timeout: 1000,
    nav: true,
    dots: true,
    activeSlide: 1,
    transition: 1,
    onChange: function() {
        console.log('change event');
    }
};

var DOM = {
    slider: 'w3-slider',
    container: 'w3-container',
    row: 'w3-row',
    nav: 'w3-nav',
    navNext: 'next',
    navPrev: 'prev',
    dots: 'w3-dots',
    dot: 'dot',
    active: 'active'
};

(function(w, d) {

    Element.prototype.W3Slider = function(args) {
        _ = this;
        setArgs(args);
        setW3Elems();
        
        sliderCount = sliders.childElementCount;

        if(argsObject.nav && sliderCount > 1) {
            setNav();
        }

        if(argsObject.dots && sliderCount > 1) {
            setDots();
        }

        setSizes();
        setActiveSlide();
    }

    w.addEventListener('resize', function(e) {
        setSizes();
    })

    function setArgs(args) {
        argsObject = Object.assign({}, argsObject, args);
    }

    function setNav() {
        var w3NavContainer = document.createElement('div');
        w3NavContainer.classList.add(DOM.nav);

        var prevButton = document.createElement('button');
        prevButton.classList.add(DOM.navPrev);
        w3NavContainer.appendChild(prevButton);
        prevButton.addEventListener('click', function(e) {
            slide(e, 'prev')
        });

        var nextButton = document.createElement('button');
        nextButton.classList.add(DOM.navNext);
        w3NavContainer.appendChild(nextButton);
        nextButton.addEventListener('click', function(e) {
            slide(e)
        });

        document.querySelector('.'+DOM.container).append(w3NavContainer);
    }

    function slide(e, type = 'next') {
        var activeSlide = _.querySelector('.'+DOM.container+' .'+DOM.row+ ' .'+DOM.active);
        var activeSlideIndex = [..._.querySelector('.'+DOM.container+' .'+DOM.row).children].indexOf(activeSlide);

        

        if(type === 'next') {
            ++activeSlideIndex;

            if(activeSlideIndex >= sliderCount && argsObject.loop) {
                activeSlideIndex = 0;
            } else if(activeSlideIndex >= sliderCount) {
                activeSlideIndex = sliderCount-1;
            }

            setSlide(activeSlideIndex);
        } else if(type === 'prev') {
            --activeSlideIndex;
            if(activeSlideIndex < 0 && argsObject.loop) {
                activeSlideIndex = sliderCount-1;
            } else if(activeSlideIndex < 0) {
                activeSlideIndex = 0;
            }

            setSlide(activeSlideIndex);
        }
    }

    function setDots() {
        var w3DotsContainer = document.createElement('div');
        w3DotsContainer.classList.add(DOM.dots);

        for(var i=0; i<sliderCount; i++) {
            var dotsButton = document.createElement('button');
            dotsButton.classList.add(DOM.dot);

            w3DotsContainer.appendChild(dotsButton);
        }
        document.querySelector('.'+DOM.container).append(w3DotsContainer);

        var dots = _.querySelectorAll('.'+DOM.container+' .'+DOM.dots+ ' .'+DOM.dot);
        for(var i=0; i<dots.length; i++) {
            var dot = dots[i];
            dot.addEventListener('click', function(e) {
                var index = [..._.querySelector('.'+DOM.container+' .'+DOM.dots).children].indexOf(e.target);
                setSlide(index);
            });
        }
    }

    function setDot(index) {
        if(_.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.active)) {
            _.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.active).classList.remove(DOM.active);
        }

        _.querySelector('.'+DOM.container+' .'+DOM.dots).children[index].classList.add(DOM.active);
    }
    
    function setW3Elems() {
        //Slider özelleştirilmeden önce içerik kopyalanıyor
        sliders = _.cloneNode(true);

        //Slider için gerekli olan kısımlar ekleniyor
        _.innerHTML = '';
        var w3Container = document.createElement('div');
        w3Container.classList.add(DOM.container);
        _.appendChild(w3Container);

        var w3Row = document.createElement('div');
        w3Row.classList.add(DOM.row);
        w3Row.style.transition = argsObject.transition+'s';
        w3Container.appendChild(w3Row);

        w3Row.innerHTML = sliders.innerHTML;
    }

    function setActiveSlide() {
        if (sliderCount < argsObject.activeSlide || argsObject.activeSlide == 0) {
            argsObject.activeSlide = 1;
        }

        if(sliderCount < 1) {
            argsObject.activeSlide = null;
        }

        if(argsObject.activeSlide != null) {
            argsObject.activeSlide = argsObject.activeSlide-1;

            
            setSlide(argsObject.activeSlide);

            if(argsObject.dots) {
                _.querySelectorAll('.'+DOM.dots+' .'+DOM.dot)[argsObject.activeSlide].classList.add(DOM.active);
            }
        }
    }

    function setSlide(index) {
        if(_.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active)) {
            _.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active).classList.remove(DOM.active);
        }

        if(argsObject.dots) {
            setDot(index);
        }

        _.querySelector('.'+DOM.container+' .'+DOM.row).children[index].classList.add(DOM.active);
        setKayma(index);
    }

    function setKayma(index) {
        _.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(-'+(index*1920)+'px, 0px, 0px)';
    }

    function setSizes() {
        var childs = document.querySelector('.'+DOM.row).children;
    }

})(window, document);