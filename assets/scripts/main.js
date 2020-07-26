/**
 * @author Tomasz Kobiela
 */

(function () {
  documentReady(init);
})();

function init() {
  const bgImageElem = document.getElementById('bgImg');

  bgImageElem.addEventListener('load', function () {
    const bodyElem = document.body;
    bodyElem.style.backgroundImage = `url('${this.src}')`;
    bodyElem.style.opacity = 1;

    const loaderElem = document.getElementById('loader');
    loaderElem.style.opacity = 0;
    loaderElem.addEventListener('transitionend', function () {
      this.style.display = 'none';
      const menuElem = document.getElementById('menu-icon');
      menuElem.style.visibility = 'visible';
      menuElem.style.opacity = 1;
    });
  });
}

function documentReady(func) {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    func.call();
  } else {
    document.addEventListener('DOMContentLoaded', func);
  }  
}
