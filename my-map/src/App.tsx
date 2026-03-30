import { useState, useRef } from 'react'
import PhaserGame from './components/PhaserGame'
import './App.css'

function App() {
  // 現在選択されているタイルの種類 (0: 床, 1: 壁)
  const [selectedTile, setSelectedTile] = useState<number>(0);
  const phaserRef = useRef<any>(null);

  return (
    <div className="admin-container">
      <div className="control-panel">
        <h2>マップエディタ</h2>
        <div className="button-group">
          <button 
            className={selectedTile === 0 ? 'active' : ''} 
            onClick={() => setSelectedTile(0)}
          >
            床を配置 (Gray)
          </button>
          <button 
            className={selectedTile === 1 ? 'active' : ''} 
            onClick={() => setSelectedTile(1)}
          >
            壁を配置 (Red)
          </button>
        </div>
        <p>現在の選択: {selectedTile === 1 ? '壁' : '床'}</p>
        

        <button className="save-button" onClick={async () => {
            if (phaserRef.current) {
                const scene = phaserRef.current.scene.scenes[0];
                const mapData = (scene as any).mapData;

                if (!mapData) {
                    alert("マップデータが見つかりません");
                    return;
                }

                try {
                    const response = await fetch('http://localhost:8080/api/save-map', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: mapData }),
                    });

                    if (response.ok) {
                        const result = await response.text();
                        alert("サーバーからの応答: " + result);
                    } else {
                        alert("保存に失敗しました。サーバーの状態を確認してください。");
                    }
                } catch (error) {
                    console.error("保存エラー:", error);
                    alert("サーバーに接続できませんでした。");
                }
            }      
        }}>
          Goサーバーへ保存
        </button>
      </div>

      <div className="game-screen">
        <PhaserGame ref={phaserRef} selectedTile={selectedTile} />
      </div>
    </div>
  )
}

export default App