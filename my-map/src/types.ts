// src/types.ts
export interface TileDef {
  id: number;
  name: string;
  image: string | null;
  color: string;
}

export interface Dialogue {
  status: string; // 例: "normal", "completed", "angry"
  text: string;
}

export interface CharacterDef {
  id: string;
  name: string;
  image: string | null;
  currentStatus: string;
  dialogues: Dialogue[];
}

export interface PlacedCharacter {
  charId: string;
  x: number;
  y: number;
}