import React, { useState } from "react";
import UploadModal from "./UploadModal";
import { useAuthStore } from "../auth/useAuthStore";

/**
 * Floating '+' button bottom-left that opens UploadModal.
 * Visible always, but upload requires signed-in user; otherwise shows sign-in prompt.
 */

export default function FloatingUploadButton() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Upload to Explore"
        className="fixed left-4 bottom-4 z-50 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
        aria-label="Upload"
      >
        +
      </button>
      {open && (
        <UploadModal
          open={open}
          onClose={() => setOpen(false)}
          requireAuth={Boolean(user)}
        />
      )}
    </>
  );
}
