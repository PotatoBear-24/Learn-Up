# Learn Up

A minimalistic study app (React + Vite + Tailwind) with Pomodoro timer. This fork adds secure authentication, an Explore feed to browse shared content, and an Upload workflow to add resources to your account. Content syncs to Supabase with local-first caching (Dexie) and an offline sync queue.

Features
- Sign in with Google, GitHub, Discord, or email/password (Supabase Auth)
- Explore: view global shared textbooks, flashcards, notes, and videos
- Upload: floating '+' button to add items from your local library; saved locally and synced to Supabase
- Local cache (Dexie) and offline sync queue for reliability
- Minimalistic UI and existing Pomodoro functionality preserved
- Zustand for client state management

Prerequisites
- Node.js >= 18
- npm or yarn
- Supabase project (free tier is fine)
  - Create a Supabase project and obtain:
    - Project URL (VITE_SUPABASE_URL)
    - Anon (public) key (VITE_SUPABASE_ANON_KEY)

Installation
1. Clone or copy the project files into your project directory.
2. Install dependencies:

    npm install

3. Create a `.env` file in the project root based on `.env.example`:

    cp .env.example .env
    # then edit .env to add your Supabase values

4. Initialize Tailwind CSS (already configured). No further action required.

Supabase setup
1. Open your Supabase project dashboard.
2. Go to "SQL Editor" and run the migration file at `supabase/migrations/001_create_user_content_tables.sql`.
   - This creates `profiles` and `user_content` tables, and sets up basic RLS policies.
3. In Supabase > Authentication > Providers, enable Google, GitHub, and Discord:
   - Configure OAuth client IDs and secrets with proper redirect URLs (e.g., `http://localhost:5173`)
   - For email/password auth, no extra setup required by default.

Configuration
- Environment variables:
    - `VITE_SUPABASE_URL` – your Supabase project URL
    - `VITE_SUPABASE_ANON_KEY` – your Supabase anon/public key
- Copy `.env.example` to `.env` and fill these values.

Run the app
- Development:

    npm run dev

- Build for production:

    npm run build
    npm run preview

Usage
- Open `http://localhost:5173` in your browser.
- Home contains the existing Pomodoro timer.
- Click "Explore" to view globally shared content. Use the filter bar to show only textbooks, flashcards, notes, or videos. Use the search bar to search across title, author, creator, and body.
- Use the '+' floating button (bottom-left) to upload content. You must be signed in to upload. Uploaded items are saved locally and enqueued for sync to Supabase. The app will attempt to flush the sync queue immediately after upload.
- Sign in via the Sign In page. OAuth providers redirect to Supabase then back to the app. Email/password sign up and sign in are supported.

Security & Best Practices
- Supabase RLS policies are included to ensure only authenticated users can insert content with their `user_id`, and only owners can modify or delete their content.
- The frontend uses the Supabase anon/public key (safe for client use). Service role keys must never be shipped to the client.
- Inputs are validated client-side; server-side validation should be added if you extend the API.
- Local DB (Dexie) is used for resilience in offline mode and to minimize data loss. Syncing is best-effort and retried on reload.

Project Structure
- src/
    - main.jsx — app bootstrapping
    - App.jsx — routes and layout integration
    - index.css — Tailwind and styling
    - components/
        - Pomodoro.jsx — existing Pomodoro timer (preserved)
    - layouts/
        - DashboardLayout.jsx — header, nav, floating upload
    - pages/
        - Home.jsx
    - features/
        - auth/
            - useAuthStore.js — Zustand store for auth
            - AuthProvider.jsx — listens to Supabase auth changes
            - SignIn.jsx — sign-in UI
            - ProtectedRoute.jsx — route guard
        - explore/
            - Explore.jsx — explore feed with filters/search
            - ExploreItem.jsx — single card UI
        - upload/
            - FloatingUploadButton.jsx — '+' button
            - UploadModal.jsx — modal to add content
    - services/
        - supabaseClient.js — Supabase client
        - localDB.js — Dexie local cache & helper
        - syncQueue.js — flush worker
- supabase/migrations/001_create_user_content_tables.sql — DB schema and RLS policies
- .env.example — environment variable template

Troubleshooting
- "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY" error:
  - Ensure `.env` exists and contains correct values, then restart dev server.
- OAuth providers not returning to app:
  - Verify the redirect URLs in your provider console and Supabase settings match your app URL (e.g., `http://localhost:5173`).
- Uploaded items not appearing in Explore immediately:
  - The upload flow adds to local DB and attempts to flush the sync queue. If sync fails, it will retry on reload. Check console for errors.
- Dexie or IndexedDB errors:
  - Some browsers restrict IndexedDB in incognito/private browsing. Use a regular browsing session.
- RLS policy issues (permission denied on insert):
  - Ensure migrations were applied and that client is authenticated when inserting. The `user_content.user_id` is enforced server-side; currently frontend inserts via the sync worker use the anon key, which requires proper auth context (session). Ensure you are signed in.

Extending
- Add pagination to Explore for large datasets.
- Allow file uploads (books, PDFs) via Supabase Storage with multipart support.
- Add server-side validation functions or Edge Functions for advanced moderation before content is public.

Support
If you want, I can:
- Convert migration to a supabase migration script or provide a CLI command.
- Add server-side APIs or moderation workflows.
- Integrate storage for file uploads.

Enjoy Learn Up — safe, minimal, and now collaborative!
