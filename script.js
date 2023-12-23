'use strict';

///////////////////////////////////////
// Selections

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');
const opsTabContainer = document.querySelector('.operations__tab-container');
const opsContents = document.querySelectorAll('.operations__content');
const opsTabs = document.querySelectorAll('.operations__tab');
const sections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

const sliderBtnRight = document.querySelector('.slider__btn--right');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const featuresImages = document.querySelectorAll('.features__img');

//Features
//1. Smooth Scrolling: On Clicking on features/operations/testmonials/LearnMore
///////a)Normal ,  b)using event delegation
//2. Tabbed Components: Operations
//3. Sticky Navigation :Menu to be sticky on top after scrolling down a bit
/////////a) normal , b)using Intersection Observer API
//4. Revealing Elements on scroll: As you reach a section , contents slides in
//5. Lazy loading images
//6. Slider Component : In Testimonials section
//7. Focus the element on mouse hover
//8. Open Account modal

////---------1. Smooth Scrolling---------////
//a.
// navLink.forEach(navItem => {
//   navItem.addEventListener('click', function (e) {
//     e.preventDefault();

//     const targetSction = document.querySelector(navItem.getAttribute('href'));
//     targetSction.scrollIntoView({ behavior: 'smooth' });
//   });
// });
//b. using event delegation
navLinks.addEventListener('click', function (e) {
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    e.preventDefault();

    const targetSection = document.querySelector(e.target.getAttribute('href'));
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
});

////---------2. Tabbed Components---------////
opsTabContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('operations__tab')) {
    e.preventDefault();

    //make all tabs inactive and the clicked one active
    opsTabs.forEach(opsContent =>
      opsContent.classList.remove('operations__tab--active')
    );
    e.target.classList.add('operations__tab--active');

    //make all tab-contents inactive and the clicked tab-content active
    opsContents.forEach(opsContent =>
      opsContent.classList.remove('operations__content--active')
    );
    document
      .querySelector(`.operations__content--${e.target.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

////---------3. Sticky Navigation---------////
// method - 1 : when you scroll down 320 pixels
// document.addEventListener('scroll', function (e) {
//   //   console.log(window.scrollX, window.scrollY); //0,320
//   if (window.scrollY > 320) nav.classList.add('sticky');
//   if (window.scrollY < 320) nav.classList.remove('sticky');
// });

//method - 2:  when you scroll down to section-1
// document.addEventListener('scroll', function (e) {
//   const section1Coords = document
//     .querySelector('#section--1')
//     .getBoundingClientRect();

//   const section1DistanceFromCorner = section1Coords.top + window.scrollY;
//   console.log(section1DistanceFromCorner);
//   if (window.scrollY > section1DistanceFromCorner - 70)
//     nav.classList.add('sticky');
//   if (window.scrollY < section1DistanceFromCorner - 70)
//     nav.classList.remove('sticky');
// });

//method - 3 : Intersection Observer API
let options = {
  //default root => viewport
  rootMargin: '0px',
  threshold: 0.2,
};

const makeNavSticky = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) nav.classList.remove('sticky');
    if (!entry.isIntersecting) nav.classList.add('sticky');
  });
};

let observer = new IntersectionObserver(makeNavSticky, options);
let target = document.querySelector('.header');
observer.observe(target);

////---------4. Revealing Elements on scroll---------////
const revealObserverOptions = {
  rootMargin: '0px',
  threshold: 0.18,
};

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
  });
};

let revealObserver = new IntersectionObserver(
  revealSection,
  revealObserverOptions
);
sections.forEach(section => {
  section.classList.add('section--hidden');
  revealObserver.observe(section);
});

////---------6. Slider Component ---------////
//Create the dots
const dotsHtml = `
<button class="dots__dot dots__dot--0" data-slide="0"> </button>
<button class="dots__dot dots__dot--1" data-slide="1"> </button>
<button class="dots__dot dots__dot--2" data-slide="2"> </button>
`;
dotContainer.insertAdjacentHTML('beforeend', dotsHtml);
const dots = document.querySelectorAll('.dots__dot');

//Modulo operator, since js % is not modulo but remaonder operator
function mod(a, n) {
  return a - n * Math.floor(a / n);
}

function activateSlide(currentSlide) {
  dots.forEach(dot => {
    if (dot.dataset.slide != currentSlide) {
      //todo: check number vs text
      dot.classList.remove('dots__dot--active');
    } else {
      dot.classList.add('dots__dot--active');
    }
  });
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
  });
}

let currentSlide = 0;
activateSlide(currentSlide);

sliderBtnRight.addEventListener('click', function (e) {
  currentSlide = mod(currentSlide + 1, slides.length);
  activateSlide(currentSlide);
});

sliderBtnLeft.addEventListener('click', function (e) {
  currentSlide = mod(currentSlide - 1, slides.length);
  activateSlide(currentSlide);
});

//-----dots impl
dots.forEach(dot => {
  dot.addEventListener('click', function (e) {
    currentSlide = dot.dataset.slide;
    activateSlide(currentSlide);
  });
});

////---------5. Lazy loading images ---------////

let viewportRootOption = {
  //default root => viewport
  rootMargin: '0px',
  threshold: 0.8,
};

const loadImages = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.setAttribute('src', entry.target.dataset.src);
      entry.target.classList.remove('lazy-img');

      //unobserve, because the its no longer required
      observer.unobserve(entry.target);
    }
  });
};

let imageLoaderObserver = new IntersectionObserver(
  loadImages,
  viewportRootOption
);
featuresImages.forEach(featureImage => {
  imageLoaderObserver.observe(featureImage);
});

////---------7. Focus the element on mouse hover ---------////
const navMouseHoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const links = nav.querySelectorAll('.nav__link');
    const logo = nav.querySelector('.nav__logo');

    links.forEach(theLink => {
      if (theLink != e.target) {
        theLink.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navMouseHoverHandler.bind('0.5'));
nav.addEventListener('mouseout', navMouseHoverHandler.bind('1.0'));

////---------8. Modal window ---------////
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', function (e) {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });
});

btnCloseModal.addEventListener('click', function (e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});
