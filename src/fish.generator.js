import { Fish } from "./fish.js";
import { nextInt, nextPoint } from "./random.js";

export class FishGenerator {
  createFish() {
    const fish = new Fish(
      nextPoint(screen),
      Math.random() * Math.PI,
      nextInt(4) + 3
    );
    let hue = nextInt(100) - 20;
    if (hue < 360) {
      hue += 360;
    }

    fish.color = `lch(67% 75 ${hue})`;
    fish.secondaryColor = `lch(67% 75 ${hue} / 0.5)`;
    fish.zIndex = Math.random() * 30 + 5;
    return fish;
  }
}
