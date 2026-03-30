export class MapEditor extends Phaser.Scene {
    constructor() {
        super('MapEditor');
        this.mapData = []; // 0: 床, 1: 壁
        this.gridSize = 40;
        this.cols = 10;
        this.rows = 10;
    }

    create() {
        for (let y = 0; y < this.rows; y++) {
            this.mapData[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this.mapData[y][x] = 0;
                const cell = this.add.rectangle(x * this.gridSize + 100, y * this.gridSize + 100, this.gridSize - 2, this.gridSize - 2, 0x666666)
                    .setInteractive();

                cell.on('pointerdown', () => {
                    if (this.mapData[y][x] === 0) {
                        this.mapData[y][x] = 1;
                        cell.setFillStyle(0xff0000); // 壁は赤
                    } else {
                        this.mapData[y][x] = 0;
                        cell.setFillStyle(0x666666); // 床はグレー
                    }
                });
            }
        }

        // 決定ボタン
        const startBtn = this.add.text(600, 500, 'マップを確定して開始', { fontSize: '32px', backgroundColor: '#222' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('PlayScene', { map: this.mapData });
            });
    }
}