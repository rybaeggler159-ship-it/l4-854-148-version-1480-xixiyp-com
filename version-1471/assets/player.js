(function () {
  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var cover = document.getElementById(options.coverId);
    var started = false;
    var hlsInstance = null;

    if (!video || !cover || !options.source) {
      return;
    }

    var bindSource = function () {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.source;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(options.source);
        hlsInstance.attachMedia(video);
        return new Promise(function (resolve) {
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
        });
      }

      video.src = options.source;
      return Promise.resolve();
    };

    var start = function () {
      if (started) {
        video.play();
        return;
      }
      started = true;
      cover.classList.add("is-hidden");
      bindSource().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            cover.classList.remove("is-hidden");
            started = false;
          });
        }
      });
    };

    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!started) {
        start();
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
