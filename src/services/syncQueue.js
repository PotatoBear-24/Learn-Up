import { db } from "./localDB";
import { supabase } from "./supabaseClient";

/**
 * Simple sync worker that attempts to flush local syncQueue to Supabase.
 * Designed to be idempotent and robust to partial failures.
 */

export async function flushSyncQueue() {
  const queue = await db.syncQueue.toArray();
  if (!queue.length) return { ok: true, processed: 0 };

  let processed = 0;
  for (const job of queue) {
    try {
      const payload = JSON.parse(job.payload);
      if (job.action === "create" && job.resourceType === "content") {
        // Upload content row to Supabase 'user_content' table
        const { title, type, author, body, creator } = payload;
        // Ensure required fields
        const insert = {
          title: String(title).slice(0, 300),
          type: String(type).slice(0, 50),
          author: author ? String(author).slice(0, 200) : null,
          creator: creator ? String(creator).slice(0, 200) : null,
          body: body ? String(body).slice(0, 5000) : null
        };
        const { error } = await supabase.from("user_content").insert(insert).select();
        if (error) throw error;
        // remove job from queue after success
      }
      await db.syncQueue.delete(job.id);
      processed++;
    } catch (err) {
      console.error("Sync job failed", job, err);
      // do not delete job; proceed to next to avoid infinite loop
    }
  }
  return { ok: true, processed };
}
