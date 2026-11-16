let scene = new Phaser.Scene("Game");

scene.preload = function() {
  this.load.image('bg', 'assets/sprites/background.png');
  this.load.image('card', 'assets/sprites/card.png');
};

scene.create = function() {
  this.add.sprite(0, 0, 'bg').setOrigin(0, 0);

  let positions = this.getCardsPositions();

  for (let position of positions) {
    this.add.sprite(position.x, position.y, 'card').setOrigin(0, 0);
  }
};

scene.getCardsPositions = function() {
  let positions = [
    { x: 0, y: 0 },
    { x: 300, y: 0 },
  ];

  for (let row = 0; row < config.rows; row++) {

  }

  return positions;
}

let config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  rows: 2,
  cols: 5,
  scene: scene
};

let game = new Phaser.Game(config);