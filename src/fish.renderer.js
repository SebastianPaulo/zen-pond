export class FishRenderer {
  renderShadow(ctx, fish) {
    const poly = fish
      .getPolyPoints()
      .map((p) => ({ x: p.x + fish.zIndex, y: p.y + fish.zIndex }));

    ctx.fillStyle = "#aaaaaa";
    this.renderFin(ctx, 9, poly, "left");
    this.renderFin(ctx, poly.length - 4, poly, "right");
    this.renderFin(ctx, 20, poly, "left", "small");
    this.renderFin(ctx, poly.length - 4 - 11, poly, "right", "small");
    this.renderTailFin(ctx, poly);

    // ---- Body
    ctx.fillStyle = "#aaaaaa";

    this.renderBody(ctx, poly, fish);
  }

  render(ctx, fish) {
    const poly = fish.getPolyPoints();

    ctx.fillStyle = fish.secondaryColor;

    this.renderFin(ctx, 9, poly, "left");
    this.renderFin(ctx, poly.length - 4, poly, "right");
    this.renderFin(ctx, 20, poly, "left", "small");
    this.renderFin(ctx, poly.length - 4 - 11, poly, "right", "small");
    this.renderTailFin(ctx, poly);

    ctx.fillStyle = fish.color;

    this.renderBody(ctx, poly, fish);

    ctx.fillStyle = "#555";

    ctx.beginPath();
    const eyeWidth = 0.66;
    const eyeL = {
      x:
        fish.chainPositions[0].x +
        (poly[1].x - fish.chainPositions[0].x) * eyeWidth,
      y:
        fish.chainPositions[0].y + // ---- Finns
        (poly[1].y - fish.chainPositions[0].y) * eyeWidth,
    };
    ctx.ellipse(eyeL.x, eyeL.y, 3, 3, 0, 0, 360);
    ctx.fill();

    ctx.beginPath();
    const eyeR = {
      x:
        fish.chainPositions[0].x +
        (poly[3].x - fish.chainPositions[0].x) * eyeWidth,
      y:
        fish.chainPositions[0].y +
        (poly[3].y - fish.chainPositions[0].y) * eyeWidth,
    };
    ctx.ellipse(eyeR.x, eyeR.y, 3, 3, 0, 0, 360);
    ctx.fill();

    this.renderBackFin(ctx, fish);
  }

  renderBody(ctx, poly, fish) {
    fish.chainPositions.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, fish.thickness[i], 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.beginPath();

    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length - 1; i++) {
      const p = poly[i];
      var xc = (poly[i].x + poly[i + 1].x) / 2;
      var yc = (poly[i].y + poly[i + 1].y) / 2;
      ctx.quadraticCurveTo(p.x, p.y, xc, yc);
    }

    ctx.quadraticCurveTo(
      poly[poly.length - 2].x,
      poly[poly.length - 2].y,
      poly[0].x,
      poly[0].y
    );

    ctx.fill();
  }

  renderTailFin(ctx, poly) {
    const tailLength = 25;
    ctx.beginPath();
    const tPos = poly.length / 2 + 3;
    let rTail = Math.atan2(
      poly[tPos].y - poly[tPos - 2].y,
      poly[tPos].x - poly[tPos - 2].x
    );
    ctx.ellipse(
      poly[tPos - 1].x - Math.sin(rTail) * tailLength,
      poly[tPos - 1].y + Math.cos(rTail) * tailLength,
      4,
      tailLength,
      rTail + Math.PI,
      0,
      Math.PI
    );
    ctx.fill();
  }

  renderFin(ctx, join, poly, position, size = "big") {
    ctx.beginPath();
    let r = Math.atan2(
      poly[join].y - poly[join - 1].y,
      poly[join].x - poly[join - 1].x
    );
    r += ((position === "left" ? 1 : -1) * Math.PI) / 4;
    ctx.ellipse(
      poly[join].x,
      poly[join].y,
      size === "big" ? 20 : 10,
      5,
      r,
      0,
      360
    );
    ctx.fill();
  }

  renderBackFin(ctx, fish) {
    ctx.strokeStyle = "#555";
    ctx.beginPath();
    const start = 8;
    ctx.moveTo(fish.chainPositions[start].x, fish.chainPositions[start].y);
    for (let i = start; i < fish.chainPositions.length - 4; i++) {
      const p = fish.chainPositions[i];
      var xc = (fish.chainPositions[i].x + fish.chainPositions[i + 1].x) / 2;
      var yc = (fish.chainPositions[i].y + fish.chainPositions[i + 1].y) / 2;
      ctx.quadraticCurveTo(p.x, p.y, xc, yc);
    }
    ctx.stroke();
  }
}
