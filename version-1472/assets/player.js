function setupPlayer(source, videoId) {
  var video = document.getElementById(videoId);
  var cover = document.querySelector('[data-player-cover]');
  var hls = null;

  if (!video) {
    return;
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function showCover() {
    if (cover) {
      cover.classList.remove('is-hidden');
    }
  }

  function attachSource() {
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    hideCover();
    var playResult = video.play();
    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        showCover();
      });
    }
  }

  attachSource();

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  video.addEventListener('play', hideCover);
  video.addEventListener('ended', showCover);

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
