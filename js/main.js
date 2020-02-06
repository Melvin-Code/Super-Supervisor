/* jshint esversion:9 */
var config = {
    type: Phaser.AUTO,
    width: 1150,
    height: 690,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: true
        }
    },
    
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
let map, player, cursors, enemies, office, coinLayer, text, startingTime, currentTime;
let enemyArr = [];
var score = 0;
var health = 100;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/officeMap.json');
    // enemies in spritesheet 
    this.load.spritesheet('enemyRight', 'assets/enemyright.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemyLeft', 'assets/enemyleft.png', {frameWidth: 32, frameHeight: 32});
    this.load.atlas('enemy', 'assets/enemy.png', 'assets/player.json');
    // tiles for map
    this.load.image('terrainPNG', 'assets/Office_furniture_set.png');
    // player animations
    this.load.atlas('player', 'assets/player1.png', 'assets/player.json');
    this.load.image('shot', 'assets/bullet.png');
    
}


function create() {

    //Starting time
    startingTime = new Date().getTime();

    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var office = map.addTilesetImage('test','terrainPNG');
         map.createDynamicLayer('default2', office, 0, 0).setScale(2.9);
            map.createStaticLayer('default', office, 0, 0).setScale(2.9);
    // create the ground layer
    // groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
   

    // coin image used as tileset
    // var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    // coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = 1150;
    this.physics.world.bounds.height = 600 ;
    
    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player', 64, 64);
    player.setBounce(0.1); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // this.physics.player.world.bounds.width =  1000
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(32, 45);
    player.setScale(2);
    // player.body.setOrigin(0,0)
    // player will collide with the level tiles 
    this.physics.add.collider(map, player);

    // coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    // this.physics.add.overlap(player, coinLayer);


    //enemies
    enemy = this.physics.add.group();
   
    //////////////////////////////////////////////////////////////////////////////////////////
    //ANIMATIONS


    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 9, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });
    this.anims.create({
        key: 'jump',
        frames: [{key: 'player', frame: 'p1_jump'}],
        frameRate: 10,
    });
    
    
    //enemy walking
    

    this.anims.create({
        key: 'walkEnemy',
        frames: this.anims.generateFrameNames('enemy', {prefix: 'p1_walk', start: 1, end: 9, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });

    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('enemyLeft'),
    //     frameRate: 10,
    //     repeat: -1
    // });
    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('enemyRight'),
    //     frameRate: 1,
    //     repeat: -1
    // });


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);


    ///////////////////////////////////////////////////////
    //SCORE

    //timedEvent = this.time.delayedCall(3000, onEvent, [], this);

    scoreText = this.add.text(20, 60, 'Score: ', {
        fontSize: '35px',
        fill: '#fff',
        backgroundColor: '#000'
    });
    text = this.add.text(140, 60, score, {
        fontSize: '35px',
        fill: '#fff',
        backgroundColor: '#000'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
    
    
    /////////////////////////////////////////////////////
    //HEALTH

    healthNumber = this.add.text(160, 20, health, {
        fontSize: '35px',
        fontWeight: '500',
        backgroundColor: '#000'
    });

    healthText = this.add.text(20, 20, 'Health: ', {
        fontSize: '35px',
        fontWeight: '500',
        backgroundColor: '#000'
    });


    healthNumber.setScrollFactor(0);


    ///////////////////////////////////////////////////////////////////////
    //Spawning enemies
    
    setInterval(()=>{   
        if(enemyArr.length < 10){     
            this.physics.world.bounds.width = office.width;
            this.physics.world.bounds.height = 600;
            var x = Phaser.Math.Between(400, 800);
            var enemy = this.physics.add.sprite(x, 0, 'enemyLeft');
            enemy.body.setSize(32,45);
            enemy.setScale(2);
            enemy.setBounce(0.6);
            enemy.setCollideWorldBounds(true);
            
            enemy.setVelocity(Phaser.Math.Between(-400, 400), 100);
            enemy.allowGravity = true;
            this.physics.add.collider(player, enemy, damage, null, this) ;
            enemyArr.push(enemy);
        }
    }, 2000);
    
    

    this.physics.add.collider(player, enemy, damage, null, this);


    //////////////////////////////////////////////////////////////////
    //SHOOTING

    //lol nvm
 
}

// function resetshot(shot) {
// 	// Destroy the shot
// 	shot.kill();
// }


////////////////////////////////////////////


// // this function will be called when the player touches a coin
// function collectCoin(sprite, tile) {
//     coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
//     score++; // add 10 points to the score
//     text.setText(score); // set the text to show the current score
//     return false;
// }


function damage(){
    player.y -= 10;

    if(health <= 0) {
        //this.physics.pause();
    }

    player.setTint(0xff0000);
    setTimeout(()=>{
        player.setTint();
    }, 100);

    player.anims.play('turn');

    health -= 3;
    healthNumber.setText(health);
}

//////////////////////////////////////////////////
//SHOOTING
 
// function touchDown() {
// 	// Set touchDown to true, so we only trigger this once
// 	mouseTouchDown = true;
// 	fireshot();
// }
 
// function touchUp() {
// 	// Set touchDown to false, so we can trigger touchDown on the next click
// 	mouseTouchDown = false;
// }
 
// function fireshot() {
// 	// Get the first shot that's inactive, by passing 'false' as a parameter
// 	var shot = shots.getFirstExists(false);
// 	if (shot) {
// 		// If we have a shot, set it to the starting position
// 		shot.reset(ship.x, ship.y - 20);
// 		// Give it a velocity of -500 so it starts shooting
// 		shot.body.velocity.y = -500;
// 	}
// }

function addScore(){
    const startTime = new Date();
    console.log(startTime.getTime());
}


function update(time, delta) {

///////////////////////////////////////////////////
//SCORE

currentTime = new Date().getTime();
score += Math.floor(Math.floor((currentTime - startingTime)) / 2000);

text = this.add.text(140, 60, score, {
    fontSize: '35px',
    fill: '#fff',
    backgroundColor: '#000'
});
///////////////////////////////////////////////////
//SHOOTING


	// Game.input.activePointer is either the first finger touched, or the mouse
	// if (game.input.activePointer.isDown) {
	// 	// We'll manually keep track if the pointer wasn't already down
	// 	if (!pointer.isDown) {
	// 		touchDown();
	// 	}
	// } else {
	// 	if (pointer.isDown) {
	// 		touchUp();
	// 	}
    // }
     

if(health > 70){
    healthNumber.setFill('#0f0');
}

if(health > 30 && health <= 70){
    healthNumber.setFill('#ff0');
}

if(health <= 30){
    healthNumber.setFill('#f00');
}
if(health < 0){
    this.gameOver();
}


////////////////////////////////////////////////
//ENEMY SPRITE CHANGE

enemyArr.forEach(i => {
    if(i.body.velocity.x < 0){
        i.anims.play('walkEnemy', true); // walk left
        i.flipX = true;
    }
    else if(i.body.velocity.x > 0){
        i.anims.play('walkEnemy', true);
        i.flipX = false;
    }
    else {
        console.log('no');
    }
});

////////////////////////////////////////////////
//MOVEMENT AND JUMPING

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
       if (player.body.x >= 1100) {
        //    player.setPosition(1100, player.body.y)
           player.body.setVelocity(0)
        //    player.flipX = true; 
           //cursors.right.isDown = false

        }
        player.flipX = false; // use the original sprite looking to the right
    }
    else if (player.body.onFloor()) {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.anims.play('jump', true);
        player.body.setVelocityY(-500);        
    }
    else if (!player.body.onFloor())
    {
        player.anims.play('jump', true);
    }
}