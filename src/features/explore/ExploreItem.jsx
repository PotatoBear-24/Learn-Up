import React from "react";

/**
 * Renders an Explore item in a compact card.
 */

export default function ExploreItem({ item }) {
  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-slate-500">{item.type}</div>
          <h4 className="font-medium">{item.title}</h4>
          <div className="text-xs text-slate-600 mt-1">
            {item.author && <span>Author: {item.author} </span>}
            {item.creator && <span>• Creator: {item.creator}</span>}
          </div>
        </div>
        <div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</div>
      </div>
      {item.body && <p className="mt-2 text-sm text-slate-700 line-clamp-3">{item.body}</p>}
    </div>
  );
}
