(function () {
  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector("[data-mobile-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });
  }

  var hero = document.getElementById("heroCarousel");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    var activate = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        activate(Number(dot.getAttribute("data-hero-dot")));
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  var filterForm = document.querySelector("[data-local-filter]");
  var grid = document.querySelector("[data-sortable-grid]");

  if (filterForm && grid) {
    var input = filterForm.querySelector("input");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".filter-card"));

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var content = (card.getAttribute("data-search") || "").toLowerCase();
        card.style.display = content.indexOf(query) > -1 ? "" : "none";
      });
    });
  }

  var sortBar = document.querySelector("[data-sort-bar]");
  if (sortBar && grid) {
    sortBar.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-sort]");
      if (!button) {
        return;
      }
      var mode = button.getAttribute("data-sort");
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".filter-card"));
      sortBar.querySelectorAll("button").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      cards.sort(function (a, b) {
        if (mode === "heat") {
          return Number(b.getAttribute("data-heat")) - Number(a.getAttribute("data-heat"));
        }
        if (mode === "year") {
          return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
        }
        return Number(a.getAttribute("data-order")) - Number(b.getAttribute("data-order"));
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    });
  }

  var searchSection = document.querySelector("[data-search-section]");
  if (searchSection && window.searchMovies) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.querySelector("[data-search-input]");
    var title = document.querySelector("[data-search-title]");
    var results = document.querySelector("[data-search-results]");

    if (input) {
      input.value = query;
    }

    if (query && results && title) {
      var words = query.toLowerCase().split(/\s+/).filter(Boolean);
      var matches = window.searchMovies.filter(function (movie) {
        var text = movie.search.toLowerCase();
        return words.every(function (word) {
          return text.indexOf(word) > -1;
        });
      }).slice(0, 120);

      title.textContent = matches.length ? "搜索结果" : "暂无匹配内容";
      results.innerHTML = matches.map(function (movie) {
        return [
          "<article class=\"movie-card toffee-card hover-lift\">",
          "<a class=\"poster-link\" href=\"" + movie.url + "\">",
          "<img src=\"" + movie.cover + "\" alt=\"" + movie.title + "\" loading=\"lazy\">",
          "<span class=\"poster-gradient\"></span>",
          "<span class=\"watch-chip\">观看</span>",
          "</a>",
          "<div class=\"movie-card-body\">",
          "<a class=\"movie-title\" href=\"" + movie.url + "\">" + movie.title + "</a>",
          "<p class=\"movie-desc\">" + movie.desc + "</p>",
          "<div class=\"movie-meta\"><span>" + movie.year + "</span><span>" + movie.region + "</span></div>",
          "<div class=\"tag-list\">" + movie.tags.map(function (tag) { return "<span>" + tag + "</span>"; }).join("") + "</div>",
          "</div>",
          "</article>"
        ].join("");
      }).join("");
    }
  }
})();
