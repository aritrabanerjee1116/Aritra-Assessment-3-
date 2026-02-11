import React, { useState, useRef } from "react";

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newName, setNewName] = useState("");

  
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
    <div className="h-[150vh] bg-red-400 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎵 My Music Player
      </h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 rounded-2xl border-white p-8 text-center  mb-6"
      >
        <p className="bg-white text-red-400 inline-block p-5 rounded-2xl">Drag & Drop Audio Files Here</p>
        <p className="my-2">or</p>
        <input 
          type="file"
          accept="audio/*"
          multiple
          onChange={handleUpload}
          className="text-sm bg-white text-red-400 p-5 rounded-2xl cursor-pointer"
        />
      </div>

     
      <div className="">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`p-4  flex justify-between items-center cursor-pointer rounded-2xl text-green-500 ${
              currentIndex === index ? "bg-black text-green-400": "bg-gray-600 text-white"
            }`}
          >{"Note: Tap on the file name to enjoy your Music!"}
            {editingIndex === index ? (
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-red-400 px-2 rounded bg-white"
                />
                <button
                  onClick={() => saveName(index)}
                  className="bg-green-500 px-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span onClick={() => playSong(index)}>
                  {song.name}
                </span>
                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setNewName(song.name);
                  }}
                  className="text-sm text-yellow-400"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
         
     
      {currentIndex !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-center gap-6 items-center">
          <button onClick={prevSong}>⏮</button>
          <button
            onClick={togglePlay}
            className="bg-white text-black px-4 py-2 rounded-full"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={nextSong}>⏭</button>

          <audio
            ref={audioRef}
            src={songs[currentIndex]?.url}
            onEnded={nextSong}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
