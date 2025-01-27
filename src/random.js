export function nextInt(number) {
  return Math.floor(Math.random() * number);
}

export function nextPoint(dim) {
  return { x: nextInt(dim.width), y: nextInt(dim.height) };
}
