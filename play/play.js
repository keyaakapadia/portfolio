const cur = document.getElementById("cur");
const yearEl = document.getElementById("yr");

document.addEventListener("mousemove", (e) => {
  if (!cur) return;
  cur.style.left = `${e.clientX}px`;
  cur.style.top = `${e.clientY}px`;
});

document.querySelectorAll("a, .item").forEach((el) => {
  el.addEventListener("mouseenter", () => document.body.classList.add("hov"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("hov"));
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function makeVideoTile(blockEl, stillEl, clipEls) {
  if (!blockEl || !stillEl || !clipEls || !clipEls.length) return;

  const videos = [...clipEls];
  let order = [];
  let pointer = 0;
  let currentVideo = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function resetVideo(video) {
    video.pause();
    video.classList.remove("active");
    video.currentTime = 0;
    video.onended = null;
  }

  function stopAllExcept(activeVideo) {
    videos.forEach((video) => {
      if (video !== activeVideo) {
        resetVideo(video);
      }
    });
  }

  function playByIndex(index) {
    const video = videos[index];
    if (!video) return;

    currentVideo = video;
    stopAllExcept(video);

    stillEl.classList.add("hide");
    video.classList.add("active");
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        stillEl.classList.remove("hide");
      });
    }

    video.onended = () => {
      pointer++;

      if (pointer >= order.length) {
        order = shuffle(videos.map((_, i) => i));
        pointer = 0;
      }

      playByIndex(order[pointer]);
    };
  }

  function startRotation() {
    order = shuffle(videos.map((_, i) => i));
    pointer = 0;
    playByIndex(order[pointer]);
  }

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
  });

  startRotation();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (currentVideo) currentVideo.pause();
    } else {
      if (currentVideo) {
        const resumePromise = currentVideo.play();
        if (resumePromise && typeof resumePromise.catch === "function") {
          resumePromise.catch(() => {});
        }
      }
    }
  });
}

makeVideoTile(
  document.getElementById("trackingBlock"),
  document.getElementById("trackingStill"),
  document.querySelectorAll('[data-tile="tracking"]')
);

makeVideoTile(
  document.getElementById("animationBlock"),
  document.getElementById("animationStill"),
  document.querySelectorAll('[data-tile="animation"]')
);

makeVideoTile(
  document.getElementById("disconnectBlock"),
  document.getElementById("disconnectStill"),
  document.querySelectorAll('[data-tile="disconnect"]')
);

makeVideoTile(
  document.getElementById("lightBlock"),
  document.getElementById("lightStill"),
  document.querySelectorAll('[data-tile="light"]')
);

makeVideoTile(
  document.getElementById("breatheBlock"),
  document.getElementById("breatheStill"),
  document.querySelectorAll('[data-tile="breathe"]')
);

makeVideoTile(
  document.getElementById("unfilteredBlock"),
  document.getElementById("unfilteredStill"),
  document.querySelectorAll('[data-tile="unfiltered"]')
);
