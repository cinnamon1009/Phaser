export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    init(data) {
        // MapEditorから渡されたマップデータを受け取る
        this.mapData = data.map || [];
        this.gridSize = 40;
    }

    create() {
        this.add.text(20, 20, 'Play Scene: Arrow Keys to Move', { fontSize: '20px', fill: '#fff' });
        this.walls = this.physics.add.staticGroup();

        // マップデータに基づいて壁を配置
        if (this.mapData.length > 0) {
            for (let y = 0; y < this.mapData.length; y++) {
                for (let x = 0; x < this.mapData[y].length; x++) {
                    if (this.mapData[y][x] === 1) {
                        const wall = this.add.rectangle(x * this.gridSize + 100, y * this.gridSize + 100, this.gridSize, this.gridSize, 0xff0000);
                        this.walls.add(wall);
                    }
                }
            }
        }

        this.player = this.physics.add.sprite(150, 150, 'ship').setScale(0.5);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.walls);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 200;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }
}