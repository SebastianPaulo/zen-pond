import { nextPoint } from "./random.js";

const screen = document.querySelector("#canvas");

export class Fish {
  color = "#EEA237";
  chainPositions = [];
  thickness = [];
  segmentLength = 5;

  zIndex = 25;

  direction = 0.0 * Math.PI;
  speed = 0.1;

  reached;
  constructor(
    position = {
      x: 300,
      y: 300,
    },
    direction = 0.0 * Math.PI,
    segmentLength = 5,
    thickness = [
      18, 19, 20, 21, 20, 19, 18, 17, 16, 15, 15, 14, 13, 12, 10, 9, 8, 8, 7, 7,
      6,
    ]
  ) {
    this.segmentLength = segmentLength;
    this.thickness = thickness;
    this.direction = direction;
    this.chainPositions[0] = { ...position };
    for (let index = 1; index < thickness.length; index++) {
      this.chainPositions[index] = {
        x:
          this.chainPositions[index - 1].x -
          segmentLength * Math.cos(this.direction),
        y:
          this.chainPositions[index - 1].y -
          segmentLength * Math.sin(this.direction),
      };
    }
  }

  update(dT) {
    this.chainPositions[0].x += Math.cos(this.direction) * this.speed * dT;
    this.chainPositions[0].y += Math.sin(this.direction) * this.speed * dT;
    // this.direction += 0.01 * Math.PI;

    let p = {
      ...this.chainPositions[0],
      thickness: this.chainPositions[0].thickness,
    };
    this.chainPositions[0] = p;

    for (let index = 1; index < this.chainPositions.length; index++) {
      let p2 = { ...this.chainPositions[index] };
      const p1 = { ...this.chainPositions[index - 1] };
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      let angle = Math.atan2(dy, dx);
      //Fix rotation threshhold

      p2.x = Math.cos(angle) * this.segmentLength + p1.x;
      p2.y = Math.sin(angle) * this.segmentLength + p1.y;
      this.chainPositions[index] = { ...p2 };
    }
    const { x, y } = this.chainPositions[0];

    if (x < 20 || y < 20 || x > screen.width - 20 || y > screen.height - 20) {
      // Wall Protection
      let p = nextPoint({
        width: screen.width - 40,
        height: screen.height - 40,
      });
      p.x += 20;
      p.y += 20;
      this.target(p);
      this.speed = 0.1;
    }
    if (Math.random() < 0.005) {
      // Attention gone
      this.turn(((Math.random() - 0.5) * Math.PI) / 2);
      //  this.target({ x: Math.random() * 800, y: Math.random() * 600 });
    }
    this.direction %= Math.PI * 2;

    this.speed = Math.min(0.35, Math.max(0.1, this.speed));
    if (this.reached) {
      const dx = Math.abs(this.reached.x - this.chainPositions[0].x);
      const dy = Math.abs(this.reached.y - this.chainPositions[0].y);
      if (dx + dy < 20) {
        const x = setInterval(() => {
          this.speed -= 0.01;
          if (this.speed <= 0.1) {
            clearInterval(x);
          }
        }, 100);
      }
    }
  }

  target(pos) {
    const dy = pos.y - this.chainPositions[0].y;
    const dx = pos.x - this.chainPositions[0].x;
    const newDirection = Math.atan2(dy, dx);
    this.speed = 0.1 + Math.random() * 0.25;

    this.direction = newDirection;

    this.reached = pos;
  }

  turn(change) {
    this.direction += change;
  }
  getPolyPoints() {
    const poly = [];
    for (let r = -Math.PI / 2; r <= Math.PI / 2; r += Math.PI / 4) {
      poly.push({
        x:
          this.chainPositions[0].x +
          Math.cos(this.direction - r) * this.thickness[0],
        y:
          this.chainPositions[0].y +
          Math.sin(this.direction - r) * this.thickness[0],
      });
    }

    for (let i = 1; i < this.chainPositions.length - 1; i++) {
      const dy = this.chainPositions[i].y - this.chainPositions[i - 1].y;
      const dx = this.chainPositions[i].x - this.chainPositions[i - 1].x;
      const d = Math.atan2(dy, dx);
      poly.push({
        x:
          this.chainPositions[i].x +
          Math.cos(d + Math.PI / 2) * this.thickness[i],
        y:
          this.chainPositions[i].y +
          Math.sin(d + Math.PI / 2) * this.thickness[i],
      });
    }
    const last = this.chainPositions.length - 1;
    for (let r = -Math.PI / 2; r <= Math.PI / 2; r += Math.PI / 4) {
      const dy = this.chainPositions[last].y - this.chainPositions[last - 1].y;
      const dx = this.chainPositions[last].x - this.chainPositions[last - 1].x;
      const d = Math.atan2(dy, dx);
      poly.push({
        x: this.chainPositions[last].x + Math.cos(d - r) * this.thickness[last],
        y: this.chainPositions[last].y + Math.sin(d - r) * this.thickness[last],
      });
    }

    for (let i = this.chainPositions.length - 1; i > 1; i--) {
      const dy = this.chainPositions[i].y - this.chainPositions[i - 1].y;
      const dx = this.chainPositions[i].x - this.chainPositions[i - 1].x;
      const d = Math.atan2(dy, dx);
      poly.push({
        x:
          this.chainPositions[i].x +
          Math.cos(d - Math.PI / 2) * this.thickness[i],
        y:
          this.chainPositions[i].y +
          Math.sin(d - Math.PI / 2) * this.thickness[i],
      });
    }

    return poly;
  }
}
