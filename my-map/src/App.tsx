import { useState, useRef } from 'react'
import PhaserGame from './components/PhaserGame'
import type { TileDef, CharacterDef, PlacedCharacter } from './types'
import './App.css'

function App() {
  const [mode, setMode] = useState<'tile' | 'char'>('tile');
  const [selectedTile, setSelectedTile] = useState<number>(0);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  
  const phaserRef = useRef<Phaser.Game>(null);

  const [tiles, setTiles] = useState<TileDef[]>([
    { id: 0, name: '床', image: null, color: '#666666' },
    { id: 1, name: '壁', image: null, color: '#ff0000' },
  ]);

  // キャラクターリストの状態管理
  const [characters, setCharacters] = useState<CharacterDef[]>([
    {
      id: 'char1',
      name: '村人A',
      image: null,
      currentStatus: '通常',
      dialogues: [{ status: '通常', text: 'こんにちはー　良い天気ですね。' }]
    }
  ]);

  const addCharacter = () => {
    const newChar: CharacterDef = {
      id: `char-${Date.now()}`,
      name: '新規キャラ',
      image: null,
      currentStatus: '通常',
      dialogues: [{ status: '通常', text: '初期セリフ' }]
    };
    setCharacters([...characters, newChar]);
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setTiles(prev => prev.map(t => t.id === id ? { ...t, image: base64 } : t));
    };
    reader.readAsDataURL(file);
  };

  const handleCharImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCharacters(prev => prev.map(c => c.id === id ? { ...c, image: base64 } : c));
    };
    reader.readAsDataURL(file);
  };

  const updateDialogue = (charId: string, status: string, text: string) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const newDialogues = c.dialogues.map(d => d.status === status ? { ...d, text } : d);
      return { ...c, dialogues: newDialogues };
    }));
  };

  return (
    <div className="admin-container">
      <div className="control-panel">
        <div className="mode-tabs">
          <button onClick={() => setMode('tile')} className={mode === 'tile' ? 'active' : ''}>タイル編集</button>
          <button onClick={() => setMode('char')} className={mode === 'char' ? 'active' : ''}>キャラ配置</button>
        </div>

        {mode === 'tile' ? (
          <div className="tile-registration">
            <h3>タイル設定</h3>
            {tiles.map(tile => (
              <div key={tile.id} className={`tile-edit-card ${selectedTile === tile.id ? 'active' : ''}`}>
                <button onClick={() => setSelectedTile(tile.id)}>{tile.name}</button>
                <input type="file" onChange={(e) => handleImageUpload(tile.id, e)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="char-registration">
            <h3>キャラクター設定</h3>
            <button onClick={addCharacter}>キャラ追加</button>
            {characters.map(char => (
              <div key={char.id} className={`char-edit-card ${selectedCharId === char.id ? 'active' : ''}`}>
                <button onClick={() => setSelectedCharId(char.id)}>{char.name}を配置</button>
                <input type="text" value={char.name} onChange={(e) => {
                  setCharacters(prev => prev.map(c => c.id === char.id ? {...c, name: e.target.value} : c))
                }} />
                <input type="file" onChange={(e) => handleCharImageUpload(char.id, e)} />
                <div className="dialogue-settings">
                  {char.dialogues.map((d, i) => (
                    <div key={i}>
                      <small>状態: {d.status}</small>
                      <textarea value={d.text} onChange={(e) => updateDialogue(char.id, d.status, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="game-screen">
        <PhaserGame 
          ref={phaserRef} 
          selectedTile={selectedTile} 
          tiles={tiles} 
          mode={mode}
          selectedCharId={selectedCharId}
          characters={characters}
        />
      </div>
    </div>
  )
}
export default App;