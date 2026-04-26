// Serif and Sans lists
const serifFonts = [
  "Merriweather", "Lora", "Bitter", "Playfair Display", "Arvo",
  "Tinos", "Crimson Text", "Domine", "Spectral", "Roboto Slab"
];
const sansFonts = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Raleway",
  "Ubuntu", "Nunito", "Poppins", "Source Sans Pro", "Work Sans"
];

// Build font pool (200 serif + 200 sans = 400 total)
const fonts = [];
for (let i = 0; i < 200; i++) {
  fonts.push({ name: serifFonts[i % serifFonts.length], css: `'${serifFonts[i % serifFonts.length]}', serif` });
  fonts.push({ name: sansFonts[i % sansFonts.length], css: `'${sansFonts[i % sansFonts.length]}', sans-serif` });
}

// Helper: load Google Font dynamically
function loadGoogleFont(fontName) {
  const fontLoader = document.getElementById("fontLoader");
  const id = `google-font-${fontName.replace(/\s+/g, '-')}`;
  if (!document.getElementById(id)) {
    let link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
    fontLoader.appendChild(link);
  }
}

// About Scene
class AboutScene extends Phaser.Scene {
  constructor() { super('About'); }
  create() {
    this.add.text(400, 150, 'FontBattle', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 250, 'How to Play:\nGuess the correct font from two options.\nEach correct answer earns points.', 
      { fontSize: '20px', fill: '#fff', align: 'center' }).setOrigin(0.5);
    this.add.text(400, 420, 'Click anywhere to continue', { fontSize: '18px', fill: '#ccc' }).setOrigin(0.5);
    this.input.on('pointerdown', () => this.scene.start('Settings'));
  }
}

// Settings Scene
class SettingsScene extends Phaser.Scene {
  constructor() { super('Settings'); }
  create() {
    let theme = localStorage.getItem('theme') || 'dark';
    let fontMode = localStorage.getItem('fontMode') || 'system';
    this.cameras.main.setBackgroundColor(theme === 'light' ? '#f0f0f0' : '#1a2a5a');

    // Auto-contrast
    const btnStyle = theme === 'light'
      ? { fill: '#fff', backgroundColor: '#000' }
      : { fill: '#000', backgroundColor: '#fff' };

    let topScore = localStorage.getItem('topScore') || 0;
    let topTime = localStorage.getItem('topTime') || '-';
    this.add.text(400, 80, 'Settings', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 150, `Top Score: ${topScore}`, { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 190, `Best Time: ${topTime}s`, { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);

    let themeBtn = this.add.text(400, 260, `Theme: ${theme}`, {
      fontSize: '24px',
      fill: btnStyle.fill,
      backgroundColor: btnStyle.backgroundColor,
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive();
    themeBtn.on('pointerdown', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      this.scene.restart();
    });

    let fontBtn = this.add.text(400, 320, `Font Source: ${fontMode}`, {
      fontSize: '24px',
      fill: btnStyle.fill,
      backgroundColor: btnStyle.backgroundColor,
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive();
    fontBtn.on('pointerdown', () => {
      fontMode = fontMode === 'system' ? 'google' : 'system';
      localStorage.setItem('fontMode', fontMode);
      this.scene.restart();
    });

    let startBtn = this.add.text(400, 420, 'Start Game', {
      fontSize: '28px',
      fill: btnStyle.fill,
      backgroundColor: btnStyle.backgroundColor,
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('Game'));
  }
}

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init() {
    this.score = 0;
    this.questionCount = 0;
    this.maxQuestions = 15;
    this.startTime = Date.now();
    this.fontMode = localStorage.getItem('fontMode') || 'system';
  }
  create() {
    let theme = localStorage.getItem('theme') || 'dark';
    const btnStyle = theme === 'light'
      ? { fill: '#fff', backgroundColor: '#000' }
      : { fill: '#000', backgroundColor: '#fff' };

    this.questionText = this.add.text(400, 80, 'What font is this?', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
    this.sampleText = this.add.text(400, 200, 'A', { fontSize: '120px', fill: '#fff' }).setOrigin(0.5);

    this.option1 = this.add.text(300, 400, '', {
      fontSize: '24px',
      fill: btnStyle.fill,
      backgroundColor: btnStyle.backgroundColor,
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
    this.option2 = this.add.text(500, 400, '', {
      fontSize: '24px',
      fill: btnStyle.fill,
      backgroundColor: btnStyle.backgroundColor,
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
    this.counterText = this.add.text(400, 500, '0/15', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

    this.loadQuestion();
    this.option1.on('pointerdown', () => this.checkAnswer(this.option1.text));
    this.option2.on('pointerdown', () => this.checkAnswer(this.option2.text));
  }
  loadQuestion() {
    if (this.questionCount >= this.maxQuestions) return this.endGame();
    this.questionCount++;
    this.counterText.setText(`${this.score}/${this.maxQuestions}`);
    this.correctFont = Phaser.Utils.Array.GetRandom(fonts);
    let wrongFont = Phaser.Utils.Array.GetRandom(fonts.filter(f => f.name !== this.correctFont.name));
    if (this.fontMode === 'google') {
      loadGoogleFont(this.correctFont.name);
      loadGoogleFont(wrongFont.name);
    }
    this.sampleText.setFontFamily(this.correctFont.css);
    if (Math.random() > 0.5) {
      this.option1.setText(this.correctFont.name);
      this.option2.setText(wrongFont.name);
    } else {
      this.option1.setText(wrongFont.name);
      this.option2.setText(this.correctFont.name);
    }
  }
  checkAnswer(selected) {
    if (selected === this.correctFont.name) this.score++;
    this.loadQuestion();
  }
  endGame() {
    let elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    let modal = this.add.rectangle(400, 300, 420, 220, 0xffffff).setStrokeStyle(4, 0x000000);
    this.add.text(400, 260, `Game Over\nScore: ${this.score}\nTime: ${elapsed}s`, 
      { fontSize: '22px', fill: '#000', align: 'center' }).setOrigin(0.5);
    let btn = this.add.text(400, 350, 'Back to Settings', { fontSize: '20px', fill: '#000', backgroundColor: '#ddd', padding: { x: 10, y: 5 } })
      .setOrigin(0.5).setInteractive();
    btn.on('pointerdown', () => this.scene.start('Settings'));
    let topScore = parseInt(localStorage.getItem('topScore') || 0);
    if (this.score > topScore) {
      localStorage.setItem('topScore', this.score);
      localStorage.setItem('topTime', elapsed);
    }
  }
}

// Phaser Config
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a2a5a',
  parent: 'gameContainer',
  scene: [AboutScene, SettingsScene, GameScene]
};
new Phaser.Game(config);
