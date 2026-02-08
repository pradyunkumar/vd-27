(function () {
  "use strict";

  var questionScreen = document.getElementById("question-screen");
  var successScreen = document.getElementById("success-screen");
  var btnYes = document.getElementById("btn-yes");
  var btnNo = document.getElementById("btn-no");
  var noClickCount = 0;

  function getRandomPosition() {
    var padding = 80;
    var maxX = window.innerWidth - padding * 2;
    var maxY = window.innerHeight - padding * 2;
    var x = padding + Math.random() * Math.max(0, maxX);
    var y = padding + Math.random() * Math.max(0, maxY);
    return { x: x, y: y };
  }

  function moveNoButton() {
    var pos = getRandomPosition();
    btnNo.classList.add("wandering");
    btnNo.style.left = pos.x + "px";
    btnNo.style.top = pos.y + "px";
    btnNo.style.transform = "translate(-50%, -50%)";
    // Move node to body so the card layout only shows Yes
    document.body.appendChild(btnNo);
  }

  function makeYesBigger() {
    noClickCount += 1;
    btnYes.classList.add("bigger");
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

  function onNoHover() {
    moveNoButton();
    makeYesBigger();
  }

  btnNo.addEventListener("mouseenter", onNoHover);
  btnNo.addEventListener("mouseover", onNoHover);

  btnYes.addEventListener("click", function () {
    showSuccess();
  });
})();
