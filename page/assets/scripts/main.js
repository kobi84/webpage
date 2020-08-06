/**
 * @author Tomasz Kobiela
 */

(function () {
  documentReady(init);
})();

function init() {
  const bgImageElem = document.getElementById('bgImg');

  const currentYearElem = document.getElementById('currentYear');
  currentYearElem.innerHTML = new Date().getFullYear();

  bgImageElem.addEventListener('load', function () {
    const bodyrElem = document.body;
    bodyrElem.style.opacity = 0;
    bodyrElem.style.transition = 'opacity 0.5s linear';
    bodyrElem.style.backgroundImage = `url('${this.src}')`;
    bodyrElem.style.opacity = 1;

    const loaderElem = document.getElementById('loader');
    loaderElem.style.opacity = 0;
    loaderElem.addEventListener('transitionend', function () {
      this.style.display = 'none';
      const menuElem = document.getElementById('menu-icon');
      menuElem.style.visibility = 'visible';
      menuElem.style.opacity = 1;

      const sectionElems = Array.from(document.querySelectorAll('section'));
      sectionElems.forEach((elem) => {
        elem.style.visibility = 'visible';
        elem.style.opacity = 1;
      });
    });
  });

  const menuIconElem = document.getElementById('menu-icon');
  const sideNavElem = document.getElementById('side-nav');
  let sideNabarShown = false;

  sideNavElem.addEventListener('click', () => {
    sideNavElem.classList.remove('opened');
    menuIconElem.classList.remove('clicked');
    menuIconElem.classList.remove('la-times-circle');
    menuIconElem.classList.add('la-bars');
    sideNabarShown = false;
  });

  menuIconElem.addEventListener('click', () => {
    if (sideNabarShown) {
      sideNavElem.classList.remove('opened');
      menuIconElem.classList.remove('clicked');
      menuIconElem.classList.remove('la-times-circle');
      menuIconElem.classList.add('la-bars');
    } else {
      sideNavElem.classList.add('opened');
      menuIconElem.classList.add('clicked');
      menuIconElem.classList.add('la-times-circle');
      menuIconElem.classList.remove('la-bars');
    }

    sideNabarShown = !sideNabarShown;
  });
}

function documentReady(func) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    func.call();
  } else {
    document.addEventListener('DOMContentLoaded', func);
  }
}
