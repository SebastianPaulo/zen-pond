export class Splash {
  radius = 1;
  finished = false;
  constructor(position) {
    this.position = position;
  }

  renderShadow(ctx) {
    ctx.strokeStyle = "#aaaaaa";
    ctx.beginPath();
    ctx.arc(
      this.position.x + 25,
      this.position.y + 25,
      this.radius,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
  render(ctx) {
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  update(dT) {
    this.radius += (20 * dT) / 1000;
    if (this.radius >= 100) {
      this.finished = true;
    }
  }
}
