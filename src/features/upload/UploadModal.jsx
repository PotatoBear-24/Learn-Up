import React, { useState } from "react";
import { addLocalContent } from "../../services/localDB";
import { flushSyncQueue } from "../../services/syncQueue";
import { useAuthStore } from "../auth/useAuthStore";

/**
 * Upload modal allows user to add a content item from their local library.
 * Minimal input validation; storage is local-first and enqueued for sync.
 */

const TYPES = ["textbook", "flashcard", "note", "video"];

export default function UploadModal({ open, onClose, requireAuth }) {
  const user = useAuthStore((s) => s.user);
  const [type, setType] = useState("textbook");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    if (!requireAuth || !user) {
      setError("You must be signed in to upload content. Go to Sign In.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!TYPES.includes(type)) {
      setError("Invalid type.");
      return;
    }
    setSaving(true);
    try {
      const localId = await addLocalContent({
        title: title.trim(),
        type,
        author: author ? author.trim() : null,
        creator: user.email || null,
        body: body ? body.trim() : null
      });
      // Attempt to flush queue (best-effort)
      await flushSyncQueue();
      // feedback and close
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
      setError(err.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Upload Content</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>

        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="grid gap-2">
          <label className="text-sm">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border rounded">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <label className="text-sm">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 border rounded" />

          <label className="text-sm">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="px-3 py-2 border rounded" />

          <label className="text-sm">Body / Notes (optional)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="px-3 py-2 border rounded" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-50 rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-3 py-2 bg-blue-600 text-white rounded">
            {saving ? "Saving..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
