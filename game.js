EnemyTank = function (index, game, player, bullets) {
    var layer;
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.tank = game.add.sprite(x, y, 'RedTankBody');
    this.turret = game.add.sprite(x, y, 'RedTankHead');

    this.tank.anchor.set(0.5, 0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

  this.health -= 1;

  if (this.health <= 0)
  {
    this.alive = false;

    this.tank.kill();
    this.turret.kill();

    return true;
  }

    return false;
}

EnemyTank.prototype.update = function() {

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
    game.physics.arcade.collide(layer, this.tank);

    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var volume;

function preload() {

game.load.image('background','Phaser/assets/Grid1.png');
game.load.image('tank','Phaser/assets/GreenTankBody.png');
game.load.image('YellowBullet', 'Phaser/assets/YellowBullet.png');
game.load.image('BlueBullet', 'Phaser/assets/BlueBullet.png');
game.load.image('RedBull', 'Phaser/assets/RedBull.png');
game.load.image('GreenBullet1', 'Phaser/assets/GreenBullet1.png');
game.load.image('GreenBullet', 'Phaser/assets/GreenBullet.png');
game.load.image('GreenTankHead', 'Phaser/assets/GreenTankHead.png');
game.load.image('GreenTankBody', 'Phaser/assets/GreenTankBody.png');
game.load.image('RedTankHead', 'Phaser/assets/RedTankHead.png');
game.load.image('RedTankBody', 'Phaser/assets/RedTankBody.png');
game.load.image('BlueTankHead', 'Phaser/assets/BlueTankHead.png');
game.load.image('YellowTankBody', 'Phaser/assets/YellowTankBody.png');
game.load.image('YellowTankHead', 'Phaser/assets/YellowTankHead.png');
game.load.image('DWall', 'Phaser/assets/DestroyableWall.png');
game.load.image('Wall', 'Phaser/assets/Wall.png');
game.load.image('Floor', 'Phaser/assets/Floor.png');
game.load.image('Paused', 'Phaser/assets/paused.png');
game.load.spritesheet('kaboom', 'Phaser/assets/explosion.png', 64, 64, 23);
game.load.tilemap('tiles', 'Phaser/assets/tiles.png');
game.load.tilemap('map1', 'Phaser/assets/Level1.csv', null, Phaser.Tilemap.CSV);
game.load.audio('SuperMario', ['Phaser/assets/audio/SuperMario.mp3', 'Phaser/assets/audio/SuperMario.ogg']);
game.load.image('tiles', 'Phaser/assets/tiles.png');
game.load.tilemap('map', 'Phaser/assets/level1.json', null, Phaser.Tilemap.TILED_JSON);

}

//var land;
var tank;
var turret;
var player = tank;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var currentSpeed = 0;
var cursors;
var keyA, keyW, keyD, keyS;
var UpKey;
var LeftKey;
var RightKey;
var gKey;

var bootState;
var loadState;
var menuState;
var playState;
var winState;

var nameLabel;
var stateLabel;

var self = this;
var map;
var layer;

var bullets;
var fireRate = 100;
var nextFire = 0;
var music;
var start;
var pauseButton;

function create() {

  music = game.add.audio('SuperMario');
  music.volume = 0.05;
  music.loop = true;
  music.play();

  game.add.text(80, 80, 'Tangs',
  {font: '50px', fill: '#ffffff' });
  game.add.text(200, 300, 'press the "G" to start',
  {font: '25px Arial', fill: '#ffffff' });

  var player = tank;
  map = game.add.tilemap('map');

  var game_width = map.widthInPixels;
  var game_height = map.heightInPixels;

  var vertical_center = game_width / 2;
  var vertical_center = game_height / 2;
  game.world.setBounds(0, 0, game_width, game_height);

  map.addTilesetImage('Tiles', 'tiles');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  map.setCollision([371, 51]);

  self.layer = map.createLayer('Level_1');

  layer = map.createLayer(0);

  layer.resizeWorld();

  tank = game.add.sprite(64, 64, 'GreenTankBody');

  tank.anchor.setTo(0.5, 0.5);

  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;

  turret = game.add.sprite(0, 0, 'GreenTankHead');
  turret.anchor.setTo(0.3, 0.5);

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(100, 'RedBull');

  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  enemies = [];

  enemiesTotal = 3;
  enemiesAlive = 3;

  for (var i = 0; i < enemiesTotal; i++)
  {
      enemies.push(new EnemyTank(i, game, tank, enemyBullets));
  }

  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'GreenBullet1', 0, false);
  bullets.setAll('body.bounce.x', 1);
  bullets.setAll('body.bounce.y', 1);
  bullets.setAll('bullet.lifespan', 1);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  //  Explosion pool
  explosions = game.add.group();

  for (var i = 0; i < 10; i++)
  {
      var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
  }


  tank.bringToTop();
  turret.bringToTop();

  game.camera.follow(tank);

  keys = game.input.keyboard.createCursorKeys();
  keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
  keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
  keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
  keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
  keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
  keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
}

function update() {
  var self = this;

  game.physics.arcade.collide(tank, layer);
  game.physics.arcade.collide(bullets, layer);

  game.physics.arcade.collide(enemyBullets, layer);
  game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

  enemiesAlive = 0;

  for (var i = 0; i < enemies.length; i++)
  {
    if (enemies[i].alive)
    {
        enemiesAlive++;
        game.physics.arcade.collide(tank, enemies[i].tank);
        game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
        enemies[i].update();
    }
  }



  game.physics.arcade.collide(enemies, layer);

  if(keyM.justPressed(500)){
    if (volume == 0){
      volume = 0.05;
      music.volume = volume;
    } else {
      volume = 0;
      music.volume = volume;
    }
  }



  if(keys.left.isDown || keyA.isDown){
    tank.angle -= 4;
  }
  if(keys.right.isDown || keyD.isDown){
    tank.angle += 4;
  }
  if(keys.up.isDown || keyW.isDown){
    currentSpeed = 100;
  }
  if(keys.down.isDown || keyS.isDown){
    currentSpeed = 0;
  }

  game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);

  turret.x = tank.x;
  turret.y = tank.y;

  turret.rotation = game.physics.arcade.angleToPointer(turret);

  if (game.input.activePointer.isDown)
  {
    fire();
  }

}

function bulletHitWall (bullet, layer) {
  bullet.kill();
}

function bulletHitPlayer (tank, bullet) {
  bullet.kill();
}

function bulletHitEnemy (tank, bullet) {

  bullet.kill();

  var destroyed = enemies[tank.name].damage();

  if (destroyed){

      var explosionAnimation = explosions.getFirstExists(false);
      explosionAnimation.reset(tank.x, tank.y);
      explosionAnimation.play('kaboom', 30, false, true);
  }

}

function fire () {

  if (game.time.now > nextFire && bullets.countDead() > 0) {
    nextFire = game.time.now + fireRate;

    var bullet = bullets.getFirstExists(false);

    bullet.reset(turret.x, turret.y);

    bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 0);

}

}

function render() {

  game.debug.soundInfo(music, 300, 20);

  game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 645, 20);
  game.debug.cameraInfo(game.camera, 20, 20);
  game.debug.spriteCoords(tank, 440, 550);

}
