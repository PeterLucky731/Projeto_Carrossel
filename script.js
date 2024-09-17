document.addEventListener('DOMContentLoaded', function(){
    
})
    
    var carrosel = document.querySelector('.carrosel');
    var carroselContent = document.querySelector('.carrosel-content');
    var slides = document.querySelector('.slide');
    var arrayOfSlides = Array.prototype.slice.call(slides);
    var carroselDisplaying;
    var ScreenSize;
    
    setScreenSize();
    var lengthOfSlides;
    
    function addClone(){
        var lastSlide = carroselContent.lastElementChild.cloneNode(true);
        lastSlide.style.left = (-lengthOfSlides) + 'px';
        carroselContent.insertBefore(lastSlide, carroselContent.firstChild);
    }
    
    function removeClone(){
        var firstSlide = carroselContent.firstChild;
        firstSlide.parentNode.removeChild(firstSlide);
    }
    
    function moveSlideRight(){
        var slides = document.querySelectorAll('.slide');
        var slideArray = Array.prototype.slice.call(slides);
        var width = 0;
        
        slideArray.forEach(function(elemento, i){
            elemento.style.left = width + 'px';
            width += lengthOfSlides;
        });
        addClone();
    }
    moveSlideRight();
    
    function moveSlideLeft(){
        var slides = document.querySelectorAll('.slide');
        var slideArray = Array.prototype.slice.call(slides);
        slideArray = slideArray.reverse();
        var maxWidth = (slideArray.lenght - 1) * lengthOfSlides;
        
        slideArray.forEach(function(elemento, i){
            maxWidth += lengthOfSlides;
            elemento.style.left = maxWidth + 'px'
        })
    }
    
    window.addEventListener('resize', setScreenSize);
    
    function setScreenSize(){
        if(window.innerWidth >= 500){
            carroselDisplaying = 3;
        } else if(window.innerWidth >= 300){
            carroselDisplaying = 2;
        }else{
            carroselDisplaying = 1;
        }
        getScreenSize();
    }
    
    function getScreenSize(){
        var slides = document.querySelectorAll('.slide');
        var slideArray = Array.prototype.slice.call(slides);
        lengthOfSlides = (carrosel.offsetWidth / carroselDisplaying);
        var initialWidth = -lengthOfSlides;
        
        arrayOfSlides.forEach(function(){
            elemento.style.width = lengthOfSlides + 'px';
            elemento.style.left = initialWidth + 'px';
            initialWidth += lengthOfSlides;
        })
    }

    var rightNav = document.querySelector('.nav-right');
    rightNav.addEventListener('click', moveLeft);

    var moving = true;

    function moveRight(){
         if(moving){
            moving = false;
            var lastSlide = carroselContent.lastElementChild;
            lastSlide.parentNode.removeChild(lastSlide);
            carroselContent.insertBefore(lastSlide, carroselContent.firstChild);
            removeClone();
            var firstSlide = carroselContent.firstElementChild;
            firstSlide.addEventListener('transitioned', activateAgain);
            moveSlideRight();
         }
    }

    function activateAgain(){
        var firstSlide = carroselContent.firstElementChild;
        moving = true;
        firstSlide.removeEventListener('transitioned', activateAgain);
    }

    var leftNav = document.querySelector('nav-left');
    leftNav.addEventListener('click', moveRight);

    function moveLeft(){
        if(moving){
            moving = false;
            removeClone();
            var firstSlide = carroselContent.firstElementChild;
            firstSlide.addEventListener('transitioned', replaceToEnd);
            moveSlideLeft();
        }
    }

    function replaceToEnd(){
        var firstSlide = carroselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
        carroselContent.appendChild(firstSlide);
        firstSlide.style.left = ((arrayOfSlides.lenght - 1) * lengthOfSlides) + 'px';
        addClone();
        moving = true;
        firstSlide.removeEventListener('transitioned', replaceToEnd);
    }

    carroselContent.addEventListener('mousedown', seeMovement);

    var initialX;
    var initialPos;

    function seeMovement(elemento){
        initialX = elemento.clientX;
        getInitialPos();
        carroselContent.addEventListener('mousemove', slighMove);
        document.addEventListener('mouseup', moveBasedOnMouse);
    }

    function slighMove(elemento){
        if (moving){
            var movingX = elemento.clientX;
            var diference = initialX - movingX;
            if(Math.abs(diference) < (lengthOfSlides / 4)){
                slighMoveSlides(difference);
            }
        }
    }
    function getInitialPos(){
        var slides = document.querySelectorAll('.slides');
        var slideArray = Array.prototype.slice.call(slides);
        initialPos = [];

        slideArray.forEach(function(elemento){
            var left = Math.floor(parseInt(element.style.slice(0, -2)));
        })
    }

    function slighMoveSlides(newX){
        var slides = document.querySelectorAll('.slides');
        var slideArray = Array.prototype.slice.call(slides);

        slideArray.forEach(function(elemento, i){
            var oldLeft = initialPos[i];
            elemento.style.left = (oldLeft + newX) + 'px'
        });
    }

    function moveBasedOnMouse(elemento){
        var finalX = elemento.clientX;
        if(initialX - finalX > 0){
            moveRight();
        }else if(initialX - finalX < 0){
            moveLeft();
        }

        document.removeEventListener('mouseup', moveBasedOnMouse);
        carroselContent.removeEventListener('mousemove', slighMove);
    }