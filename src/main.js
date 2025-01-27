import { FishGenerator } from "./fish.generator.js";
import { FishRenderer } from "./fish.renderer.js";
import { LillyPad } from "./lillypad.js";
import { nextPoint } from "./random.js";
import { SakuraPedal } from "./sakura.js";
import { Splash } from "./splash.js";

const fishRenderer = new FishRenderer();
const screen = document.querySelector("#canvas");
function resize() {
  screen.width = document.body.clientWidth;
  screen.height = document.body.clientHeight;
}
function main() {
  resize();
  const context2d = screen.getContext("2d");
  let fishArray = [];

  let splashes = [];
  let lillyPads = [];
  let pedals = [];
  for (let i = 0; i < 5; i++) {
    lillyPads.push(new LillyPad(nextPoint(screen)));
  }
  for (let i = 0; i < 50; i++) {
    pedals.push(new SakuraPedal(nextPoint(screen), Math.random() * 2 + 1));
  }
  const fishGenerator = new FishGenerator();
  for (let index = 0; index < 15; index++) {
    fishArray.push(fishGenerator.createFish());
  }
  fishArray = fishArray.sort((a, b) => a.zIndex - b.zIndex);
  window.fishes = fishArray;
  let oldTime = Date.now();
  setInterval(() => {
    let newTime = Date.now();
    const dT = newTime - oldTime;
    fishArray.forEach((fish) => fish.update(dT));
    splashes.forEach((splash) => splash.update(dT));
    pedals.forEach((pedal) => pedal.update(dT));
    pedals.forEach((p) => {
      p.position.x %= screen.width;
      p.position.y %= screen.height;
      if (p.height <= 1 && !p.spawnWait) {
        splashes.push(new Splash({ x: p.position.x - 3, y: p.position.y + 5 }));
      }
    });
    splashes = splashes.filter((splash) => !splash.finished);
    oldTime = newTime;
  }, 1000 / 60);

  function renderLoop() {
    context2d.clearRect(0, 0, screen.width, screen.height);
    context2d.fillStyle = "#E6E6E6";
    context2d.fillRect(0, 0, screen.width, screen.height);
    splashes.forEach((splash) => splash.renderShadow(context2d));
    lillyPads.forEach((lillyPad) => lillyPad.renderShadow(context2d));
    fishArray.forEach((fish) => fishRenderer.renderShadow(context2d, fish));
    fishArray.forEach((fish) => fishRenderer.render(context2d, fish));
    splashes.forEach((splash) => splash.render(context2d));
    lillyPads.forEach((lillyPad) => lillyPad.render(context2d));

    pedals.forEach((pedal) => pedal.render(context2d));
    requestAnimationFrame(() => renderLoop());
  }

  renderLoop();

  document.addEventListener("click", (e) => {
    fishArray
      .filter(() => Math.random() < 0.3)
      .forEach((fish) => fish.target({ x: e.layerX, y: e.layerY }));
    splashes.push(new Splash({ x: e.layerX, y: e.layerY }));
  });
  window.addEventListener("resize", () => resize());
}

main();
