(function() {
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function() {
      panel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function() {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(parseInt(dot.getAttribute("data-hero-dot"), 10));
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function searchableText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-category"),
      card.getAttribute("data-year"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-tags"),
      card.textContent
    ].join(" "));
  }

  function applyFilter(targetId) {
    var container = document.getElementById(targetId);
    if (!container) {
      return;
    }
    var input = document.querySelector('[data-filter-input][data-filter-target="' + targetId + '"]');
    var select = document.querySelector('[data-filter-select][data-filter-target="' + targetId + '"]');
    var query = normalize(input ? input.value : "");
    var year = normalize(select ? select.value : "");
    var cards = Array.prototype.slice.call(container.querySelectorAll(".searchable-card"));
    var visible = 0;

    cards.forEach(function(card) {
      var text = searchableText(card);
      var cardYear = normalize(card.getAttribute("data-year"));
      var matched = (!query || text.indexOf(query) !== -1) && (!year || cardYear === year);
      card.classList.toggle("is-hidden-by-filter", !matched);
      if (matched) {
        visible += 1;
      }
    });

    var empty = document.querySelector("[data-empty-state]");
    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
  var filterSelects = Array.prototype.slice.call(document.querySelectorAll("[data-filter-select]"));
  var params = new URLSearchParams(window.location.search);

  filterInputs.forEach(function(input) {
    var paramName = input.getAttribute("data-query-param");
    var targetId = input.getAttribute("data-filter-target");
    if (paramName && params.get(paramName)) {
      input.value = params.get(paramName);
    }
    input.addEventListener("input", function() {
      applyFilter(targetId);
    });
    applyFilter(targetId);
  });

  filterSelects.forEach(function(select) {
    var targetId = select.getAttribute("data-filter-target");
    select.addEventListener("change", function() {
      applyFilter(targetId);
    });
  });
}());
