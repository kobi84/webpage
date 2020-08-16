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
  const menuElem = getMenuIcon();
  const fastContactElem = getFastContactElem();
  const scrollElem = getScrollIcon();

  bgImageElem.addEventListener('load', () => {
    changeOpacity(bodyrElem, 0);
    bodyrElem.style.transition = 'opacity 0.5s linear';
    bodyrElem.style.backgroundImage = `url('${bgImageElem.src}')`;
    changeOpacity(bodyrElem, 1);

    loaderElem.addEventListener('transitionend', () => {
      loaderElem.style.display = 'none';
      showElement(menuElem);
      showElement(scrollElem);
      showElement(fastContactElem);
      initScrollIcon();
      initArticlesTransitions();

      const sectionElems = getMainSections();
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
  const menuIconElem = getMenuIcon();
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
  const scrollElem = getScrollIcon();
  const fastContactElem = getFastContactElem();

  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      changeOpacity(scrollElem, entries[0].isIntersecting ? 1 : 0);
      changeOpacity(fastContactElem, entries[0].isIntersecting ? 1 : 0);
    });

    observer.observe(document.querySelector('#top'));
    scrollElem.addEventListener('click', () => document.getElementById('about-me').scrollIntoView());
  } else {
    hideElement(scrollElem);
    hideElement(fastContactElem);
  }
}

function initArticlesTransitions() {
  const sections = getMainSections();
  const articles = [];

  sections.forEach((section) => {
    const sectionArticles = section.getElementsByTagName('article');
    if (sectionArticles.length) {
      Array.from(sectionArticles).forEach((article) => articles.push(article));
    }
  });

  if (window.IntersectionObserver) {
    articles.forEach((article) => article.classList.add('article-transition'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshhold: 0.5,
      }
    );

    articles.forEach((article) => observer.observe(article));
  } else {
    articles.forEach((article) => showElement(article));
  }
}

function getMainSections() {
  return Array.from(document.querySelectorAll('section'));
}

function getMenuIcon() {
  return document.getElementById('menu-icon');
}

function getScrollIcon() {
  return document.getElementById('scroll-icon');
}

function getFastContactElem() {
  return document.getElementById('fast-contact');
}

function showElement(elem) {
  elem.style.visibility = 'visible';
  changeOpacity(elem, 1);
}

function changeOpacity(elem, value) {
  elem.style.opacity = value;
}

function hideElement(elem) {
  elem.style.display = 'none';
}

function documentReady(onDocReadyFunction) {
  const readyState = document.readyState;
  if (readyState === 'complete' || readyState === 'interactive') {
    onDocReadyFunction();
  } else {
    document.addEventListener('DOMContentLoaded', onDocReadyFunction);
  }
}
