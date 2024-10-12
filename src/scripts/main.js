AOS.init();

const links = document.querySelectorAll('.js-link');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    sections.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let heightSection = section.offsetHeight;
        let idSection = section.getAttribute('id');

        if (top >= offset && top < offset + heightSection) {
            links.forEach(link => {
                link.classList.remove('actived');
                document.querySelector(`nav a[href*='${idSection}']`).classList.add('actived');
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const wrapper = document.querySelector(".wrapper");
    const carouselContainer = document.querySelector(".carousel"); 

    const createCarouselItems = (projetos) => {
        const ulElement = document.querySelector(".carousel");

        if (!ulElement) {
            console.error("Elemento UL com classe 'carrosel' não encontrado!");
            return;
        }

        projetos.forEach(projeto => {
            const li = document.createElement('li');
            li.classList.add('card');

            li.innerHTML = `
                <div class="img">
                    <img src="${projeto.imagem}" alt="img" draggable="false">
                </div>
                <h2>${projeto.nome}</h2>
                <button class="link-button">
                    <a target="_blank" class="project-link" href="${projeto.url_projeto}">
                        Ver mais <i class="bi bi-box-arrow-up-left"></i>
                    </a>
                </button>
            `;

            ulElement.appendChild(li);
        });
    };

    const requisicao = async () => {
        try {
            const response = await fetch("https://apiportifolio-production.up.railway.app/portifolio/projetos");
            const projetos = await response.json();
            console.log("Dados recebidos da API:", projetos);

            createCarouselItems(projetos);

            inicializarCarousel();
        } catch (error) {
            console.error("Algo deu errado ao buscar os projetos:", error);
        }
    };

    const inicializarCarousel = () => {
        const carousel = document.querySelector(".carousel");

        if (!carousel || !carousel.querySelector(".card")) {
            console.error("O carrossel ou os cards não estão presentes no DOM.");
            return;
        }

        const firstCardWidth = carousel.querySelector(".card").offsetWidth;
        const arrowBtns = document.querySelectorAll(".wrapper i");
        const carouselChildrens = [...carousel.children];
        let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
        let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

        carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
            carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
        });
        carouselChildrens.slice(0, cardPerView).forEach(card => {
            carousel.insertAdjacentHTML("beforeend", card.outerHTML);
        });

        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");

        arrowBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
            });
        });

        const dragStart = (e) => {
            isDragging = true;
            carousel.classList.add("dragging");
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft;
        };

        const dragging = (e) => {
            if (!isDragging) return;
            carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
        };

        const dragStop = () => {
            isDragging = false;
            carousel.classList.remove("dragging");
        };

        const infiniteScroll = () => {
            if (carousel.scrollLeft === 0) {
                carousel.classList.add("no-transition");
                carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
                carousel.classList.remove("no-transition");
            } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
                carousel.classList.add("no-transition");
                carousel.scrollLeft = carousel.offsetWidth;
                carousel.classList.remove("no-transition");
            }
            clearTimeout(timeoutId);
            if (!wrapper.matches(":hover")) autoPlay();
        };

        const autoPlay = () => {
            if (window.innerWidth < 800 || !isAutoPlay) return;
            timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
        };

        autoPlay();

        carousel.addEventListener("mousedown", dragStart);
        carousel.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragStop);
        carousel.addEventListener("scroll", infiniteScroll);
        wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
        wrapper.addEventListener("mouseleave", autoPlay);
    };

    requisicao();
});

$(document).ready(function() {
    $('.menu-hamburger').click(function() {
        let $navbarMobile = $('.links-mobile');
        if ($navbarMobile.width() === 0) {
            $navbarMobile.css('display', 'flex').animate({ width: '50%' }, 300);
        } else {
            $navbarMobile.animate({ width: '0' }, 300, function() {
                $(this).css('display', 'none');
            });
        }
    });
});

const formulario = document.getElementById('formulario-contact');

$(document).ready(function() {
    $('#formulario-contact').submit(function(e) {
        e.preventDefault();

        const email = document.querySelector('.formulario__contact-input__form__name').value;

        const data = {
            email: email,
        };

        fetch('https://apiportifolio-production.up.railway.app/email/enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            $('.email-enviado-p').slideDown(); 
            setTimeout(() => {
                $('.email-enviado-p').slideUp();
            }, 2000); 
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    });
});

