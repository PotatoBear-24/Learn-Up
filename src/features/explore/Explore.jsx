import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import ExploreItem from "./ExploreItem";

/**
 * Explore page fetches global shared content from Supabase.
 * Includes filters and search across title, author, creator, and type.
 */

const TYPES = ["all", "textbook", "flashcard", "note", "video"];

export default function Explore() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchItems() {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("user_content").select("id,title,type,author,creator,body,created_at").order("created_at", { ascending: false }).limit(200);
      if (filter !== "all") {
        query = query.eq("type", filter);
      }
      if (q && q.trim().length > 0) {
        // Basic text search across fields
        const term = q.trim();
        query = query.or(`title.ilike.%${term}%,author.ilike.%${term}%,creator.ilike.%${term}%,body.ilike.%${term}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Fetch explore error", err);
      setError(err.message || "Failed to load Explore.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    // refresh periodically in background
    const id = setInterval(fetchItems, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, q]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded text-sm ${filter === t ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-700"}`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author, creator..."
            className="px-3 py-2 border rounded w-80"
          />
        </div>
      </div>

      {loading && <div className="text-sm text-slate-600">Loading...</div>}
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <div className="grid gap-3">
        {items.length === 0 && !loading ? (
          <div className="text-sm text-slate-600">No shared items found.</div>
        ) : (
          items.map((it) => <ExploreItem key={it.id} item={it} />)
        )}
      </div>
    </div>
  );
}
