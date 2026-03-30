export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');

        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 200, 'logo');

        const ship = this.add.sprite(640, 360, 'ship');

        ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        ship.play('fly');

        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
        
        this.add.text(640, 600, 'CLICK TO START EDITOR', { 
            fontSize: '32px', 
            fill: '#fff',
            backgroundColor: '#000' 
        }).setOrigin(0.5);

        // 画面全体をクリック可能にし、クリックされたら MapEditor シーンへ移動
        this.input.once('pointerdown', () => {
            this.scene.start('MapEditor');
        });
    }

    update() {
        this.background.tilePositionX += 2;
    }
    
}
