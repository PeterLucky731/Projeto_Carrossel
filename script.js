document.addEventListener('DOMContentLoaded', function() {

        var valorUsuario;

        var btnAuau = document.getElementById("btn-auau");
        var navHeader = document.querySelector("#nav-header ul");

        // Adiciona evento de clique no botão hamburguer para alternar o menu
        btnAuau.addEventListener('click', function(evento) {
            evento.preventDefault();

            navHeader.classList.toggle('ativo');
            btnAuau.classList.toggle('ativo');
        });

        var carrosel = document.querySelector('.carrosel');
        var carroselContent = document.querySelector('.carrosel-content');
        var slides = document.querySelectorAll('.slide');
        var arrayOfSlides = Array.prototype.slice.call(slides); // Transformando NodeList em array
        var carroselDisplaying;
        var screenSize;
        setScreenSize(); // Inicializa o tamanho da tela
        var lengthOfSlide;

        // Função para adicionar um clone do último slide no início
        function addClone() {
            var lastSlide = carroselContent.lastElementChild.cloneNode(true);
            lastSlide.style.left = (-lengthOfSlide) + 'px';
            carroselContent.insertBefore(lastSlide, carroselContent.firstChild);
        }

        // Função para remover o primeiro slide (clone)
        function removeClone() {
            var firstSlide = carroselContent.firstChild;
            firstSlide.parentNode.removeChild(firstSlide);
        }

        // Movimenta os slides para a direita
        function moveSlideRight() {
            var slides = document.querySelectorAll('.slide');
            var slideArray = Array.prototype.slice.call(slides);
            var width = 0;

            slideArray.forEach(function(elemento) {
                elemento.style.left = width + 'px';
                width += lengthOfSlide;
            });
            addClone();
        }
        moveSlideRight(); // Move os slides ao carregar a página

        // Movimenta os slides para a esquerda
        function moveSlideLeft() {
            var slides = document.querySelectorAll('.slide');
            var slideArray = Array.prototype.slice.call(slides);
            slideArray = slideArray.reverse();
            var maxWidth = (slideArray.length - 1) * lengthOfSlide;

            slideArray.forEach(function(elemento) {
                maxWidth -= lengthOfSlide;
                elemento.style.left = maxWidth + 'px';
            });
        }

        // Atualiza o layout conforme o tamanho da tela
        window.addEventListener('resize', setScreenSize);

        // Define quantos slides serão exibidos de acordo com o tamanho da tela
        function setScreenSize() {
            if (window.innerWidth >= 500) {
                carroselDisplaying = 3;
            } else if (window.innerWidth >= 300) {
                carroselDisplaying = 2;
            } else {
                carroselDisplaying = 1;
            }
            getScreenSize();
        }

        // Ajusta o tamanho e posição de cada slide
        function getScreenSize() {
            var slides = document.querySelectorAll('.slide');
            var slideArray = Array.prototype.slice.call(slides);
            lengthOfSlide = (carrosel.offsetWidth / carroselDisplaying);
            var initialWidth = -lengthOfSlide;

            slideArray.forEach(function(elemento) {
                elemento.style.width = lengthOfSlide + 'px';
                elemento.style.left = initialWidth + 'px';
                initialWidth += lengthOfSlide;
            });
        }

        var rightNav = document.querySelector('.nav-right');
        rightNav.addEventListener('click', moveLeft);

        var moving = true;

        // Move os slides para a direita
        function moveRight() {
            if (moving) {
                moving = false;
                var lastSlide = carroselContent.lastElementChild;
                lastSlide.parentNode.removeChild(lastSlide);
                carroselContent.insertBefore(lastSlide, carroselContent.firstChild);
                removeClone();
                var firstSlide = carroselContent.firstElementChild;
                firstSlide.addEventListener('transitionend', activateAgain);
                moveSlideRight();
            }
        }

        // Reativa a movimentação após a transição
        function activateAgain() {
            var firstSlide = carroselContent.firstElementChild;
            moving = true;
            firstSlide.removeEventListener('transitionend', activateAgain);
        }

        var leftNav = document.querySelector('.nav-left');
        leftNav.addEventListener('click', moveRight);

        // Move os slides para a esquerda
        function moveLeft() {
            if (moving) {
                moving = false;
                removeClone();
                var firstSlide = carroselContent.firstElementChild;
                firstSlide.addEventListener('transitionend', replaceToEnd);
                moveSlideLeft();
            }
        }

        // Move o primeiro slide para o fim e adiciona o clone
        function replaceToEnd() {
            var firstSlide = carroselContent.firstElementChild;
            firstSlide.parentNode.removeChild(firstSlide);
            carroselContent.appendChild(firstSlide);
            firstSlide.style.left = ((arrayOfSlides.length - 1) * lengthOfSlide) + 'px';
            addClone();
            moving = true;
            firstSlide.removeEventListener('transitionend', replaceToEnd);
        }

        // Detecta o movimento do mouse
        carroselContent.addEventListener('mousedown', seeMovement);

        var initialX;
        var initialPos;

        function seeMovement(evento) {
            initialX = evento.clientX;
            getInitialPos();
            carroselContent.addEventListener('mousemove', slightMove);
            document.addEventListener('mouseup', moveBasedOnMouse);
        }

        function slightMove(evento) {
            if (moving) {
                var movingX = evento.clientX;
                var difference = initialX - movingX;
                if (Math.abs(difference) < (lengthOfSlide / 4)) {
                    slightMoveSlides(difference);
                }
            }
        }

        // Captura a posição inicial dos slides
        function getInitialPos() {
            var slides = document.querySelectorAll('.slide');
            var slidesArray = Array.prototype.slice.call(slides);
            initialPos = [];

            slidesArray.forEach(function(elemento) {
                var left = Math.floor(parseInt(elemento.style.left.slice(0, -2), 10));
                initialPos.push(left);
            });
        }

        // Move os slides conforme a posição do mouse
        function slightMoveSlides(newX) {
            var slides = document.querySelectorAll('.slide');
            var slidesArray = Array.prototype.slice.call(slides);

            slidesArray.forEach(function(elemento, i) {
                var oldLeft = initialPos[i];
                elemento.style.left = (oldLeft + newX) + 'px';
            });
        }

        // Move os slides com base no movimento do mouse
        function moveBasedOnMouse(evento) {
            var finalX = evento.clientX;
            if (initialX - finalX > 0) {
                moveRight();
            } else if (initialX - finalX < 0) {
                moveLeft();
            }

            document.removeEventListener('mouseup', moveBasedOnMouse);
            carroselContent.removeEventListener('mousemove', slightMove);
        }

    });