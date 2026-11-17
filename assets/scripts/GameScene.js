class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('bg', 'assets/sprites/background.png');
    this.load.image('card', 'assets/sprites/card.png');
  };

  create() {
    this.createBackground();
    this.createCards();
  };

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
  }

  createCards() {
    this.cards = [];
    let positions = this.getCardsPositions();

    // for(let position of positions) {
    //   this.cards.push(new Card(this, position));
    // }

     for(let value of config.cards) {
      console.log(value)
    }
  }

  getCardsPositions() {
    let positions = [];

    const offset = 4;
    const cardTexture = this.textures.get('card').getSourceImage();
    const cardWidth = cardTexture.width + offset;
    const cardHeight = cardTexture.height + offset;
    const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
    const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

    for(let row = 0; row < config.rows; row++) {
      for(let col = 0; col < config.cols; col++) {
        positions.push({ 
          x: offsetX + col * cardWidth, 
          y: offsetY + row * cardHeight,
        });
      }
    }

    return positions;
  }
}