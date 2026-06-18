(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  Array.prototype.slice.call(document.querySelectorAll('.js-filter-form')).forEach(function (form) {
    var scope = form.closest('.section') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var noResult = scope.querySelector('.no-result');
    var search = form.querySelector('.js-search');
    var type = form.querySelector('.js-type-filter');
    var region = form.querySelector('.js-region-filter');

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function update() {
      var keyword = normalize(search && search.value);
      var typeValue = normalize(type && type.value);
      var regionValue = normalize(region && region.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre
        ].join(' '));
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !typeValue || normalize(card.dataset.type) === typeValue;
        var matchesRegion = !regionValue || normalize(card.dataset.region) === regionValue;
        var keep = matchesKeyword && matchesType && matchesRegion;

        card.style.display = keep ? '' : 'none';

        if (keep) {
          visible += 1;
        }
      });

      if (noResult) {
        noResult.classList.toggle('is-visible', visible === 0);
      }
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('reset', function () {
      window.setTimeout(update, 0);
    });

    update();
  });
})();
