(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        initMobileMenu();
        initHeroCarousel();
        initSearchForms();
        initFilters();
        initPlayers();
    });

    function initMobileMenu() {
        var button = document.querySelector("[data-mobile-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");

        if (!button || !menu) {
            return;
        }

        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initHeroCarousel() {
        var carousel = document.querySelector("[data-hero-carousel]");

        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var index = 0;

        if (slides.length <= 1) {
            return;
        }

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var target = Number(dot.getAttribute("data-hero-dot"));
                show(target);
            });
        });

        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function initSearchForms() {
        var forms = document.querySelectorAll("[data-site-search-form]");

        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                var target = form.getAttribute("data-search-target") || "search.html";
                var url = value ? target + "?q=" + encodeURIComponent(value) : target;

                window.location.href = url;
            });
        });
    }

    function initFilters() {
        var scopes = document.querySelectorAll("[data-filter-scope]");

        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var year = scope.querySelector("[data-filter-year]");
            var type = scope.querySelector("[data-filter-type]");
            var category = scope.querySelector("[data-filter-category]");
            var list = document.querySelector("[data-filter-list]");
            var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");

            if (input && query) {
                input.value = query;
            }

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function apply() {
                var keyword = normalize(input ? input.value : "");
                var selectedYear = normalize(year ? year.value : "");
                var selectedType = normalize(type ? type.value : "");
                var selectedCategory = normalize(category ? category.value : "");

                cards.forEach(function (card) {
                    var text = normalize(card.textContent);
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var cardCategory = normalize(card.getAttribute("data-category"));
                    var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchesYear = !selectedYear || cardYear === selectedYear;
                    var matchesType = !selectedType || cardType.indexOf(selectedType) !== -1;
                    var matchesCategory = !selectedCategory || cardCategory === selectedCategory;

                    card.classList.toggle("is-hidden", !(matchesKeyword && matchesYear && matchesType && matchesCategory));
                });
            }

            [input, year, type, category].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            apply();
        });
    }

    function initPlayers() {
        var players = document.querySelectorAll(".video-player[data-hls-src]");

        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector(".player-cover");
            var source = player.getAttribute("data-hls-src");
            var initialized = false;

            if (!video || !button || !source) {
                return;
            }

            function startPlayback() {
                if (!initialized) {
                    initialized = true;
                    attachSource(video, source);
                }

                player.classList.add("is-playing");
                video.controls = true;

                var playPromise = video.play();

                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        player.classList.remove("is-playing");
                    });
                }
            }

            button.addEventListener("click", function (event) {
                event.stopPropagation();
                startPlayback();
            });

            player.addEventListener("click", function () {
                if (!player.classList.contains("is-playing")) {
                    startPlayback();
                }
            });
        });
    }

    function attachSource(video, source) {
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        video.src = source;
    }
})();
