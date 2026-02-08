(function () {
  "use strict";

  var questionScreen = document.getElementById("question-screen");
  var successScreen = document.getElementById("success-screen");
  var btnYes = document.getElementById("btn-yes");
  var btnNo = document.getElementById("btn-no");

  var mouseX = -1e5;
  var mouseY = -1e5;
  var noIsWandering = false;
  var yesGotBigger = false;

  var MIN_DISTANCE = 120;   /* No button keeps this many px from cursor */
  var PADDING = 50;         /* Button center stays within page bounds */
  var SMOOTH = 0.14;        /* 0–1: how quickly it glides away (higher = snappier) */

  function getNoCenter() {
    var left = parseFloat(btnNo.style.left);
    var top = parseFloat(btnNo.style.top);
    if (isNaN(left) || isNaN(top)) return null;
    return { x: left, y: top };
  }

  function setNoCenter(x, y) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    x = Math.max(PADDING, Math.min(w - PADDING, x));
    y = Math.max(PADDING, Math.min(h - PADDING, y));
    btnNo.style.left = x + "px";
    btnNo.style.top = y + "px";
  }

  function distance(ax, ay, bx, by) {
    return Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  }

  function startFleeing() {
    if (noIsWandering) return;
    noIsWandering = true;
    btnNo.classList.add("wandering");
    document.body.appendChild(btnNo);

    var rect = btnNo.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    btnNo.style.left = cx + "px";
    btnNo.style.top = cy + "px";
    btnNo.style.transform = "translate(-50%, -50%)";

    if (!yesGotBigger) {
      yesGotBigger = true;
      btnYes.classList.add("bigger");
    }
  }

  function updateFlee() {
    if (!noIsWandering || btnNo.classList.contains("hidden")) return;

    var center = getNoCenter();
    if (!center) return;

    var d = distance(mouseX, mouseY, center.x, center.y);
    if (d < 1) return; /* avoid div by zero */

    /* Direction from cursor to button (button runs this way) */
    var dx = (center.x - mouseX) / d;
    var dy = (center.y - mouseY) / d;

    if (d < MIN_DISTANCE) {
      /* Glide away: move a fraction of the gap each frame for smooth chase */
      var gap = MIN_DISTANCE - d;
      var moveX = dx * gap * SMOOTH;
      var moveY = dy * gap * SMOOTH;
      setNoCenter(center.x + moveX, center.y + moveY);
    }
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!noIsWandering) {
      var rect = btnNo.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      if (distance(mouseX, mouseY, cx, cy) < MIN_DISTANCE) {
        startFleeing();
      }
      return;
    }

    updateFlee();
  }

  function fireConfetti() {
    if (typeof confetti !== "function") return;
    var count = 200;
    var defaults = {
      origin: { y: 0.6 },
      colors: ["#e91e63", "#f06292", "#f8bbd9", "#c2185b", "#ffcdd2", "#fff"],
      shapes: ["circle", "square"],
    };
    confetti(
      Object.assign({}, defaults, {
        particleCount: count,
        spread: 70,
        startVelocity: 30,
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount: count * 0.6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount: count * 0.6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })
    );
  }

  function showSuccess() {
    btnNo.classList.add("hidden");
    fireConfetti();
    questionScreen.classList.remove("screen--active");
    successScreen.classList.add("screen--active");
  }

  function tick() {
    updateFlee();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.addEventListener("mousemove", onMouseMove);

  /* Touch: use first touch for "cursor" position so it works on mobile */
  window.addEventListener("touchmove", function (e) {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      if (!noIsWandering) {
        var rect = btnNo.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        if (distance(mouseX, mouseY, cx, cy) < MIN_DISTANCE) {
          startFleeing();
        }
      } else {
        updateFlee();
      }
    }
  }, { passive: true });

  btnYes.addEventListener("click", function () {
    showSuccess();
  });
})();
