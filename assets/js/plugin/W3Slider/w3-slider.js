var _,
    sliders,
    sliderCount,
    autoplayInterval = null;

var argsObject = {
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    timeout: 1,
    nav: true,
    dots: true,
    activeSlide: 1,
    transition: 1
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

    if(argsObject.autoplayHoverPause) {
        this.addEventListener('mouseover', function() {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        });

        this.addEventListener('mouseout', function() {
            setAutoplay();
        });
    }
}

window.addEventListener('resize', function(e) {
    setSizes();
});

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
        slide('prev');
    });

    var nextButton = document.createElement('button');
    nextButton.classList.add(DOM.navNext);
    w3NavContainer.appendChild(nextButton);
    nextButton.addEventListener('click', function(e) {
        slide();
    });

    document.querySelector('.'+DOM.container).append(w3NavContainer);
}

function getActiveSlide() {
    var activeSlide = _.querySelector('.'+DOM.container+' .'+DOM.row+ ' .'+DOM.active);
    var activeSlideIndex = getIndex(_.querySelector('.'+DOM.container+' .'+DOM.row).children, activeSlide);
    return {
        element: activeSlide,
        index: activeSlideIndex
    }
}

function slide(type = 'next') {
    var activeSlide = getActiveSlide();

    if(type === 'next') {
        ++activeSlide.index;

        if(activeSlide.index >= sliderCount && argsObject.loop) {
            activeSlide.index = 0;
        } else if(activeSlide.index >= sliderCount) {
            activeSlide.index = sliderCount-1;
        }

        setSlide(activeSlide.index);
    } else if(type === 'prev') {
        --activeSlide.index;
        if(activeSlide.index < 0 && argsObject.loop) {
            activeSlide.index = sliderCount-1;
        } else if(activeSlide.index < 0) {
            activeSlide.index = 0;
        }

        setSlide(activeSlide.index);
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
            var index = getIndex(_.querySelector('.'+DOM.container+' .'+DOM.dots).children, e.target);
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
    w3Row.id = DOM.row+'-'+_.id;
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
    if(autoplayInterval == null) {
        setAutoplay();
    }
    if(_.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active)) {
        _.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active).classList.remove(DOM.active);
    }

    if(argsObject.dots) {
        setDot(index);
    }

    _.querySelector('.'+DOM.container+' .'+DOM.row).children[index].classList.add(DOM.active);
    setKayma(index);
}

function setAutoplay() {
    if(argsObject.autoplay) {
        autoplayInterval = setInterval(function() {
            if(!argsObject.loop && getActiveSlide().index == sliderCount-1) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            } else {
                slide();
            }                
        }, argsObject.timeout * 1000);
    }
}

function setKayma(index) {
    var slideWidth = parseInt(_.querySelector('.'+DOM.row).children[0].style.width);
    _.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(-'+(index*slideWidth)+'px, 0px, 0px)';
}

function setSizes() {
    var childs = _.querySelector('.'+DOM.row).children;
    for(var i=0; i<sliderCount; i++) {
        var slide = childs[i];
        slide.style.width = window.innerWidth+'px';
    }
    var activeSlide = getActiveSlide();
    setKayma(activeSlide.index);
}

function getIndex(elems, elem) {
    return [...elems].indexOf(elem);
}