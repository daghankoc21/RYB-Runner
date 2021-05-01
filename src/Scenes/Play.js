class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        
        //loading the assets   

        //this.load.image('lane1', './assets/lane.png');
        this.load.image('tiles', './assets/rybSpriteSheet.png');
        this.load.tilemapTiledJSON('map', './assets/testmap_2.json');

        this.load.image('UI_circle','./assets/UI_circle.png');
        this.load.image('UI_circle_outline','./assets/UI_circle_outline.png');
    
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue,3 = yellow 
        this.load.spritesheet('player', "./assets/arrowRYB.png",{
            frameWidth: 112,
            frameHeight: 167,
            });
    }
    create() {
        
        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //setting the background color to dark grey
        this.cameras.main.setBackgroundColor('#333333');
        
        //background testing
        //const map = this.make.tilemap({key: 'map'});
        //const tileset = map.addTilesetImage('base', 'tiles');
        // const belowlayer = map.createLayer('Tile Layer 1', tileset, screenCenterX - (tilemapScale * 300), 50);
        // const abovelayer = map.createLayer('Tile Layer 2', tileset, screenCenterX - (tilemapScale * 300), 50);
        // abovelayer.scale = tilemapScale;
        // belowlayer.scale = tilemapScale;
        //console.log(belowlayer);

        //background testing 2
        // let map = this.add.tilemap('map');
        // let visuals = map.addTilesetImage('base', 'tiles');
        // let botLayer = map.createLayer('Tile Layer 1', [visuals], screenCenterX - (tilemapScale * 300), 0);
        // let topLayer = map.createLayer('Tile Layer 2', [visuals], screenCenterX - (tilemapScale * 300), 0);
        // botLayer.scale = tilemapScale;
        // topLayer.scale = tilemapScale;

        //current background
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('base', 'tiles');
        this.botLayer = this.map.createLayer('Tile Layer 1', this.map.tilesets, screenCenterX - (tilemapScale * 300), 0);
        this.topLayer = this.map.createLayer('Tile Layer 2', this.map.tilesets, screenCenterX - (tilemapScale * 300), 0);
        this.botLayer.scale = tilemapScale;
        this.topLayer.scale = tilemapScale;


        // placing the assets
        playerShip = this.add.sprite(screenCenterX, arrowY, 'player').setOrigin(0.5,0.5);
        playerShip.scale = arrowScale;


        //setting the player to color red for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 

       

        //rendering the ship above the lane
        playerShip.setDepth('1');    

        
        //creating a bottom UI bar for the color indicator
        this.circleOutline = this.add.sprite(screenCenterX - (arrowDist/2), 936, 'UI_circle_outline').setOrigin(0.5, 0.5);
        this.circleOutline.setDepth('2');

        //this.add.rectangle(0, screenCenterY * 1.9,screenCenterX * 2 , screenCenterY / 3, "0xffffff").setOrigin(0.5, 0.5);
        this.redCircle = this.add.sprite(screenCenterX - (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.redCircle.setTint("0xCF1313");
        this.redCircle.setDepth('1');
        
        this.yellowCircle = this.add.sprite(screenCenterX, 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.yellowCircle.setTint("0xeed456");
        this.yellowCircle.setDepth('1');

        this.blueCircle = this.add.sprite(screenCenterX + (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.blueCircle.setTint("0x1181D9");
        this.blueCircle.setDepth('1');

        
        
 
    }
    update(){


        //Color changing with the spacebar key
        if(Phaser.Input.Keyboard.JustDown(spaceBar)){
            
           
            if (playerShip.currentFrame == 0)
            {
                console.log("Color switched to yellow");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(1);
                playerShip.currentFrame = 1;
                this.circleOutline.setPosition(screenCenterX, 936);
            } else if (playerShip.currentFrame == 1)
            {
                console.log("Color switched to blue");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(2);
                playerShip.currentFrame = 2;
                this.circleOutline.setPosition(screenCenterX + (arrowDist/2), 935);
            } else if(playerShip.currentFrame == 2)
            {
                console.log("Color switched to red");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(0);
                playerShip.currentFrame = 0;
                this.circleOutline.setPosition(screenCenterX - (arrowDist/2), 935);
            }
            
        }

        //Tween movement to right lane with right arrow key 
        if(Phaser.Input.Keyboard.JustDown(keyRight) && currentLane < 2){
            this.add.tween({
                targets: playerShip,
                x : arrowMovementR,
                duration: 200,
                ease: 'Cubic',
                //onStart: function () {recenter(currentLane)},
                onComplete: function () {recenter(currentLane)},
            })
            currentLane ++;
        }
        //Tween movement to left lane with left arrow key
        if(Phaser.Input.Keyboard.JustDown(keyLeft) && currentLane > 0){
            this.add.tween({
                targets: playerShip,
                x : arrowMovementL,
                duration: 200,
                ease: 'Cubic',
                //onStart: function () {recenter(currentLane)},
                onComplete: function () {recenter(currentLane)},
            })
            currentLane --;
        }



        function recenter(lane) {
            switch(lane) {
                case 0:
                    playerShip.setPosition(screenCenterX - arrowDist, arrowY);
                    break;
                case 1:
                    playerShip.setPosition(screenCenterX, arrowY);
                    break;
                case 2:
                    playerShip.setPosition(screenCenterX + arrowDist, arrowY);
            }

        }
    

        //code here for sliding the background, or I guess we gotta make the ship move smh.
    }

}