//TEMPORARY TEST TO BE REPLACED BY GAMEOVER THIS IS MENU
import {score} from './globals.js';
export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function menu() {
        Phaser.Scene.call(this, {
            key: 'gameover',
            active: false
        });
    },
    init() {
        this.CONFIG = this.sys.game.CONFIG;
    },
    preload: function() {
        this.load.bitmapFont('Click-Pixel', 'assets/fonts/click.png', 'assets/fonts/click.xml');
        this.load.audio('menuMusic', '../assets/sound effects/menuMusic.mp3');
        this.load.image('fired', '../assets/fired.png');
        this.load.audio("sndBtnOver", "./assets/sound effects/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "./assets/sound effects/sndBtnDown.wav");
        this.load.atlas('player', '../assets/player1.png', '../assets/player.json');
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
        this.add.image(50,50,'fired').setDepth(1).setOrigin(0).setScale(0.25);
  
        // Game Over title
        this.add.bitmapText(
            Math.round(0.4 * 1150),
            Math.round(0.23 * 690),
            'Click-Pixel',
            'Game Over',
            64
        );
        // Click to play text
        let restartButton = this.add.bitmapText(
            Math.round(0.295 * 1150),
            Math.round(0.47 * 690),
            'Click-Pixel',
            'click to go to main menu',
            48
        );

        // Score text
        this.add.bitmapText(
            Math.round(0.36 * 1150),
            Math.round(0.68 * 690),
            'Click-Pixel',
            `Your score was: ${score.value}`,
            48
        );
        
        // player falling
        let player = this.add.sprite(200, 400, 'player', 64, 64);
        player.setScale(2);
        player.setDepth(1);
        player.setVisible(false);

        //player dying animation
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'p1_fall',
                start: 1,
                end: 6,
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: 0
        });

  
        // Make play button interactive
        
        restartButton.setInteractive();

        restartButton.on('pointerover', ()=>{
            player.setVisible(true);
            player.x = 245;
            player.y = 325;
            player.play('fall', false);
            this.sfx.btnOver.play();
            restartButton.setScale(1.2);
            restartButton.x = Math.round(0.245 * 1150);
            restartButton.y = Math.round(0.46 * 690);
        });

        restartButton.on('pointerout', ()=>{
            player.setVisible(false);
            restartButton.setScale(1);
            restartButton.x = Math.round(0.295 * 1150);
            restartButton.y = Math.round(0.47 * 690);
        });

        restartButton.on('pointerdown', ()=>{
            this.sfx.btnDown.play();
        });

        restartButton.on('pointerup', ()=>{
            location.reload();
        });
    }
  });
  