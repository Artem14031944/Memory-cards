class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('bg', 'assets/sprites/background.png');
    this.load.image('card', 'assets/sprites/card.png');

    this.load.image('card1', 'assets/sprites/card1.png');
    this.load.image('card2', 'assets/sprites/card2.png');
    this.load.image('card3', 'assets/sprites/card3.png');
    this.load.image('card4', 'assets/sprites/card4.png');
    this.load.image('card5', 'assets/sprites/card5.png');

    this.load.audio('theme', 'assets/sounds/theme.mp3');
    this.load.audio('complete', 'assets/sounds/complete.mp3');
    this.load.audio('card', 'assets/sounds/card.mp3');
    this.load.audio('success', 'assets/sounds/success.mp3');
    this.load.audio('timeout', 'assets/sounds/timeout.mp3');
  }

  create() {
    this.currentLevel = 0;
    this.score = 0;
    this.combo = 0;

    this.createSounds();
    this.createBackground();
    this.createText();
    this.createTimer();
    this.loadLevel(this.currentLevel);
  }

  createSounds() {
    this.sounds = {
      card: this.sound.add('card'),
      complete: this.sound.add('complete'),
      theme: this.sound.add('theme'),
      success: this.sound.add('success'),
      timeout: this.sound.add('timeout'),
    };

    this.sounds.theme.play({
      volume: 0.1,
    });
  }

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
  }

  createText() {
    this.levelText = this.add.text(10, 280, '', {
      font: '24px CurseCasual',
      fill: '#ffffff',
    });

    this.timeoutText = this.add.text(10, 310, '', {
      font: '24px CurseCasual',
      fill: '#ffffff',
    });  

    this.scoreText = this.add.text(10, 340, '', {
      font: '24px CurseCasual',
      fill: '#ffffff',
    });
  }

  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onTimerTick,
      callbackScope: this,
    });
  }

  onTimerTick() {
    this.timeoutText.setText('Time: ' + this.timeout);
    this.levelText.setText('Level: ' + (this.currentLevel + 1));
    this.scoreText.setText('Score: ' + this.score);

    if (this.timeout <= 0) {
      this.timer.paused = true;
      this.sounds.timeout.play();
      this.restart();
    } else {
      --this.timeout;
    }
  }

  loadLevel(levelIndex) {
    const levelConfig = levels[levelIndex];
    
    config.rows = levelConfig.rows;
    config.cols = levelConfig.cols;
    config.cards = [];
    for (let i = 1; i <= levelConfig.pairs; i++) {
      config.cards.push(i);
    }
    config.timeout = levelConfig.time;

    this.timeout = config.timeout;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.combo = 0;
    
    this.timer.paused = false;

    this.levelText.setText('Level: ' + (this.currentLevel + 1));
    this.scoreText.setText('Score: ' + this.score);
    this.timeoutText.setText('Time: ' + this.timeout);

    if (this.cards) {
      this.cards.forEach(card => card.destroy());
    }

    this.createCards();
    this.initCardsPositions();
    this.initCards();
    this.showCards();
  }

  restart() {
    let count = 0;

    const onCardsMoveComplete = () => {
      ++count;
      if (count >= this.cards.length) {
        this.loadLevel(this.currentLevel);
      }
    }

    this.cards.forEach(card => {
      card.opened = false;
      card.setTexture('card');
      card.scaleX = 1;

      card.move({
        x: this.sys.game.config.width + card.width,
        y: this.sys.game.config.height + card.height,
        delay: card.position.delay,
        callback: onCardsMoveComplete,
      });
    });
  }

  nextLevel() {
    this.currentLevel++;
    
    if (this.currentLevel >= levels.length) {
      this.scoreText.setText('You Win! Score: ' + this.score);
      return;
    }

    this.restart();
  }

  createCards() {
    this.cards = [];

    for (let value of config.cards) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value));
      }
    }

    this.input.on('gameobjectdown', this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (card.opened) {
      return false;
    }

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.sounds.success.play();
        this.openedCard = null;
        ++this.openedCardsCount;
        this.combo++;
        this.addScore();
      } else {
        this.openedCard.close();
        this.openedCard = card;
        this.combo = 0;
      }
    } else {
      this.openedCard = card;
    }

    card.open(() => {
      if (this.openedCardsCount === this.cards.length / 2) {
        this.timer.paused = true;
        this.sounds.complete.play();
        this.nextLevel();
      }
    });
  }

  addScore() {
    let points = 0;
    
    switch (this.combo) {
      case 1:
        points = 100;
        break;
      case 2:
        points = 250;
        break;
      case 3:
        points = 500;
        break;
      case 4:
        points = 1000;
        break;
      default:
        if (this.combo >= 5) {
          points = 5000;
        }
    }

    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
  }

  initCardsPositions() {
    let positions = [];

    const offset = 4;
    const cardTexture = this.textures.get('card').getSourceImage();
    const cardWidth = cardTexture.width + offset;
    const cardHeight = cardTexture.height + offset;
    const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
    const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

    let id = 0;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        ++id;
        positions.push({
          delay: id * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    this.positions = positions;
  }

  showCards() {
    this.cards.forEach(card => {
      card.depth = card.position.delay;
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    })
  }

  initCards() {
    let positions = Phaser.Utils.Array.Shuffle(this.positions);

    this.cards.forEach((card) => {
      card.init(positions.pop());
    });
  }
}