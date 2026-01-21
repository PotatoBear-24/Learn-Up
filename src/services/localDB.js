import Dexie from "dexie";

/**
 * Local cache using Dexie for offline support.
 * Stores user content and a sync queue.
 */

export const db = new Dexie("learn_up_db");

export async function initLocalDB() {
  db.version(1).stores({
    content: "++id,remote_id,type,title,author,creator,body,created_at,updated_at",
    syncQueue: "++id,action,resourceType,resourceId,payload,created_at"
  });

  // Open DB
  try {
    await db.open();
  } catch (err) {
    console.error("Dexie open failed", err);
    throw err;
  }
}

/**
 * Add item to local content store and enqueue sync action.
 */
export async function addLocalContent(item) {
  if (!item || !item.type || !item.title) {
    throw new Error("Invalid content item");
  }
  const now = new Date().toISOString();
  const id = await db.content.add({
    ...item,
    created_at: item.created_at || now,
    updated_at: item.updated_at || now
  });
  await db.syncQueue.add({
    action: "create",
    resourceType: "content",
    resourceId: id,
    payload: JSON.stringify({ localId: id, ...item }),
    created_at: now
  });
  return id;
}
