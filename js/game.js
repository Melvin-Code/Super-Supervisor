import menu from './menu.js';
import playEasy from './playEasy.js';
import playNormal from './playNormal.js';
import playHard from './playHard.js';
import gameover from './gameover.js';

var config = {
  type: Phaser.AUTO,
  width: 1150,
  height: 690,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: {
              y: 500
          },
          debug: false
      }
  },
  render: {
    pixelArt: true
  },

  scene: [menu, playEasy, playNormal, playHard, gameover]
};

new Phaser.Game(config);

