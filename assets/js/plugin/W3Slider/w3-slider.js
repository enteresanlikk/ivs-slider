var _,
    sliders,
    sliderCount,
    allSliderCount,
    autoplayInterval = null;

var argsObject = {
    loop: 1,
    autoplay: 1,
    autoplayHoverPause: 1,
    timeout: 3,
    nav: 1,
    dots: 1,
    activeSlide: 1,
    transition: 1,

    rtl: 0,
    spaceBetween: 0,
    slidesPerView: 1,
    dotNumber: 1,
    direction: 'h'
};

var DOM = {
    slider: 'w3-slider',
    container: 'w3-container',
    row: 'w3-row',
    nav: 'w3-nav',
    navNext: 'next',
    navPrev: 'prev',
    dots: 'w3-dots',
    dotsContainer: 'w3-dots-container',
    dot: 'dot',
    active: 'active',
    vertical: 'vertical'
};

Element.prototype.W3Slider = function(args) {
    _ = this;
    setArgs(args);
    setW3Elems();
    
    sliderCount = Math.ceil(sliders.childElementCount/argsObject.slidesPerView);
    allSliderCount = sliders.childElementCount;

    if(argsObject.nav && sliderCount > 1) {
        setNav();
    }

    if(argsObject.dots && sliderCount > 1) {
        setDots();
    }

    setSizes();
    setActiveSlide();

    setAutoplay();

    if(argsObject.autoplayHoverPause) {
        //hover and autoplay false
        _.addEventListener('mouseover', function(e) {
            clearInterval(autoplayInterval);
        });
        _.addEventListener('mouseout', function(e) {
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

    if (argsObject.direction == 'v') {
        w3NavContainer.classList.add(DOM.vertical);
    }

    var prevButton = document.createElement('button');
    prevButton.classList.add(DOM.navPrev);
    w3NavContainer.appendChild(prevButton);
    prevButton.addEventListener('click', function(e) {
        slide('prev', true);
    });

    var nextButton = document.createElement('button');
    nextButton.classList.add(DOM.navNext);
    w3NavContainer.appendChild(nextButton);
    nextButton.addEventListener('click', function(e) {
        slide('next', true);
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

function slide(type = 'next', isButton = false) {
    var activeSlide = getActiveSlide();

    if(!isButton && argsObject.rtl) {
        if(type == 'next') {
            type = 'prev';
        } else if(type == 'prev') {
            type = 'next';
        }
    }
    if(type === 'next') {
        ++activeSlide.index;

        if(activeSlide.index >= sliderCount && argsObject.loop) {
            activeSlide.index = 0;
        } else if(activeSlide.index >= sliderCount || (activeSlide.index < 0 && argsObject.rtl)) {
            activeSlide.index = sliderCount-1;
        }
    } else if(type === 'prev') {
        --activeSlide.index;
        if(activeSlide.index < 0 && argsObject.loop) {
            activeSlide.index = sliderCount-1;
        } else if(activeSlide.index < 0) {
            activeSlide.index = 0;
        }
    }

    setSlide(activeSlide.index);
}

function setDots() {
    var w3Dots = document.createElement('div');
    w3Dots.classList.add(DOM.dots);
    if (argsObject.direction == 'v') {
        w3Dots.classList.add(DOM.vertical);
    }

    var w3DotsContainer = document.createElement('div');
    w3DotsContainer.classList.add(DOM.dotsContainer);

    for(var i=0; i<sliderCount; i++) {
        var dotsButton = document.createElement('button');
        dotsButton.classList.add(DOM.dot);
        if(argsObject.dotNumber) {
            dotsButton.innerText = (argsObject.rtl ? (sliderCount-i) : (i+1));
        }

        w3DotsContainer.appendChild(dotsButton);
    }
    w3Dots.appendChild(w3DotsContainer);
    document.querySelector('.'+DOM.container).append(w3Dots);

    var dots = _.querySelectorAll('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.dot);
    for(var i=0; i<dots.length; i++) {
        var dot = dots[i];
        dot.addEventListener('click', function(e) {
            var index = getIndex(_.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer).children, e.target);
            setSlide(index);
        });
    }
}

function setDot(index) {
    if(_.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.active)) {
        _.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.active).classList.remove(DOM.active);
    }

    _.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer).children[index].classList.add(DOM.active);
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

    setTimeout(()=> {
        w3Row.style.transition = argsObject.transition+'s';
    },100);
    
    w3Container.appendChild(w3Row);

    w3Row.innerHTML = sliders.innerHTML;
}

function setActiveSlide() {
    if (sliderCount < argsObject.activeSlide || argsObject.activeSlide == 0 && !argsObject.rtl) {
        argsObject.activeSlide = 1;
    } else if(argsObject.rtl && argsObject.activeSlide!=1) {
        argsObject.activeSlide = sliderCount - argsObject.activeSlide;
    } else if(argsObject.rtl) {
        argsObject.activeSlide = sliderCount;
    }

    if(sliderCount < 1) {
        argsObject.activeSlide = null;
    }

    if(argsObject.activeSlide != null) {
        argsObject.activeSlide = argsObject.activeSlide >= 0 && argsObject.rtl && argsObject.activeSlide < sliderCount ? argsObject.activeSlide : argsObject.activeSlide - 1;

        setSlide(argsObject.activeSlide);

        if(argsObject.dots && argsObject.slidesPerView < argsObject.activeSlide) {
            _.querySelectorAll('.'+DOM.dots+' .'+DOM.dot)[argsObject.activeSlide].classList.add(DOM.active);
        }
    }
}

function setSlide(index) {
    if(_.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active)) {
        _.querySelector('.'+DOM.container+' .'+DOM.row+' .'+DOM.active).classList.remove(DOM.active);
    }

    if(argsObject.dots && sliderCount > 1) {
        setDot(index);
    }

    _.querySelector('.'+DOM.container+' .'+DOM.row).children[index].classList.add(DOM.active);
    setSlideAction(index);

    if(!argsObject.loop) {
        var activeSlide = getActiveSlide();
        if(activeSlide.index >= sliderCount-1) {
            _.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navNext).setAttribute('disabled','disabled');
        } else {
            _.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navNext).removeAttribute('disabled');
        }
    
        if(activeSlide.index<=0) {
            _.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navPrev).setAttribute('disabled','disabled');
        } else {
            _.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navPrev).removeAttribute('disabled');
        }
    }
}

function setAutoplay() {
    if(argsObject.autoplay) {
        autoplayInterval = setInterval(function() {
            if(!argsObject.loop && getActiveSlide().index == sliderCount-1) {
                clearInterval(autoplayInterval);
            } else {
                slide();
            }
        }, argsObject.timeout * 1000);
    }
}

function setSlideAction(index) {
    var slideWidth = _.querySelector('.'+DOM.row).children[0].clientWidth;
    if(argsObject.direction == 'v') {
        slideWidth= _.querySelector('.'+DOM.row).children[0].clientHeight;
    }
    var px = argsObject.spaceBetween;
    
    // console.log('kalan slide sayısı', Math.ceil(allSliderCount%argsObject.slidesPerView));
    // console.log('aktif slide sayısı', (sliderCount-1)*argsObject.slidesPerView);

    // console.log('arada kalan slide sayısı', (argsObject.slidesPerView - Math.ceil(allSliderCount%argsObject.slidesPerView)) );

    // console.log('arada kalan slide genişlik', ((argsObject.slidesPerView - Math.ceil(allSliderCount%argsObject.slidesPerView))*(slideWidth+px)) );

    // console.log('aktif slide genişlik', ((sliderCount-1)*argsObject.slidesPerView)*(slideWidth+px));

    // console.log('transform', ( ((sliderCount-1)*argsObject.slidesPerView)*(slideWidth+px) )-( ((argsObject.slidesPerView - Math.ceil(allSliderCount%argsObject.slidesPerView))*(slideWidth+px)) ) );

    if(index == sliderCount-1 && Math.ceil(allSliderCount%argsObject.slidesPerView) != 0) {
        px = ( ((sliderCount-1)*argsObject.slidesPerView)*(slideWidth+px) )-( ((argsObject.slidesPerView - Math.ceil(allSliderCount%argsObject.slidesPerView))*(slideWidth+px)) ) ;
    } else {
        px = ((slideWidth+px)*index)*argsObject.slidesPerView;
    }
    if(argsObject.direction == 'v') {
        _.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(0px, -'+(px)+'px, 0px)';
    } else {
        _.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(-'+(px)+'px, 0px, 0px)';
    }
}

function setSizes() {
    var row = _.querySelector('.'+DOM.row);
    var childs = row.children;
    var width = (window.innerWidth+(argsObject.spaceBetween))/argsObject.slidesPerView;
    var height = (window.innerHeight+(argsObject.spaceBetween))/argsObject.slidesPerView;
    
    if(argsObject.direction == 'v') {
        row.style.height = (height*allSliderCount)+"px";
    } else {
        row.style.width = (width*allSliderCount)+"px";
    }

    for(var i=0; i< allSliderCount; i++) {
        var slide = childs[i];

        if(argsObject.spaceBetween > 0 && !argsObject.rtl && i < allSliderCount-1) {
            if(argsObject.direction == 'v') {
                slide.style.marginBottom = argsObject.spaceBetween+'px';
            } else {
                slide.style.marginRight = argsObject.spaceBetween+'px';
            }
        } else if(argsObject.rtl && i != 0) {
            if(argsObject.direction == 'v') {
                slide.style.marginTop = argsObject.spaceBetween+'px';
            } else {
                slide.style.marginLeft = argsObject.spaceBetween+'px';
            }
        }

        if(argsObject.direction == 'v') {
            slide.style.height = height-argsObject.spaceBetween+'px';
            slide.style.width = window.innerWidth+'px';
        } else {
            slide.style.width = width-argsObject.spaceBetween+'px';
            slide.style.height = window.innerHeight+'px';
        }
    }
    var activeSlide = getActiveSlide();
    setSlideAction(activeSlide.index);
}

function getIndex(elems, elem) {
    return [...elems].indexOf(elem);
}