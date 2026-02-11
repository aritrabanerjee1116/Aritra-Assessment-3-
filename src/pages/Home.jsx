import React, { useState, useRef } from "react";

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newName, setNewName] = useState("");
  const [view, setView] = useState("list"); 

  
  const audioRef = useRef();

  const validateFile = (file) => {
    return file && file.type.startsWith("audio/");
  };

  const handleFiles = (files) => {
    const validFiles = [];

    for (let file of files) {
      if (validateFile(file)) {
        validFiles.push({
          name: file.name.replace(/\.[^/.]+$/, ""),
          file: file,
          url: URL.createObjectURL(file),
        });
      } else {
        alert("Only audio files are allowed!");
      }
    }

    setSongs((prev) => [...prev, ...validFiles]);
  };

  const handleUpload = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const playSong = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current.play();
    }, 100);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      playSong(currentIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentIndex !== null && currentIndex > 0) {
      playSong(currentIndex - 1);
    }
  };


  const saveName = (index) => {
    const updated = [...songs];
    updated[index].name = newName;
    setSongs(updated);
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 text-white p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-4xl font-extrabold mb-2 text-center">🎵 My Music Player</h1>
        <p className="text-center text-sm opacity-90">Drag & drop audio files or use the uploader below.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 rounded-2xl border-white/30 p-6 text-center mb-6 bg-white/10"
        >
          <p className="bg-white text-red-600 inline-block px-6 py-3 rounded-2xl font-medium">Drop audio files here</p>
          <p className="my-3 text-sm opacity-90">or</p>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleUpload}
            className="text-sm bg-white text-red-600 px-4 py-2 rounded-2xl cursor-pointer"
          />
          <div className="mt-3 text-xs opacity-80">Files: <span className="font-semibold">{songs.length}</span></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded ${view === "list" ? "bg-white text-red-600" : "bg-white/10"}`}
            >
              📋 List
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1 rounded ${view === "grid" ? "bg-white text-red-600" : "bg-white/10"}`}
            >
              🔳 Grid
            </button>
          </div>

          <div className="text-sm opacity-90">{songs.length} track(s)</div>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-20 rounded-lg bg-white/5">No songs yet — add some audio files.</div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
            {songs.map((song, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl flex items-center justify-between gap-4 ${
                  currentIndex === index ? "bg-black/60 ring-2 ring-white/20" : "bg-white/10"
                }`}
              >
                {view === "grid" ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-14 h-14 flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🎧</div>
                    <div className="flex-1">
                      <div className="font-semibold cursor-pointer" onClick={() => playSong(index)}>{song.name}</div>
                      <div className="text-xs opacity-80">{song.file?.type || "audio file"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => playSong(index)} className="px-3 py-1 bg-white text-red-600 rounded">{currentIndex===index && isPlaying ? "⏸" : "▶️"}</button>
                      <button
                        onClick={() => { setEditingIndex(index); setNewName(song.name); }}
                        className="text-sm text-yellow-300"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-lg cursor-pointer" onClick={() => playSong(index)}>{song.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {editingIndex === index ? (
                        <div className="flex gap-2">
                          <input value={newName} onChange={(e) => setNewName(e.target.value)} className="text-red-600 px-2 rounded bg-white" />
                          <button onClick={() => saveName(index)} className="bg-green-500 px-2 rounded text-black">Save</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => playSong(index)} className="px-3 py-1 bg-white text-red-600 rounded">{currentIndex===index && isPlaying ? "⏸" : "▶️"}</button>
                          <button onClick={() => { setEditingIndex(index); setNewName(song.name); }} className="text-sm text-yellow-300">Edit</button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {currentIndex !== null && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 p-4 rounded-full flex items-center gap-4">
          <button onClick={prevSong} className="text-2xl">⏮</button>
          <button onClick={togglePlay} className="bg-white text-black px-4 py-2 rounded-full">{isPlaying ? "Pause" : "Play"}</button>
          <button onClick={nextSong} className="text-2xl">⏭</button>

          <audio ref={audioRef} src={songs[currentIndex]?.url} onEnded={nextSong} />
        </div>
      )}
    </div>
  );
}

export default Home;
