(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      document.body.classList.toggle('is-menu-open', menu.classList.contains('is-open'));
    });
  }

  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var searchInput = document.querySelector('.js-search');
  var yearFilter = document.querySelector('.js-year-filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var emptyState = document.querySelector('.js-empty');

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function applyFilter() {
    var keyword = normalize(searchInput ? searchInput.value : '');
    var year = yearFilter ? yearFilter.value : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var cardYear = card.getAttribute('data-year') || '';
      var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
      var yearMatched = !year || cardYear === year;
      var visible = keywordMatched && yearMatched;

      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }
})();

window.initMoviePlayer = function (streamUrl) {
  var video = document.getElementById('movie-video');
  var layer = document.getElementById('play-layer');

  if (!video || !layer || !streamUrl) {
    return;
  }

  var prepared = false;
  var hls = null;

  function prepareVideo() {
    if (prepared) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    prepared = true;
  }

  function startPlay() {
    prepareVideo();
    video.setAttribute('controls', 'controls');
    layer.classList.add('is-hidden');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        layer.classList.remove('is-hidden');
      });
    }
  }

  layer.addEventListener('click', startPlay);
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlay();
    }
  });
  video.addEventListener('ended', function () {
    layer.classList.remove('is-hidden');
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
};
