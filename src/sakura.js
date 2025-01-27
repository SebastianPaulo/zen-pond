import { nextInt } from "./random.js";

const screen = document.querySelector("#canvas");
export class SakuraPedal {
  position = { x: 50, y: 50 };
  buffer;
  angle = Math.PI / 4;
  direction = Math.PI / 8;
  speed = 0.08;

  height = 2;

  spawnWait;
  constructor(position, height) {
    this.height = height;
    this.position = position;
    this.direction += ((Math.random() - 0.5) * Math.PI) / 4;
    this.angle += ((Math.random() - 0.5) * Math.PI) / 2;
    this.buffer = document.createElement("canvas");
    const ctx = this.buffer.getContext("2d");
    ctx.save();
    ctx.fillStyle = "#e9b1cd";
    ctx.beginPath();
    ctx.ellipse(5, 10, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.moveTo(2, 0);
    ctx.lineTo(5, 7);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 0);

    ctx.fill();

    ctx.restore();
  }
  update(dT) {
    if (this.height <= 1) {
      //landed
      if (!this.spawnWait) {
        this.spawnWait = setTimeout(() => {
          this.height = 2;
          this.position.x = nextInt(screen.width);
          this.position.y = nextInt(screen.width);
          this.angle = Math.random() * Math.PI * 2;
          clearTimeout(this.spawnWait);
          delete this.spawnWait;
        }, Math.random() * 1000 + 1000);
      }
      return;
    }
    this.position.x += Math.cos(this.direction) * this.speed * dT;
    this.position.y += Math.sin(this.direction) * this.speed * dT;
    this.height -= 0.0001 * dT;
  }
  render(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(this.height, this.height);
    ctx.rotate(this.angle);
    ctx.drawImage(this.buffer, 0, 0);
    ctx.restore();
  }
}
