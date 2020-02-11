
//################ menu.js

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function menu() {
        Phaser.Scene.call(this, {
            key: 'menu',
            active: true
        });
    },
    init() {
        this.CONFIG = this.sys.game.CONFIG;
    },
    preload: function() {
        this.load.image('titleBg', './assets/officebg.jpeg');
        this.load.bitmapFont('Click-Pixel', './assets/fonts/click.png', './assets/fonts/click.xml');
        this.load.audio('menuMusic', './assets/sound effects/menuMusic.mp3');
        this.load.audio("sndBtnOver", "./assets/sound effects/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "./assets/sound effects/sndBtnDown.wav");

        // loading bar

        let loadingBar = this.add.graphics({
            fillStyle: {
               color: 0xffffff // white duh
            }
        });

        // loading bar event

        this.load.on('progress', percentage => {
            loadingBar.fillRect(0, 690 / 2, 1150 * percentage, 50);
        });
    },
  
    create() {
        
        // sounds
        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };
  
        // Music
        this.music = this.sound.add('menuMusic', {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
  
        this.music.play();

        // Background
        this.add.image(0,0, 'titleBg').setDepth(0).setOrigin(0).setScale(0.618);
  
        // Game title
        this.add.bitmapText(
            Math.round(0.315 * 1150),
            95,
            'Click-Pixel',
            'Super Supervisor',
            64
        );
        // Click to play text
        let playBtnEasy = this.add.bitmapText(
            Math.round(0.205 * 1150),
            Math.round(0.35 * 690),
            'Click-Pixel',
            'Play Easy',
            48
        );
        let playBtnNormal = this.add.bitmapText(
            Math.round(0.41 * 1150),
            Math.round(0.35 * 690),
            'Click-Pixel',
            'Play Normal',
            48
        );
        let playBtnHard = this.add.bitmapText(
            Math.round(0.645 * 1150),
            Math.round(0.35 * 690),
            'Click-Pixel',
            'Play Hard',
            48
        );

        // instructions text
        this.add.bitmapText(
            Math.round(0.009 * 1150),
            Math.round(0.52 * 690),
            'Click-Pixel',
            `             Instructions :
            Your mission is to avoid the enemies as they come towards you.
            The longer you stay alive the more your score increases.
            Use W or the up arrow to jump.
            Use A and D or the left arrow and right arrow to move.
            Hold down SHIFT as you move to run.
            Good luck.`,
            32,
            1
        );
  
        // Make play button interactive
        
        playBtnEasy.setInteractive();

        playBtnEasy.on('pointerover', ()=>{
            this.sfx.btnOver.play();
            playBtnEasy.setScale(1.2);
            playBtnEasy.x = Math.round(0.185 * 1150);
            playBtnEasy.y = Math.round(0.34 * 690);
        });

        playBtnEasy.on('pointerout', ()=>{
            playBtnEasy.setScale(1);
            playBtnEasy.x = Math.round(0.205 * 1150);
            playBtnEasy.y = Math.round(0.35 * 690);
        });

        playBtnEasy.on('pointerdown', ()=>{
            this.sfx.btnDown.play();
        });

        playBtnEasy.on('pointerup', ()=>{
            this.music.stop();
            this.scene.start('playEasy');
        });


        playBtnNormal.setInteractive();

        playBtnNormal.on('pointerover', ()=>{
            this.sfx.btnOver.play();
            playBtnNormal.setScale(1.2);
            playBtnNormal.x = Math.round(0.39 * 1150);
            playBtnNormal.y = Math.round(0.34 * 690);
        });

        playBtnNormal.on('pointerout', ()=>{
            playBtnNormal.setScale(1);
            playBtnNormal.x = Math.round(0.41 * 1150);
            playBtnNormal.y = Math.round(0.35 * 690);
        });

        playBtnNormal.on('pointerdown', ()=>{
            this.sfx.btnDown.play();
        });

        playBtnNormal.on('pointerup', ()=>{
            this.music.stop();
            this.scene.start('playNormal');
        });


        playBtnHard.setInteractive();

        playBtnHard.on('pointerover', ()=>{
            this.sfx.btnOver.play();
            playBtnHard.setScale(1.2);
            playBtnHard.x = Math.round(0.625 * 1150);
            playBtnHard.y = Math.round(0.34 * 690);
        });

        playBtnHard.on('pointerout', ()=>{
            playBtnHard.setScale(1);
            playBtnHard.x = Math.round(0.645 * 1150);
            playBtnHard.y = Math.round(0.35 * 690);
        });

        playBtnHard.on('pointerdown', ()=>{
            this.sfx.btnDown.play();
        });

        playBtnHard.on('pointerup', ()=>{
            this.music.stop();
            this.scene.start('playHard');
        });

    }
  });
  