const levels = [
  { pairs: 2, time: 15, rows: 1, cols: 4 },
  { pairs: 3, time: 20, rows: 2, cols: 3 },
  { pairs: 4, time: 25, rows: 2, cols: 4 },
  { pairs: 5, time: 30, rows: 2, cols: 5 },
  { pairs: 5, time: 25, rows: 2, cols: 5 },
  { pairs: 5, time: 20, rows: 2, cols: 5 },
  { pairs: 5, time: 15, rows: 2, cols: 5 },
];

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
  timeout: 30,
  scene: new GameScene(),
};

let game = new Phaser.Game(config);