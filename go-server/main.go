package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

type MapRequest struct {
	Data [][]int `json:"data"`
}

func saveMapHandler(w http.ResponseWriter, r *http.Request) {
	// CORS設定（Reactからのアクセスを許可する）
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req MapRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println("--- Reactからマップデータを受信しました ---")
	for _, row := range req.Data {
		fmt.Println(row)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("マップの保存に成功した"))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	os.MkdirAll("./uploads", os.ModePerm)
	dst, err := os.Create(filepath.Join("./uploads", header.Filename))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	io.Copy(dst, file)

	fmt.Printf("画像を保存しました: %s\n", header.Filename)
	w.Write([]byte("/uploads/" + header.Filename)) 
}

func main() {
	// 画像ファイルにアクセスできるようにする
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))
	
	http.HandleFunc("/api/upload", uploadHandler)
	http.HandleFunc("/api/save-map", saveMapHandler)
	
	fmt.Println("Server starting at :8080...")
	http.ListenAndServe(":8080", nil)
}