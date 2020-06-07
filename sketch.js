//Making the gameState and other variables.
var gameState = "INSTRUCTIONS";
var player , playerImg, player2;

var backgroundImg , bg2;

var bullet, bulletImg , bulletGroup , shootSound;
var zombie , zombieImg, zombieGroup , zombieSound;
var armor1,armorImg , ammoBox , ammoImg;
var bossZombie,bossImg;

var edge1,edge2,edge3,edge4;
var lifeBar ,  win;
var heliImg , helicopter;

//Giving the values.
var kills = 0;
var ammo = 50;
var zombieHealth = 450;
var timer = 120;
var life = 200;
 var zombieCount = 0;
function preload(){
   //Loading all the images.
   backgroundImg = loadImage("images/background.jpg");
   bg2 = loadImage("images/bg2.png");

   playerImg = loadImage("images/Player.png");
   player2 = loadImage("images/Player2.png");
  
   bulletImg = loadImage("images/bullet.png");
   zombieImg = loadImage("images/zombie.png");
   bossImg = loadImage("images/Boss.png");

   heliImg = loadImage("images/helicopter.png");
   armorImg = loadImage("images/armor.png"); 
   ammoImg = loadImage("images/ammo.png");
   win = loadImage("images/win.jpg");
   
   //Loading all the sounds.
   shootSound = loadSound('Gun.mp3.mp3');
   zombieSound = loadSound('zombie.mp3');
}

function setup() {
  //Creating the canvas.
  var canvas = createCanvas(displayWidth+1000, 700);
  
  //Creating the player.
  player = createSprite(150,550,20,20);
  player.scale = 0.3;
  player.setCollider("rectangle",-50,0,300,250)
  player.addImage(playerImg);
  
  //Creating the helicopter which will be invisible in PLAY state.
  helicopter = createSprite(2450,425,20,20);
  helicopter.addImage(heliImg);
  helicopter.visible = false;
  
  //Creating the boss zombie.
  bossZombie = createSprite(helicopter.x-100 , player.y-100 , 20,20 );
  bossZombie.addImage(bossImg);
  bossZombie.scale = 0.65;
  bossZombie.visible = false;

  //Creating the invisible edges.
  edge1 = createSprite(0,350,15,1000);
  edge1.visible = false;

  edge2 = createSprite(2480,350,15,1000);
  edge2.visible = false;

  edge3 = createSprite(displayWidth/2,630,displayWidth*2+1250,10);
  edge3.visible = false;
  
  //creating the armor and ammoBox to help the player.
  armor1 = createSprite(displayWidth/2+500 , 550 , 20,20);
  armor1.scale = 0.3
  armor1.addImage(armorImg);

  ammoBox = createSprite(displayWidth/2+1500 , 515,20,20);
  ammoBox.addImage(ammoImg);
  ammoBox.scale = 0.2;
  
  //Creating the groups.
  zombieGroup = createGroup();
  bulletGroup = createGroup();
}

function draw() {
  background(backgroundImg);
  
  //Making the player collide with the edges.
  player.collide(edge1);
  player.collide(edge2);
  
  //Displaying the life, kills and ammo of the player.
  textSize(22);
  fill("Blue")
  stroke("red");
  strokeWeight(2);
  textStyle(BOLD);
  textFont("Algerian");

  text ("KILLS : "+ kills , player.x , player.y - 250);
  text("Life : "+ life , player.x , player.y-150);
  text("AMMO : " + ammo , player.x , player.y - 200);

  if(gameState === "INSTRUCTIONS"){
    //Displaying the instruction of the game.
    text("Kill 50 Zombies to lure the boss zombie.You have 50 bullets to do so." , displayWidth/2,25);
    text("Once you find the boss zombie , kill it and escape with the helicopter in the given time", displayWidth/2,75);
    text("Press UP ARROW to start" , displayWidth/2,135);
    text("TIP : Aim at Zombies' head. " , displayWidth/2,110);

    //Writing a conditon to start the game.
    if(keyIsDown(UP_ARROW)){
      gameState = "PLAY";
    }
  }

  if(gameState === "PLAY"){
     //Condition to spawn the zombies.
    if(zombieCount<=60){
    spawnZombies();
    }
    //Conditions for using armor and the ammo box..
    if(player.isTouching(armor1)&& life<200){
      armor1.destroy();
      life = 200;
    }
  
    if(player.collide(ammoBox)){
      ammoBox.destroy();
      ammo+= 20;
    }
    //Destroying zombie when hit by a bullet and increasing the kill.
    if(bulletGroup.isTouching(zombieGroup)){
       zombieGroup.get(0).destroy();
       kills++;
       bulletGroup.get(0).lifetime = 0;
     }
      //Decreasing player health when in contact with zombie.
    if(zombieGroup.isTouching(player)){
       zombieGroup.get(0).velocityX = 0;
       life--;
     }
  
  //Making the player move.
  if(keyIsDown(RIGHT_ARROW)){
       changePosition(10,0);
       player.addImage(playerImg);
  }

  if(keyIsDown(LEFT_ARROW)){
      changePosition(-10,0);
  }

  if(keyIsDown(UP_ARROW)&& player.y>470){
      changePosition(0,-1);
      player.scale -=0.001;
  }

  if(keyIsDown(DOWN_ARROW)&& player.y<600){
      changePosition(0,1);
      player.scale +=0.001;
  }

  //Condition for ending the game.
  if(life === 0 || ammo === 0){
      gameState = "END";
      life = 0;
  }
  //Condition for changing the gameState to extend.
  if(player.collide(edge2) && kills >= 50){
      bulletGroup.destroyEach();
      zombieGroup.destroyEach();
      player.x = 150;
      gameState = "EXTEND";
  }
}

if(gameState === "EXTEND"){
  //Displaying the rule , time left and bossZombie health.
  fill("RED");
  stroke("BLACK");
  strokeWeight(7);
  textSize(20);

  text("KILL THE BOSS ZOMBIE & REACH THE HELICOPTER TO WIN",displayWidth/2 , 100);
  text("TIME LEFT : " + timer , player.x , player.y + 100);
  text("ZOMBIE HEALTH : "+ zombieHealth , bossZombie.x-150 , bossZombie.y - 270);
  //Making the helicopter and boss zombie visible.
  helicopter.visible = true;
  bossZombie.visible = true;
  //Giving the boss zombie a velocity.
  bossZombie.velocityX = -0.5;
  //Decreasing player health when in contact with zombie.
  if(zombieGroup.isTouching(player)){
    life--;
   }
  //Conditions for using armor and the ammo box..
  if(player.isTouching(armor1)&& life<200){
    armor1.destroy();
    life = 200;
  }

  if(player.collide(ammoBox)){
    ammoBox.destroy();
    ammo+= 20;
  }
 //decreasing zombie health when hit by a bullet.
  if(bulletGroup.isTouching(zombieGroup)){
     zombieGroup.get(0).destroy();
     kills++;
     bulletGroup.get(0).lifetime = 0;
   }
   //Making the timer work.
  if(World.frameCount%25 === 0){
   timer = timer - 1;
  }
  //Spawning zombies.
  if(World.frameCount%1 === 0){
    zombieGroup.setVelocityXEach(-7);
    spawnZombies();
  }
  //Decreasing boss zombie health when hit by bullet. 
  if(bulletGroup.isTouching(bossZombie)){
    zombieHealth-=5;
    bulletGroup.get(0).destroy();
  }
  //Destroying boss zombie when its health is 0. 
  if(zombieHealth === 0){
    zombieHealth = 0;
    bossZombie.destroy();
  }
  //Giving condition to win the game.
  if(player.isTouching(helicopter)){
     gameState = "WIN";
  }
 //Making the player move.
 if(keyIsDown(RIGHT_ARROW)){
   changePosition(10,0);
   player.addImage(playerImg);
 }

 if(keyIsDown(LEFT_ARROW)){
   changePosition(-10,0);
 }

 if(keyIsDown(UP_ARROW)&& player.y>470){
   changePosition(0,-1);
   player.scale -=0.001;
 }

 if(keyIsDown(DOWN_ARROW)&& player.y<600){
   changePosition(0,1);
   player.scale +=0.001;
 }
//Giving condition to end the game.
 if(player.isTouching(bossZombie)){
   gameState = "END";
 }
//Giving condition to end the game.
 if(life === 0 || ammo === 0 || timer ===0){
   gameState = "END";
   life = 0;
}
}

if(gameState === "WIN"){
    //Changing the background.
    background(win);
    //Destroying all the chracters.
    bossZombie.destroy();
    player.destroy();

    helicopter.destroy();
    armor1.destroy();
    ammoBox.destroy();

    bulletGroup.destroyEach();
    bulletGroup.setLifetimeEach(0);
    zombieGroup.destroyEach();

    //Pausing the sounds.
    shootSound.stop();
    zombieSound.stop();   
}

if(gameState === "END"){
  //Changing the background.
  background(bg2);
  //Destroying the characters.
  bossZombie.destroy();
  player.destroy();

  armor1.destroy();
  ammoBox.destroy(); 
  helicopter.destroy();

  zombieGroup.destroyEach();
  bulletGroup.destroyEach();

  //Pausing the sounds.
  shootSound.stop();
  zombieSound.stop();
}
  drawSprites();
}

function changePosition(x,y){
  //Function for changing player position.
  player.x = player.x+x;
  player.y  = player.y+y
}

function keyPressed(){
  if(keyCode === 32 && gameState !== "INSTRUCTIONS" && gameState !== "END" ){
    //Function for shooting a bullet when  SPACE bar is pressed and decreasing the ammo.
    shoot();
    ammo = ammo -0.5;
  }
}

function spawnZombies(){
  if(World.frameCount%85===0){
    //Spawing the zombies.
    zombie = createSprite(2470,random(480,615),20,20);
    zombie.setCollider("rectangle",0,-100,70,135);
    zombie.velocityX = -10;
    zombie.addImage(zombieImg);
    zombie.scale = random(0.35,0.4);

    zombieCount++;
    zombie.lifetime = 280;
    //Playing a sound.
    zombieSound.play(); 
    //Adding zombies to group.
    zombieGroup.add(zombie);
  }
}

function shoot(){
    //Creating the bullets.
    bullet = createSprite(player.x+35 , player.y-55 , 20,20);
    bullet.setCollider("rectangle",50,0,200,50);
    bullet.velocityX = 20;
    bullet.lifetime = 100;
    bullet.addImage(bulletImg);
    bullet.scale = 0.2;
    //Adding bullet to the group.
    bulletGroup.add(bullet);
    //Playing a sound.
    shootSound.play();
}
