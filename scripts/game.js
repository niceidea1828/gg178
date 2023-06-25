let mode = "init";
let cf = 0;
let bet = 100;

let auto = false;

let balance = +localStorage.balance_g178;
$(".balance").text(balance);

$(".plane").css({
  background: `url(../png/p${localStorage.selected_g178}.png) center/100% 100%`
});

$(".off").click(function () {
  $(".off").addClass("act");
  $(".auto").removeClass("act");
});

let int;

$(".auto").click(function () {
  $(".auto").addClass("act");
  $(".off").removeClass("act");

  int = setInterval(() => {
    auto = true;
    $(".btn").click();

    setTimeout(() => {
      if (mode == "stop") {
        reset();
      }
    }, 500);
  }, 1500);
});

$(".off").click(function () {
  if (int) {
    clearInterval(int);
    reset();
    mode = "stop";

    setTimeout(() => {
      auto = false;
    }, 200);
  }
});

$(".g.btn").click(function () {
  if (mode != "play") {
    play();
    changeBalance(-bet);
    $(".btn").addClass("r").removeClass("g").html("stop");
  } else if (mode == "play") {
    mode = "stop";

    let win = Math.round(bet * cf);
    changeBalance(win);
  }
});

$(".bet_minus").click(function () {
  if (bet <= 50) {
    return;
  }

  bet -= 50;
  $(".bet").html(bet);
});

$(".bet_plus").click(function () {
  if (bet + 50 >= +localStorage.balance_g178) {
    return;
  }

  bet += 50;
  $(".bet").html(bet);
});

$(".modal_ok").click(function () {
  reset();
  $(".modal").addClass("hidden");
});

window.onload = () => {
  $(".wrapper").removeClass("hidden");
};

function play() {
  let gap = 0;
  mode = "play";

  function move() {
    if ($(".tri").width() > 635) {
      gameOver(false);
      mode = "stop";
      return;
    } else if (mode != "play") {
      gameOver(true);
      mode = "stop";
      return;
    }

    $(".plane").css({
      left: $(".plane").position().left + 3
    });

    $(".tri").css({
      width: $(".tri").width() + 3
    });

    gap++;
    if (gap > 10) {
      cf = Math.round(($(".tri").width() / 705) * 3 * 100) / 100;
      $(".cf").html(cf);
      gap = 0;
    }

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
}

function changeBalance(amount) {
  localStorage.balance_g178 = +localStorage.balance_g178 + amount;
  $(".balance").html(localStorage.balance_g178);
}

function reset() {
  $(".plane").css({
    transition: "left 0.6s ease",
    left: 27
  });

  $(".tri").css({
    width: 0
  });

  cf = 0;
  $(".cf").html(0);

  $(".btn").addClass("g").removeClass("r").html("bet");

  setTimeout(() => {
    $(".plane").css({
      transition: "unset"
    });
  }, 600);
}

function gameOver(win) {
  if (win) {
    $(".modal").addClass("win").removeClass("lose");
    $(".outcome").html("YOU WIN!");
    $(".reward").html(Math.round(cf * bet));
  } else {
    $(".modal").addClass("lose").removeClass("win");
    $(".outcome").html("YOU LOSE (");
    $(".reward").html(0);
  }

  if (auto) {
    $(".reward").html(bet * 0.84);
  }

  $(".modal").removeClass("hidden");

  if (auto) {
    setTimeout(() => {
      $(".modal").addClass("hidden");
    }, 1000);
  }
}
