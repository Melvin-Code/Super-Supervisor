// ############ play.js

import {score} from './globals.js';

//You can access the globals via the imported file,  all scenes would be using the same instance of the globals

let map, player, office, startingTime, currentTime, hurt, jump;
let enemyArr = [];
var health = 100;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function play() {
      Phaser.Scene.call(this, {
          key: 'playHard',
          active: false
      });
  },
  ///////////


    preload() {
        //IMAGES
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '../assets/officeMap.json');

        // enemies spritesheet 
        this.load.atlas('enemy', '../assets/enemy.png', '../assets/player.json');

        // tiles for map
        this.load.image('terrainPNG', '../assets/Office_furniture_set.png');

        // player animations
        this.load.atlas('player', '../assets/player1.png', '../assets/player.json');
        this.load.image('bullet', '../assets/bullet.png');
        // SOUNDS
        // player hurt sound
        this.load.audio('hurtSnd', '../assets/sound effects/Player_hurt.ogg');
        this.load.audio('jumpSnd', '../assets/sound effects/Player_jump.ogg');
        this.load.audio('musicSnd', '../assets/sound effects/soundtrack.mp3');

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

        ////////////////////////////////////////////////////////////////
        //IMPORTANT VARIABLES AND PHYSICS

        this.cursors = this.input.keyboard.createCursorKeys();

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        // sounds
        hurt = this.sound.add('hurtSnd');
        jump = this.sound.add('jumpSnd');

        this.music = this.sound.add('musicSnd', {
            mute: false,
            volume: 0.75,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });

        this.music.play();

        //Starting time
        startingTime = new Date().getTime();

        // load the map 
        map = this.make.tilemap({
            key: 'map'
        });

        // tiles for the ground layer
        office = map.addTilesetImage('test', 'terrainPNG');
        map.createDynamicLayer('default2', office, 0, 0).setScale(2.9);
        map.createStaticLayer('default', office, 0, 0).setScale(2.9);

        // set the boundaries of our game world
        this.physics.world.bounds.width = 1150;
        this.physics.world.bounds.height = 600;

        // create the player sprite    
        player = this.physics.add.sprite(200, 400, 'player', 64, 64);
        player.setBounce(0.1); // our player will bounce from items
        player.setCollideWorldBounds(true); // don't go out of the map    
        // small fix to our player images, we resize the physics body object slightly
        player.body.setSize(32, 45);
        player.setScale(2);
        player.body.immovable = true;
        // player will collide with the level tiles 
        this.physics.add.collider(map, player);
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(player);

        //bullet group
        // bullets = this.physics.add.group();

        //////////////////////////////////////////////////



        //////////////////////////////////////////////////
        //ANIMATIONS

        // player walk animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'p1_walk',
                start: 1,
                end: 9,
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        // player idle animation
        this.anims.create({
            key: 'idle',
            frames: [{
                key: 'player',
                frame: 'p1_stand'
            }],
            frameRate: 10,
        });
        // player jumping animation
        this.anims.create({
            key: 'jump',
            frames: [{
                key: 'player',
                frame: 'p1_jump'
            }],
            frameRate: 10,
        });
        // player shooting animation
        this.anims.create({
            key: 'shoot',
            frames: [{
                key: 'player',
                frame: 'p1_shoot'
            }],
            frameRate: 10,

        });
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
            repeat: -1
        });


        // enemy walking animation
        this.anims.create({
            key: 'walkEnemy',
            frames: this.anims.generateFrameNames('enemy', {
                prefix: 'p1_walk',
                start: 1,
                end: 9,
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: -1
        });

        //////////////////////////////////////////////////


        //////////////////////////////////////////////////
        //SCORE

        this.scoreText = this.add.text(20, 60, 'Score: ', {
            fontSize: '35px',
            fill: '#fff',
            backgroundColor: '#000'
        });
        this.scoreNumber = this.add.text(145, 60, score.value, {
            fontSize: '35px',
            fill: '#fff',
            backgroundColor: '#000'
        });
        // fix the text to the camera
        this.scoreNumber.setScrollFactor(0);

        //////////////////////////////////////////////////


        //////////////////////////////////////////////////
        //HEALTH

        this.healthNumber = this.add.text(165, 20, health, {
            fontSize: '35px',
            fontWeight: '500',
            backgroundColor: '#000'
        }).setDepth(1);

        this.healthText = this.add.text(20, 20, 'Health:  ', {
            fontSize: '35px',
            fontWeight: '500',
            backgroundColor: '#000'
        }).setDepth(0);

        this.healthNumber.setScrollFactor(0);

        //////////////////////////////////////////////////


        //////////////////////////////////////////////////
        //ENEMY SPAWNING

        this.enemy = this.physics.add.group();

        setInterval(() => {
            if (enemyArr.length <= 7) {
                var x = Phaser.Math.Between(650, 1050);
                this.enemy = this.physics.add.sprite(x, 0, 'enemy');
                this.enemy.setVelocity(Phaser.Math.Between(-600, -200), 200);
            }
            this.physics.world.bounds.width = office.width;
            this.physics.world.bounds.height = 600;

            this.enemy.body.setSize(32, 45);
            this.enemy.setScale(2);
            this.enemy.setBounce(0.6);
            this.enemy.setCollideWorldBounds(true);
            this.enemy.body.immovable = true;

            this.enemy.allowGravity = true;
            enemyArr.push(this.enemy);

            this.physics.add.collider(player, this.enemy, this.damage, null, this);

            enemyArr.forEach((enem, i) => {

                if (enem.body.position.x > 1150) {
                    enemyArr.splice(i, 1);
                    enem.disableBody(true, true);

                }
            });

        }, 1000);


        //////////////////////////////////////////////////  

  },
  update(time, delta) {

      //////////////////////////////////////////////////
      //SCORE

      currentTime = new Date().getTime();
      score.value += Math.floor(Math.floor((currentTime - startingTime)) / 2000);
      score.value = Math.floor(score.value / 1.2);
      this.add.text(165, 60, score.value, {
          fontSize: '35px',
          fill: '#fff',
          backgroundColor: '#000'
      });

      //////////////////////////////////////////////////


      //////////////////////////////////////////////////
      //HEALTH NUMBER AND GAME OVER

      if (health > 70) {
          this.healthNumber.setFill('#0f0');
      }

      if (health > 30 && health <= 70) {
          this.healthNumber.setFill('#ff0');
      }

      if (health <= 30) {
          this.healthNumber.setFill('#f00');
      }

      if(health <= 0){
          this.music.stop();
          this.scene.remove('playHard');
          this.scene.start('gameover');
      }
    
      //////////////////////////////////////////////////


      //////////////////////////////////////////////////
      //ENEMY SPRITE ANIMATION

      enemyArr.forEach(i => {
          if (i.body.velocity.x < 0) {
              i.anims.play('walkEnemy', true); // walk left
              i.flipX = true;
          } else if (i.body.velocity.x > 0) {
              i.anims.play('walkEnemy', true);
              i.flipX = false;
          }
      });

      //////////////////////////////////////////////////


      //////////////////////////////////////////////////
      //PLAYER MOVEMENT AND JUMPING

      //player running
      if (this.cursors.left.isDown && this.cursors.shift.isDown || this.keyboard.A.isDown && this.cursors.shift.isDown) {
        player.body.setVelocityX(-350);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
      } else if (this.cursors.right.isDown && this.cursors.shift.isDown || this.keyboard.D.isDown && this.cursors.shift.isDown) {
        player.body.setVelocityX(350);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
        if (player.body.x > 1100) {
            player.body.setVelocity(0);

        }
    }

     // player walking
     else if (this.cursors.left.isDown || this.keyboard.A.isDown) {
          player.body.setVelocityX(-200);
          player.anims.play('walk', true); // walk left
          player.flipX = true; // flip the sprite to the left
      } else if (this.cursors.right.isDown || this.keyboard.D.isDown) {
          player.body.setVelocityX(200);
          player.anims.play('walk', true);
          player.flipX = false; // use the original sprite looking to the right
          if (player.body.x > 1100) {
              player.body.setVelocity(0);

          }
      }

      //player idle
      else if (player.body.onFloor()) {
          player.body.setVelocityX(0);
          player.anims.play('idle', true);
      }

       // jump 
      if (this.cursors.up.isDown && player.body.onFloor() || this.keyboard.W.isDown && player.body.onFloor()) {
          player.anims.play('jump', true);
          player.body.setVelocityY(-450);
      } else if (!player.body.onFloor() && player.y < 500) {
          player.anims.play('jump', true);
      }
      if (player.body.x >= 1100) {
          player.body.x = 1100;
      }
      if (player.body.x >= 1100) {
          player.body.x = 1100;
      }

    //   if (this.cursors.space.isDown) {
    //       player.anims.play('shoot', true);
    //       if (bulletArr < 1) {
    //           if (player.flipX == false) {
    //               bullet = bullets.create(player.body.x, player.body.y + 20, 'bullet', 64, 64);
    //               bullet.body.setVelocity(1000, 0);
    //               bulletArr.push(bullet);
    //               bullet.body.gravity.y = -400;
    //               bullet.setBounce(0.1); // our bullet will bounce from items
    //               bullet.setCollideWorldBounds(true); // don't go out of the map    
    //               // small fix to our bullet images, we resize the physics body object slightly
    //               bullet.body.setSize(32, 45);
    //               bullet.setScale(0.03);

    //           } else if (player.flipX == true) {
    //               bullet = bullets.create(player.body.x, player.body.y + 20, 'bullet', 64, 64);
    //               bullet.body.setVelocity(-1000, 0);
    //               bulletArr.push(bullet);
    //               bullet.body.gravity.y = -400;
    //               bullet.setBounce(0.1); // our bullet will bounce from items
    //               bullet.setCollideWorldBounds(true); // don't go out of the map    
    //               // small fix to our bullet images, we resize the physics body object slightly
    //               bullet.body.setSize(32, 45);
    //               bullet.setScale(0.03);

    //           }


    //           console.log(bulletArr);
    //       }
    //       bulletArr.forEach((bullet, i) => {

    //           if (bullet.body.position.x > 1150) {
    //               bulletArr.splice(i, 1);
    //               bullet.disableBody(true, true);

    //           }
    //       });
    //       bulletArr.forEach((bullet, i) => {
    //           console.log(bullet.body.position.x, i);
    //           if (bullet.body.position.x < 10) {
    //               bulletArr.splice(i, 1);
    //               bullet.disableBody(true, true);

    //           }
    //       });

          //////////////////////////////////////////////////
     // }
  },

  damage() {
      player.y -= 10;
      hurt.play();
      player.setTint(0xff0000);
      setTimeout(() => {
          player.setTint();
      }, 100);

      player.anims.play('turn');

      health -= 5;
      this.healthNumber.setText(health);
  }
});

///////////////////////////////////////