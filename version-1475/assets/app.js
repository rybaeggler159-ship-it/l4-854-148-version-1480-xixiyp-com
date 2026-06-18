(function() {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function() {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', carousel);
        var dots = selectAll('[data-hero-dot]', carousel);
        var index = 0;
        function show(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                show(i);
            });
        });
        window.setInterval(function() {
            show(index + 1);
        }, 5600);
    }

    function setupFilters() {
        var panel = document.querySelector('[data-filter-panel]');
        var list = document.querySelector('[data-filter-list]');
        if (!panel || !list) {
            return;
        }
        var input = panel.querySelector('[data-filter-input]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var genreSelect = panel.querySelector('[data-filter-genre]');
        var categorySelect = panel.querySelector('[data-filter-category]');
        var cards = selectAll('[data-filter-card]', list);
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && input) {
            input.value = query;
        }
        function matchYear(card, value) {
            if (!value) {
                return true;
            }
            var year = parseInt(card.getAttribute('data-year'), 10) || 0;
            if (value === 'older') {
                return year > 0 && year < 2020;
            }
            return String(year) === value;
        }
        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var year = yearSelect ? yearSelect.value : '';
            var genre = genreSelect ? genreSelect.value : '';
            var category = categorySelect ? categorySelect.value : '';
            cards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-tags') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                var ok = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (ok && !matchYear(card, year)) {
                    ok = false;
                }
                if (ok && genre && text.indexOf(genre.toLowerCase()) === -1) {
                    ok = false;
                }
                if (ok && category && card.getAttribute('data-category') !== category) {
                    ok = false;
                }
                card.style.display = ok ? '' : 'none';
            });
        }
        [input, yearSelect, genreSelect, categorySelect].forEach(function(el) {
            if (!el) {
                return;
            }
            el.addEventListener('input', apply);
            el.addEventListener('change', apply);
        });
        apply();
    }

    function initPlayer(videoId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.querySelector('[data-play-button]');
        if (!video || !streamUrl) {
            return;
        }
        var prepared = false;
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function play() {
            prepare();
            if (button) {
                button.classList.add('is-hidden');
            }
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function() {});
            }
        }
        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('click', function() {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function() {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
    }

    window.SitePlayer = {
        init: initPlayer
    };

    document.addEventListener('DOMContentLoaded', function() {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
