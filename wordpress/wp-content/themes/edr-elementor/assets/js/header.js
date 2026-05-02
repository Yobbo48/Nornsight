document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.edr-site-header');

  if (!header) {
    return;
  }

  var toggle = header.querySelector('.edr-site-header__toggle');

  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});
