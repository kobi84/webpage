/**
 * @author Tomasz Kobiela
 */

(function () {
  documentReady(init);
})();

function init() {
  setCurrentYearInFooter();
  initPageTransistions();
  initNavBar();
}

function setCurrentYearInFooter() {
  const currentYearElem = document.getElementById('currentYear');
  currentYearElem.innerHTML = new Date().getFullYear();
}

function initPageTransistions() {
  const bgImageElem = document.getElementById('bgImg');
  const bodyrElem = document.body;
  const loaderElem = document.getElementById('loader');
  const menuElem = document.getElementById('menu-icon');
  const scrollElem = document.getElementById('scroll-icon');

  bgImageElem.addEventListener('load', () => {
    changeOpacity(bodyrElem, 0);
    bodyrElem.style.transition = 'opacity 0.5s linear';
    bodyrElem.style.backgroundImage = `url('${bgImageElem.src}')`;
    changeOpacity(bodyrElem, 1);

    loaderElem.addEventListener('transitionend', () => {
      loaderElem.style.display = 'none';
      showElement(menuElem);
      showElement(scrollElem);
      initScrollIcon();

      const sectionElems = Array.from(document.querySelectorAll('section'));
      sectionElems.forEach((elem) => {
        showElement(elem);
      });
    });
    /* Wrapp in timeout to workaround bug in Safari when Safari optimise transistions
   and  transitionend is not fired on loaderElem */
    setTimeout(() => {
      changeOpacity(loaderElem, 0);
    }, 0);
  });

  // Fire event load for cached images
  if (bgImageElem.complete) {
    bgImageElem.dispatchEvent(new Event('load'));
  }
}

function initNavBar() {
  const menuIconElem = document.getElementById('menu-icon');
  const sideNavElem = document.getElementById('side-nav');
  const toggleMenuClasses = () => {
    sideNavElem.classList.toggle('opened');
    menuIconElem.classList.toggle('clicked');
    menuIconElem.classList.toggle('la-times-circle');
    menuIconElem.classList.toggle('la-bars');
  };

  let sideNabarShown = false;

  sideNavElem.addEventListener('click', () => {
    toggleMenuClasses();
    sideNabarShown = false;
  });

  menuIconElem.addEventListener('click', () => {
    toggleMenuClasses();
    sideNabarShown = !sideNabarShown;
  });
}

function initScrollIcon() {
  const scrollElem = document.getElementById('scroll-icon');
  const observer = new IntersectionObserver(
    (entries) => {
      changeOpacity(scrollElem, entries[0].isIntersecting ? 1 : 0);
    },
    {
      root: null,
      rootMargin: '0px 0px 50px 0px',
      threshhold: 0,
    }
  );

  observer.observe(document.querySelector('#top'));
}

function showElement(elem) {
  elem.style.visibility = 'visible';
  changeOpacity(elem, 1);
}

function changeOpacity(elem, value) {
  elem.style.opacity = value;
}

function documentReady(onDocReadyFunction) {
  const readyState = document.readyState;
  if (readyState === 'complete' || readyState === 'interactive') {
    onDocReadyFunction();
  } else {
    document.addEventListener('DOMContentLoaded', onDocReadyFunction);
  }
}
