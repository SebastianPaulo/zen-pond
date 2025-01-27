export class LillyPad {
  radius = 100;
  constructor(position) {
    this.position = position;
  }

  renderShadow(ctx) {
    ctx.fillStyle = "#aaaaaa";
    ctx.beginPath();
    ctx.arc(
      this.position.x + 25,
      this.position.y + 25,
      this.radius,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  render(ctx) {
    ctx.fillStyle = "#47b897";
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "#3fac8d";
    for (let i = 0; i < 7; i++) {
      const tau = ((Math.PI * 2) / 7) * i;
      ctx.beginPath();
      ctx.ellipse(
        this.position.x + (Math.cos(tau) * this.radius) / 2,
        this.position.y + (Math.sin(tau) * this.radius) / 2,
        this.radius / 2,
        3,
        tau,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}
