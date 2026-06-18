(function () {
    const body = document.body;
    const menuButton = document.querySelector("[data-menu-button]");

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            body.classList.toggle("is-menu-open");
        });
    }

    document.querySelectorAll("[data-global-search-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const input = form.querySelector("input[name='q']");
            const query = input ? input.value.trim() : "";
            if (query) {
                window.location.href = "./search.html?q=" + encodeURIComponent(query);
            }
        });
    });

    const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    const previous = document.querySelector("[data-hero-prev]");
    const next = document.querySelector("[data-hero-next]");
    let activeSlide = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeSlide);
        });
    }

    function startHeroTimer() {
        if (heroTimer || slides.length < 2) {
            return;
        }
        heroTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    function restartHeroTimer() {
        if (heroTimer) {
            window.clearInterval(heroTimer);
            heroTimer = null;
        }
        startHeroTimer();
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            restartHeroTimer();
        });
    });

    if (previous) {
        previous.addEventListener("click", function () {
            showSlide(activeSlide - 1);
            restartHeroTimer();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(activeSlide + 1);
            restartHeroTimer();
        });
    }

    showSlide(0);
    startHeroTimer();

    const pageSearch = document.querySelector("[data-page-search]");
    const filterBar = document.querySelector("[data-filter-bar]");
    const cards = Array.from(document.querySelectorAll("[data-card]"));
    const emptyState = document.querySelector("[data-empty-state]");
    let activeFilter = "全部";

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function applyListState() {
        const query = pageSearch ? normalize(pageSearch.value.trim()) : "";
        let visibleCount = 0;

        cards.forEach(function (card) {
            const meta = normalize(card.getAttribute("data-meta"));
            const matchesQuery = !query || meta.indexOf(query) !== -1;
            const matchesFilter = activeFilter === "全部" || meta.indexOf(normalize(activeFilter)) !== -1;
            const shouldShow = matchesQuery && matchesFilter;
            card.style.display = shouldShow ? "" : "none";
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visibleCount === 0);
        }
    }

    if (pageSearch) {
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get("q") || "";
        pageSearch.value = initialQuery;
        pageSearch.addEventListener("input", applyListState);
    }

    if (filterBar) {
        filterBar.querySelectorAll("[data-filter-value]").forEach(function (button) {
            button.addEventListener("click", function () {
                activeFilter = button.getAttribute("data-filter-value") || "全部";
                filterBar.querySelectorAll("[data-filter-value]").forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyListState();
            });
        });
    }

    if (cards.length) {
        applyListState();
    }
})();
