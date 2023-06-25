let balance = document.querySelector(".balance");
let slotCont = document.querySelector(".slot_cont");

let active = true;
let auto = false;
let bet = 100;
let int;

let colAmount = 3;
let rowAmount = 3;
let slotAmount = 3;
let slotLength = 24;
let slotName = "p";

let visibleSlots = [];

balance.innerHTML = localStorage.getItem("balance_g178");

setVisibleSlots();

for (let i = 0; i < colAmount; i++) {
  let slotCol = document.createElement("div");
  slotCol.classList.add("slot_col");
  slotCont.appendChild(slotCol);
}

initInnerCols();
drawVisibleSlots();

document.querySelector(".spin").onclick = () => {
  if (!active || bet > Number(balance.innerHTML)) {
    return;
  }

  active = false;

  changeBalance(-bet);

  setVisibleSlots();

  drawRandomSlots();
  drawVisibleSlots();

  for (let innerSlotCol of document.querySelectorAll(".inner_slot_col")) {
    innerSlotCol.style.top = -(slotLength + rowAmount) * 100 + "%";
  }

  setTimeout(() => {
    resetSlots();

    if (getMaxCombo() >= 3) {
      gameOver(Math.round((1 + getMaxCombo()) * bet));
    } else {
      gameOver(false);
    }
  }, 5000);
};

$(".again").click(function () {
  active = true;
  $(".modal").addClass("hidden");
});

$(".bet_plus").click(function () {
  changeBet(50);
});

$(".bet_minus").click(function () {
  changeBet(-50);
});

$(".off").click(function () {
  $(".off").addClass("act");
  $(".auto").removeClass("act");

  if (int) {
    clearInterval(int);
    auto = false;
  }
});

$(".auto").click(function () {
  $(".auto").addClass("act");
  $(".off").removeClass("act");

  auto = true;

  $(".btn").click();

  int = setInterval(() => {
    $(".btn").click();
  }, 5500);
});

window.onload = () => {
  document.querySelector(".wrapper").classList.remove("hidden");
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setVisibleSlots() {
  for (let i = 0; i < colAmount; i++) {
    visibleSlots[i] = [];

    for (let j = 0; j < rowAmount; j++) {
      visibleSlots[i][j] = randInt(1, slotAmount);
    }
  }
}

function drawRandomSlots() {
  for (let i = 0; i < colAmount; i++) {
    for (let j = 0; j < slotLength; j++) {
      let slot = document.createElement("div");
      slot.classList.add("slot", "block");

      let slotPic = document.createElement("img");
      slotPic.src = `../png/${slotName}${randInt(1, slotAmount)}.png`;

      slot.appendChild(slotPic);
      document.querySelectorAll(".inner_slot_col")[i].appendChild(slot);
    }
  }
}

function drawVisibleSlots() {
  for (let i = 0; i < colAmount; i++) {
    for (let j = 0; j < rowAmount; j++) {
      let slot = document.createElement("div");
      slot.classList.add("slot", "block");

      let slotPic = document.createElement("img");
      slotPic.src = `../png/${slotName}${visibleSlots[i][j]}.png`;

      slot.appendChild(slotPic);
      document.querySelectorAll(".inner_slot_col")[i].appendChild(slot);
    }
  }
}

function initInnerCols() {
  for (let i = 0; i < colAmount; i++) {
    let innerSlotCol = document.createElement("div");
    innerSlotCol.classList.add("inner_slot_col");

    document.querySelectorAll(".slot_col")[i].appendChild(innerSlotCol);
  }
}

function resetSlots() {
  for (let innerSlotCol of document.querySelectorAll(".inner_slot_col")) {
    innerSlotCol.remove();
  }

  initInnerCols();
  drawVisibleSlots();
}

function getMaxCombo() {
  let maxCombo = 1;

  for (let i = 0; i < rowAmount; i++) {
    let combo = 1;

    for (let j = 1; j < colAmount; j++) {
      if (visibleSlots[j][i] == visibleSlots[j - 1][i]) {
        combo++;

        if (combo > maxCombo) {
          maxCombo = combo;
        }
      } else {
        combo = 1;
      }
    }
  }

  return maxCombo;
}

function changeBalance(amount) {
  let balance = document.querySelector(".balance");
  localStorage.setItem(
    "balance_g178",
    Number(localStorage.getItem("balance_g178")) + amount
  );
  balance.innerHTML = localStorage.getItem("balance_g178");
}

function changeBet(amount) {
  if (bet + amount > +localStorage.balance_g178 || bet + amount < 0) {
    return;
  }

  bet += amount;
  $(".bet").html(bet);
}

function gameOver(win) {
  if (auto) {
    changeBalance(win);
    active = true;
    return;
  }

  if (win) {
    $(".outcome").html("YOU WIN!");
    $(".reward").html(2000);
    $(".modal").addClass("win").removeClass("lose").removeClass("hidden");

    changeBalance(win);
  } else {
    $(".outcome").html("YOU LOSE (");
    $(".reward").html(0);
    $(".modal").addClass("lose").removeClass("win").removeClass("hidden");
  }
}
