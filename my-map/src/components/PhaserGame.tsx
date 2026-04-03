import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { TileDef, CharacterDef, PlacedCharacter } from '../types';

interface Props {
  selectedTile: number;
  tiles: TileDef[];
  mode: 'tile' | 'char';
  selectedCharId: string | null;
  characters: CharacterDef[];
}

class EditorScene extends Phaser.Scene {
  public mapData: number[][] = [];
  public gridItems: (Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image)[][] = [];
  public charSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private dialogueText?: Phaser.GameObjects.Text;
  private dialogueBg?: Phaser.GameObjects.Rectangle;

  create() {
    const gridSize = 40;
    this.dialogueBg = this.add.rectangle(300, 350, 500, 60, 0x000000, 0.8).setDepth(100).setVisible(false);
    this.dialogueText = this.add.text(70, 330, '', { fontSize: '16px', wordWrap: { width: 460 } }).setDepth(101).setVisible(false);

    for (let y = 0; y < 10; y++) {
      this.mapData[y] = [];
      this.gridItems[y] = [];
      for (let x = 0; x < 15; x++) {
        this.mapData[y][x] = 0;
        const cell = this.add.rectangle(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2, 0x666666)
          .setOrigin(0).setInteractive();
        this.gridItems[y][x] = cell;
        cell.on('pointerdown', () => this.handleGridClick(x, y));
      }
    }
  }

  handleGridClick(x: number, y: number) {
    const game = this.game as MyGame;
    if (game.editMode === 'tile') {
      this.updateTile(x, y);
    } else {
      this.placeCharacter(x, y);
    }
  }

  updateTile(x: number, y: number) {
    const customGame = this.game as MyGame;
    const currentId = customGame.selectedTileType;
    const gridSize = 40;
    const targetId = currentId === -1 ? 0 : currentId;
    this.mapData[y][x] = targetId;

    if (this.gridItems[y][x]) this.gridItems[y][x].destroy();

    const tileDef = customGame.tileDefs.find(t => t.id === targetId);
    if (currentId !== -1 && tileDef?.image && this.textures.exists(`tile-${targetId}`)) {
      this.gridItems[y][x] = this.add.image(x * gridSize, y * gridSize, `tile-${targetId}`)
        .setOrigin(0).setDisplaySize(gridSize - 2, gridSize - 2).setInteractive();
    } else {
      const color = targetId === 1 ? 0xff0000 : 0x666666;
      this.gridItems[y][x] = this.add.rectangle(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2, color)
        .setOrigin(0).setInteractive();
    }
    this.gridItems[y][x].on('pointerdown', () => this.handleGridClick(x, y));
  }

  placeCharacter(x: number, y: number) {
    const game = this.game as MyGame;
    if (!game.selectedCharId) return;

    const posKey = `${x},${y}`;
    if (this.charSprites.has(posKey)) {
      this.charSprites.get(posKey)?.destroy();
      this.charSprites.delete(posKey);
    }

    const charDef = game.characters.find(c => c.id === game.selectedCharId);
    if (!charDef) return;

    const gridSize = 40;
    const sprite = this.add.sprite(x * gridSize + 20, y * gridSize + 20, `char-${charDef.id}`)
      .setDisplaySize(36, 36).setInteractive().setDepth(10);
    
    // キャラクリックで会話表示
    sprite.on('pointerdown', (pointer: any) => {
      pointer.event.stopPropagation(); 
      this.showDialogue(charDef);
    });

    this.charSprites.set(posKey, sprite);
  }

  showDialogue(char: CharacterDef) {
    const dialogue = char.dialogues.find(d => d.status === char.currentStatus) || char.dialogues[0];
    this.dialogueBg?.setVisible(true);
    this.dialogueText?.setText(`${char.name}: ${dialogue.text}`).setVisible(true);
    
    // 3秒後に消す
    this.time.delayedCall(3000, () => {
      this.dialogueBg?.setVisible(false);
      this.dialogueText?.setVisible(false);
    });
  }
}

class MyGame extends Phaser.Game {
  public selectedTileType: number = 0;
  public tileDefs: TileDef[] = [];
  public editMode: 'tile' | 'char' = 'tile';
  public selectedCharId: string | null = null;
  public characters: CharacterDef[] = [];
}

const PhaserGame = forwardRef<Phaser.Game, Props>((props, ref) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<MyGame | null>(null);

  useLayoutEffect(() => {
    if (!gameRef.current) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600, height: 400,
      parent: gameRef.current,
      backgroundColor: '#222',
      scene: EditorScene 
    };
    const game = new MyGame(config);
    phaserInstance.current = game;
    if (ref) (ref as any).current = game;
    return () => game.destroy(true);
  }, []);

  useEffect(() => {
    const game = phaserInstance.current;
    if (!game) return;
    game.selectedTileType = props.selectedTile;
    game.tileDefs = props.tiles;
    game.editMode = props.mode;
    game.selectedCharId = props.selectedCharId;
    game.characters = props.characters;

    const scene = game.scene.scenes[0] as EditorScene;
    if (scene && scene.textures) {
      props.tiles.forEach(tile => {
        if (tile.image) {
          const key = `tile-${tile.id}`;
          if (scene.textures.exists(key)) scene.textures.remove(key);
          scene.textures.addBase64(key, tile.image);
        }
      });

      props.characters.forEach(char => {
        if (char.image) {
          const key = `char-${char.id}`;
          if (scene.textures.exists(key)) scene.textures.remove(key);
          scene.textures.addBase64(key, char.image);
        }
      });
    }
  }, [props]);

  return <div ref={gameRef} style={{ width: '600px', height: '400px' }} />;
});

export default PhaserGame;