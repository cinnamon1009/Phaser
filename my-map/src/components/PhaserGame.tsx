import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';

interface Props {
  selectedTile: number;
}

const PhaserGame = forwardRef((props: Props, ref) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      parent: gameRef.current || undefined,
      backgroundColor: '#222',
      scene: {
        create: function(this: Phaser.Scene) {
          const mapData: number[][] = [];
          const gridSize = 40;
          
          for (let y = 0; y < 10; y++) {
            mapData[y] = [];
            for (let x = 0; x < 15; x++) {
              mapData[y][x] = 0;
              const cell = this.add.rectangle(x * gridSize + 2, x * gridSize + 2, gridSize - 2, gridSize - 2, 0x666666)
                .setInteractive()
                .setOrigin(0);

              // 座標を計算して配置
              cell.setPosition(x * gridSize, y * gridSize);

              cell.on('pointerdown', () => {
                // gameオブジェクトにカスタムプロパティとして持たせた値を使う
                const currentType = (this.game as any).selectedTileType;
                mapData[y][x] = currentType;
                cell.setFillStyle(currentType === 1 ? 0xff0000 : 0x666666);
                console.log(`Clicked at ${x},${y} - Tile Type: ${currentType}`);
              });
            }
          }
          // シーンにデータを保持
          (this as any).mapData = mapData;
        }
      }
    };

    const game = new Phaser.Game(config);
    phaserInstance.current = game;
    (game as any).selectedTileType = props.selectedTile;

    if (ref) (ref as any).current = game;

    return () => {
      game.destroy(true);
      phaserInstance.current = null;
    };
  }, []);

  // ReactのStateが変わったらPhaser内の変数も更新する
  useEffect(() => {
    if (phaserInstance.current) {
      (phaserInstance.current as any).selectedTileType = props.selectedTile;
    }
  }, [props.selectedTile]);

  return <div ref={gameRef} style={{ width: '600px', height: '400px' }} />;
});

export default PhaserGame;