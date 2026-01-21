import React from "react";
import Pomodoro from "../components/Pomodoro";

/**
 * Placeholder home page that keeps existing Pomodoro timer intact.
 * The Pomodoro component is minimal and self-contained.
 */

export default function Home() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Pomodoro />
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="font-medium">Study Quick Links</h3>
          <ul className="mt-2 text-sm text-slate-600">
            <li>Explore shared content</li>
            <li>Upload your resources</li>
            <li>Sync across devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
