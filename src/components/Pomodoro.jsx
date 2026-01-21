import React, { useEffect, useState, useRef } from "react";

/**
 * Minimal Pomodoro timer — original functionality preserved.
 * Lightweight, with start/stop/reset, and localStorage persistence.
 */

const DEFAULT_SECONDS = 25 * 60;

export default function Pomodoro() {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const saved = localStorage.getItem("pomodoro_seconds");
    return saved ? Number(saved) : DEFAULT_SECONDS;
  });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("pomodoro_seconds", String(secondsLeft));
  }, [secondsLeft]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return DEFAULT_SECONDS;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="font-medium mb-2">Pomodoro</h3>
      <div className="text-4xl font-mono mb-4">{minutes}:{secs}</div>
      <div className="flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="px-3 py-1 bg-green-50 text-green-700 rounded"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSecondsLeft(DEFAULT_SECONDS);
          }}
          className="px-3 py-1 bg-gray-50 text-gray-700 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
