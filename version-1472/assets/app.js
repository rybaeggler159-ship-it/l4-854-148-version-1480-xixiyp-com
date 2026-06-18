(function () {
  function selectAll(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  selectAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
        return;
      }
      event.preventDefault();
      window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
    });
  });

  var hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5000);
    }
  }

  selectAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-live-search]');
    var chips = selectAll('[data-filter-value]', scope);
    var cards = selectAll('.searchable-card', scope);
    var activeValue = '全部';

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-type'),
        card.getAttribute('data-category'),
        card.textContent
      ].join(' '));
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      cards.forEach(function (card) {
        var matchesText = !query || cardText(card).indexOf(query) !== -1;
        var cardType = card.getAttribute('data-type') || '';
        var cardCategory = card.getAttribute('data-category') || '';
        var matchesChip = activeValue === '全部' || cardType === activeValue || cardCategory === activeValue;
        card.style.display = matchesText && matchesChip ? '' : 'none';
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeValue = chip.getAttribute('data-filter-value') || '全部';
        chips.forEach(function (other) {
          other.classList.toggle('is-active', other === chip);
        });
        applyFilter();
      });
    });

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
      }
      input.addEventListener('input', applyFilter);
    }

    applyFilter();
  });

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 420);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
