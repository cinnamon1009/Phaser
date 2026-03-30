import { Start } from './scenes/Start.js';
import { MapEditor } from './scenes/MapEditor.js';
import { PlayScene } from './scenes/PlayScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade', 
        arcade: { debug: false }
    },
    scene: [
        Start,
        MapEditor,
        PlayScene
    ]
};

new Phaser.Game(config);