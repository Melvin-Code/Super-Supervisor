/* jshint esversion:9 */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
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

var map;
var player;
var cursors;
var enemies;
var groundLayer, coinLayer;
var text;
var score = 0;
let enemyCount = 0;
var health = 100;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player1.png', 'assets/player.json');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('shot', 'assets/bullet.png');
}


function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // coin image used as tileset
    var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player').setScale(1.5);
    player.setBounce(0.1); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width - 64, player.height - 40);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);

    coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    this.physics.add.overlap(player, coinLayer);


    //enemies
    enemies = this.physics.add.group();
    this.physics.add.collider(groundLayer, enemies);

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


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    healthBar = this.add.text(20, 20, health, {
        fontSize: '30px',
        fontWeight: '500',
        fill: '#154515'
    });

    healthBar.setScrollFactor(0);


    ///////////////////////////////////////////////////////////////////////
    //Spawning enemies

    
    setInterval(()=>{   
        if(enemyCount < 10){     
            var x = Phaser.Math.Between(400, 800);
            var enemy = enemies.create(x, 450, 'enemy').setScale(0.3).setImmovable();
            enemy.setBounce(0.6);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-400, 400), 100);
            enemy.allowGravity = true;
            enemyCount++;
        }
    }, 1000);
    
    

    this.physics.add.collider(player, enemies, damage, null, this);


    //////////////////////////////////////////////////////////////////
    //SHOOTING

    // Create the group using the group factory
	shots = this.physics.add.group();
	// To move the sprites later on, we have to enable the body
	shots.enableBody = true;
	// We're going to set the body type to the ARCADE physics, since we don't need any advanced physics
	shots.physicsBodyType = Phaser.Physics.ARCADE;
	/*
 
		This will create 20 sprites and add it to the stage. They're inactive and invisible, but they're there for later use.
		We only have 20 shot bullets available, and will 'clean' and reset they're off the screen.
		This way we save on precious resources by not constantly adding & removing new sprites to the stage
 
	*/
	shots.createMultiple(20, 'shot');
 
	/*
 
		Behind the scenes, this will call the following function on all shots:
			- events.onOutOfBounds.add(resetshot)
		Every sprite has an 'events' property, where you can add callbacks to specific events.
		Instead of looping over every sprite in the group manually, this function will do it for us.
 
	*/
	//shots.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetshot);
	// Same as above, set the anchor of every sprite to 0.5, 1.0
	//shots.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
 
	// This will set 'checkWorldBounds' to true on all sprites in the group
	//shots.setAll('checkWorldBounds', true);
 
	// ...
 
}
 
function resetshot(shot) {
	// Destroy the shot
	shot.kill();
}







////////////////////////////////////////////


// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

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
    healthBar.setText(health);
}


 
function touchDown() {
	// Set touchDown to true, so we only trigger this once
	mouseTouchDown = true;
	fireshot();
}
 
function touchUp() {
	// Set touchDown to false, so we can trigger touchDown on the next click
	mouseTouchDown = false;
}
 
function fireshot() {
	// Get the first shot that's inactive, by passing 'false' as a parameter
	var shot = shots.getFirstExists(false);
	if (shot) {
		// If we have a shot, set it to the starting position
		shot.reset(ship.x, ship.y - 20);
		// Give it a velocity of -500 so it starts shooting
		shot.body.velocity.y = -500;
	}
 
}


function update(time, delta) {

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
        player.flipX = false; // use the original sprite looking to the right
    } else if(player.body.onFloor()) {
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