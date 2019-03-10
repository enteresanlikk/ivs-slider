var defaultArgsObject = {
    loop: 1,
    autoplay: 1,
    autoplayHoverPause: 1,
    timeout: 3,
    nav: 1,
    dots: 1,
    activeSlide: 1,
    transition: '1s',

    rtl: 0,
    spaceBetween: 0,
    slidesPerView: 1,
    dotNumber: 1,
    direction: 'h',

    slider: {
        allCount: 0,
        count: 0,
        autoplayInterval: null
    }
};

var sliderObject = [];

var DOM = {
    slider: 'ivs-slider',
    container: 'ivs-container',
    row: 'ivs-row',
    rowSlide: 'ivs-slide',
    nav: 'ivs-nav',
    navNext: 'ivs-next',
    navPrev: 'ivs-prev',
    dots: 'ivs-dots',
    dotsContainer: 'ivs-dots-container',
    dot: 'ivs-dot',
    active: 'ivs-active',
    vertical: 'ivs-vertical'
};

var IVSSlider = function(elStr, args) {
    var el = document.querySelector(elStr);

    setArgs(elStr, args);
    var slideObj = sliderObject[elStr];

    var sliders = setIVSElems(elStr);
    var sliderArgs = {
        slider: {
            allCount: sliders.childElementCount,
            count: Math.ceil(sliders.childElementCount/slideObj.slidesPerView)
        }
    };
    slideObj = Object.assign(slideObj, sliderArgs);

    if(slideObj.nav && slideObj.slider.count > 1) {
        setNav(elStr);
    }

    if(slideObj.dots && slideObj.slider.count > 1) {
        setDots(elStr);
    }

    setSizes(elStr);
    setActiveSlide(elStr);

    setAutoplay(elStr);

    if(slideObj.autoplayHoverPause) {
        el.addEventListener('mouseover', function(e) {
            clearInterval(slideObj.autoplayInterval);
        });
        el.addEventListener('mouseout', function(e) {
            setAutoplay(elStr);
        });
    }

    resizeSlider(elStr);
}

function resizeSlider(elStr) {
    window.addEventListener('resize', function(e) {
        setSizes(elStr);
    });
}

function setArgs(elStr, args) {
    sliderObject[elStr] = Object.assign({}, defaultArgsObject, args);
}

function setNav(elStr) {
    var ivsNavContainer = document.createElement('div');
    ivsNavContainer.classList.add(DOM.nav);

    if (sliderObject[elStr].direction == 'v') {
        ivsNavContainer.classList.add(DOM.vertical);
    }

    var prevButton = document.createElement('button');
    prevButton.classList.add(DOM.navPrev);
    ivsNavContainer.appendChild(prevButton);
    prevButton.addEventListener('click', function(e) {
        slide('prev', true, elStr);
    });

    var nextButton = document.createElement('button');
    nextButton.classList.add(DOM.navNext);
    ivsNavContainer.appendChild(nextButton);
    nextButton.addEventListener('click', function(e) {
        slide('next', true, elStr);
    });

    document.querySelector(elStr).querySelector('.'+DOM.container).append(ivsNavContainer);
}

function getActiveSlide(elStr) {
    var el = document.querySelector(elStr);
    var activeSlide = el.querySelector('.'+DOM.container+' .'+DOM.row+ ' .'+DOM.active);
    var activeSlideIndex = getIndex(el.querySelector('.'+DOM.container+' .'+DOM.row).children, activeSlide);
    return {
        element: activeSlide,
        index: activeSlideIndex
    }
}

function slide(type = 'next', isButton = false, elStr) {
    var activeSlide = getActiveSlide(elStr);
    var slideObj = sliderObject[elStr];

    if(!isButton && slideObj.rtl) {
        if(type == 'next') {
            type = 'prev';
        } else if(type == 'prev') {
            type = 'next';
        }
    }
    if(type === 'next') {
        ++activeSlide.index;

        if(activeSlide.index >= slideObj.slider.count && slideObj.loop) {
            activeSlide.index = 0;
        } else if(activeSlide.index >= slideObj.slider.count || (activeSlide.index < 0 && slideObj.rtl)) {
            activeSlide.index = slideObj.slider.count-1;
        }
    } else if(type === 'prev') {
        --activeSlide.index;
        if(activeSlide.index < 0 && slideObj.loop) {
            activeSlide.index = slideObj.slider.count-1;
        } else if(activeSlide.index < 0) {
            activeSlide.index = 0;
        }
    }

    setSlide(activeSlide.index, elStr);
}

function setDots(elStr) {
    var el = document.querySelector(elStr);
    var slideObj = sliderObject[elStr];
    var ivsDots = document.createElement('div');
    ivsDots.classList.add(DOM.dots);
    if (slideObj.direction == 'v') {
        ivsDots.classList.add(DOM.vertical);
    }

    var ivsDotsContainer = document.createElement('div');
    ivsDotsContainer.classList.add(DOM.dotsContainer);

    for(var i=0; i<slideObj.slider.count; i++) {
        var dotsButton = document.createElement('button');
        dotsButton.classList.add(DOM.dot);
        if(slideObj.dotNumber) {
            dotsButton.innerText = (slideObj.rtl ? (slideObj.slider.count-i) : (i+1));
        }

        ivsDotsContainer.appendChild(dotsButton);
    }
    ivsDots.appendChild(ivsDotsContainer);
    el.querySelector('.'+DOM.container).append(ivsDots);

    var dots = el.querySelectorAll('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.dot);
    for(var i=0; i<dots.length; i++) {
        var dot = dots[i];
        dot.addEventListener('click', function(e) {
            var index = getIndex(el.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer).children, e.target);
            setSlide(index, elStr);
        });
    }
}

function setDot(index, elStr) {
    var el = document.querySelector(elStr);
    if(el.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.active)) {
        el.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer+' .'+DOM.active).classList.remove(DOM.active);
    }
    
    el.querySelector('.'+DOM.container+' .'+DOM.dots+' .'+DOM.dotsContainer).children[index].classList.add(DOM.active);
}

function setIVSElems(elStr) {
    var el = document.querySelector(elStr);
    var slideObj = sliderObject[elStr];
    //Slider özelleştirilmeden önce içerik kopyalanıyor
    var sliders = el.cloneNode(true);
    for(var i=0; i<sliders.childElementCount; i++) {
        var slide = sliders.children[i];
        slide.classList.add(DOM.rowSlide);
    }

    el.classList.add(DOM.slider);

    //Slider için gerekli olan kısımlar ekleniyor
    el.innerHTML = '';
    var ivsContainer = document.createElement('div');
    ivsContainer.classList.add(DOM.container);
    el.appendChild(ivsContainer);

    var ivsRow = document.createElement('div');
    ivsRow.classList.add(DOM.row);

    setTimeout(()=> {
        ivsRow.style.transition = slideObj.transition;
    },100);
    
    ivsContainer.appendChild(ivsRow);

    ivsRow.innerHTML = sliders.innerHTML;
    return sliders;
}

function setActiveSlide(elStr) {
    var slideObj = sliderObject[elStr];
    if (slideObj.slider.count < slideObj.activeSlide || slideObj.activeSlide == 0 && !slideObj.rtl) {
        slideObj.activeSlide = 1;
    } else if(slideObj.rtl && slideObj.activeSlide!=1) {
        slideObj.activeSlide = slideObj.slider.count - slideObj.activeSlide;
    } else if(slideObj.rtl) {
        slideObj.activeSlide = slideObj.slider.count;
    }

    if(slideObj.slider.count < 1) {
        slideObj.activeSlide = null;
    }

    if(slideObj.activeSlide != null) {
        slideObj.activeSlide = slideObj.activeSlide >= 0 && slideObj.rtl && slideObj.activeSlide < slideObj.slider.count ? slideObj.activeSlide : slideObj.activeSlide - 1;

        setSlide(slideObj.activeSlide, elStr);

        if(slideObj.dots && slideObj.slidesPerView < slideObj.activeSlide) {
            document.querySelector(elStr).querySelectorAll('.'+DOM.dots+' .'+DOM.dot)[slideObj.activeSlide].classList.add(DOM.active);
        }
    }
}

function setSlide(index, elStr) {
    var slideObj = sliderObject[elStr];
    var el = document.querySelector(elStr);
    var activeSlides = el.querySelectorAll('.'+DOM.container+' .'+DOM.row+' .'+DOM.active);
    for(var i=0; i<activeSlides.length; i++) {
        var aEl = activeSlides[i];
        aEl.classList.remove(DOM.active);
    }

    if(slideObj.dots && slideObj.slider.count > 1) {
        setDot(index, elStr);
    }
    
    for(var i=index*slideObj.slidesPerView; i<(index*slideObj.slidesPerView)+slideObj.slidesPerView; i++) {i
        if(el.querySelector('.'+DOM.container+' .'+DOM.row).children[i]) {
            el.querySelector('.'+DOM.container+' .'+DOM.row).children[i].classList.add(DOM.active);
        }
    }
    setSlideAction(index, elStr);

    if(!slideObj.loop) {
        var activeSlide = getActiveSlide(elStr);
        if(activeSlide.index >= slideObj.slider.count-1) {
            el.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navNext).setAttribute('disabled','disabled');
        } else {
            el.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navNext).removeAttribute('disabled');
        }
    
        if(activeSlide.index<=0) {
            el.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navPrev).setAttribute('disabled','disabled');
        } else {
            el.querySelector('.'+DOM.container+' .'+DOM.nav+' .'+DOM.navPrev).removeAttribute('disabled');
        }
    }
}

function setAutoplay(elStr) {
    var slideObj = sliderObject[elStr];
    if(slideObj.autoplay) {
        slideObj.autoplayInterval = setInterval(function() {
            if(!slideObj.loop && getActiveSlide(elStr).index == slideObj.slider.count-1) {
                clearInterval(slideObj.autoplayInterval);
            } else {
                slide('next', false, elStr);
            }
        }, slideObj.timeout * 1000);
    }
}

function setSlideAction(index, elStr) {
    var slideObj = sliderObject[elStr];
    var el = document.querySelector(elStr);
    var slideWidth = el.querySelector('.'+DOM.row).children[0].clientWidth;
    if(slideObj.direction == 'v') {
        slideWidth = el.querySelector('.'+DOM.row).children[0].clientHeight;
    }
    var px = slideObj.spaceBetween;
    
    // console.log('kalan slide sayısı', Math.ceil(slideObj.slider.allCount%slideObj.slidesPerView));
    // console.log('aktif slide sayısı', (slideObj.slider.count-1)*slideObj.slidesPerView);

    // console.log('arada kalan slide sayısı', (slideObj.slidesPerView - Math.ceil(slideObj.slider.count%slideObj.slidesPerView)) );

    // console.log('arada kalan slide genişlik', ((slideObj.slidesPerView - Math.ceil(slideObj.slider.count%slideObj.slidesPerView))*(slideWidth+px)) );

    // console.log('aktif slide genişlik', ((slideObj.slider.count-1)*slideObj.slidesPerView)*(slideWidth+px));

    // console.log('transform', ( ((slideObj.slider.count-1)*slideObj.slidesPerView)*(slideWidth+px) )-( ((slideObj.slidesPerView - Math.ceil(slideObj.slider.allCount%slideObj.slidesPerView))*(slideWidth+px)) ) );

    if(index == slideObj.slider.count-1 && Math.ceil(slideObj.slider.allCount%slideObj.slidesPerView) != 0) {
        px = ( ((slideObj.slider.count-1)*slideObj.slidesPerView)*(slideWidth+px) )-( ((slideObj.slidesPerView - Math.ceil(slideObj.slider.allCount%slideObj.slidesPerView))*(slideWidth+px)) );
    } else {
        px = ((slideWidth+px)*index)*slideObj.slidesPerView;
    }
    if(slideObj.direction == 'v') {
        el.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(0px, -'+(px)+'px, 0px)';
    } else {
        el.querySelector('.'+DOM.container+' .'+DOM.row).style.transform = 'translate3d(-'+(px)+'px, 0px, 0px)';
    }
}

function setSizes(elStr) {
    var slideObj = sliderObject[elStr];
    var el = document.querySelector(elStr);
    var row = el.querySelector('.'+DOM.container+' .'+DOM.row);
    var childs = row.children;
    var width = (el.clientWidth+(slideObj.spaceBetween))/slideObj.slidesPerView;
    var height = (el.clientHeight+(slideObj.spaceBetween))/slideObj.slidesPerView;
    
    if(slideObj.direction == 'v') {
        row.style.height = (height*slideObj.slider.allCount)+"px";
    } else {
        row.style.width = (width*slideObj.slider.allCount)+"px";
    }

    for(var i=0; i<slideObj.slider.allCount; i++) {
        var slide = childs[i];

        if(slideObj.spaceBetween > 0 && !slideObj.rtl && i<slideObj.slider.allCount-1) {
            if(slideObj.direction == 'v') {
                slide.style.marginBottom = slideObj.spaceBetween+'px';
            } else {
                slide.style.marginRight = slideObj.spaceBetween+'px';
            }
        } else if(slideObj.rtl && i != 0) {
            if(slideObj.direction == 'v') {
                slide.style.marginTop = slideObj.spaceBetween+'px';
            } else {
                slide.style.marginLeft = slideObj.spaceBetween+'px';
            }
        }

        if(slideObj.direction == 'v') {
            slide.style.height = height-slideObj.spaceBetween+'px';
            slide.style.width = el.clientWidth+'px';
        } else {
            slide.style.width = width-slideObj.spaceBetween+'px';
            slide.style.height = el.clientHeight+'px';
        }
    }
    var activeSlide = getActiveSlide(elStr);
    setSlideAction(activeSlide.index, elStr);
}

function getIndex(elems, elem) {
    return [...elems].indexOf(elem);
}