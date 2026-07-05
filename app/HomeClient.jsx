"use client";

import { useRef, useState } from "react";
import BookClient from "./components/BookClient";

export default function HomeClient({ initialUnlocked }) {
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [musicState, setMusicState] = useState("stopped");

  const audioRef = useRef(null);

  async function startMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      audio.volume = 0.45;
      await audio.play();
      setMusicState("playing");
    } catch {
      setMusicState("blocked");
    }
  }

  function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      setMusicState("stopped");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "Wrong answer.");
        setLoading(false);
        return;
      }

      setUnlocked(true);
      setLoading(false);

      setTimeout(() => {
        startMusic();
      }, 150);
    } catch {
      setError("Unable to unlock right now.");
      setLoading(false);
    }
  }

  return (
    <main className="site-shell">
      <audio
        ref={audioRef}
        src="/music/kaise-hua.mp3"
        loop
        preload="auto"
      />

      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />
      <div className="grain-layer" />

      {!unlocked ? (
        <section className="lock-screen">
          <div className="lock-card">
            <p className="eyebrow">5 July 2005</p>

            <h1>
              A Birthday Book
              <span>For Kasturi</span>
            </h1>

            <p className="lock-note">
              This book opens only for the one who knows the name hidden inside
              my heart.
            </p>

            <form onSubmit={handleSubmit} className="unlock-form">
              <label htmlFor="answer">What is my Name?</label>

              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Enter the answer"
                autoComplete="off"
              />

              {error ? <p className="error-text">{error}</p> : null}

              <button type="submit" disabled={loading}>
                {loading ? "Opening..." : "Open The Book"}
              </button>
            </form>

            <p className="tiny-hint">Hint: the answer is made of love.</p>
          </div>
        </section>
      ) : (
        <>
          <button className="music-pill" onClick={toggleMusic}>
            {musicState === "playing" ? "Pause music" : "Play music"}
          </button>

          {musicState === "blocked" ? (
            <p className="music-warning">
              Tap “Play music” once. Some phones block automatic music.
            </p>
          ) : null}

          <BookClient />
        </>
      )}
    </main>
  );
}
