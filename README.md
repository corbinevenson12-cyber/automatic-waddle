 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..ccf7a314c2413944e196b4d5159ee26f28460ee2
--- /dev/null
+++ b/README.md
@@ -0,0 +1,107 @@
+# PhotoPath
+
+PhotoPath is a collaborative full-stack web app for building a navigable, directional photo graph of a real place (lightweight crowd-sourced street-view).
+
+## Stack
+- Next.js 14 App Router + TypeScript + Tailwind
+- PostgreSQL + Prisma ORM
+- Socket.IO realtime collaboration
+- S3-compatible CDN URL signing abstraction (`lib/storage.ts`)
+- Vitest unit tests
+
+## Features implemented
+- Projects, memberships, invites with Viewer/Editor/Admin roles
+- Magic-link style auth flow (dev-friendly)
+- Batch drag-and-drop uploads with EXIF extraction and project/batch limits
+- Graph model (PhotoNodes + directional Edges)
+- Sort Wizard API (timestamp + perceptual-hash proxy confidence + uncertain jump detection)
+- Viewer with keyboard navigation, directional arrows, low-bandwidth mode, mini-map
+- Collaborative editor with realtime presence/events hooks
+- Realtime pinned comments endpoint + activity event stream
+- Health check endpoint for dead ends/isolated nodes and cycle workflow handoff
+- Snapshot endpoint optimized for up to ~1,500 node payload cap
+- Cursor pagination for projects and activity feed
+- Seed demo project endpoint
+- Admin performance page to measure snapshot fetch/render time
+
+## Routes
+- `/login`
+- `/projects`
+- `/projects/[id]`
+- `/projects/[id]/viewer`
+- `/projects/[id]/editor`
+- `/projects/[id]/admin-performance`
+
+## Setup
+1. Install dependencies:
+   ```bash
+   npm install
+   ```
+2. Configure env:
+   ```bash
+   cp .env.example .env
+   ```
+3. Generate Prisma client and migrate:
+   ```bash
+   npm run prisma:generate
+   npm run prisma:migrate
+   ```
+4. Start app:
+   ```bash
+   npm run dev
+   ```
+
+## Realtime model
+- Socket server initialized via `pages/api/realtime.ts`
+- Project rooms (`project:<id>`)
+- Minimal event payloads supported:
+  - `node_created`
+  - `node_updated`
+  - `edge_created`
+  - `edge_deleted`
+  - `comment_created`
+  - `presence_update` (client side should throttle to ~1/sec)
+
+## Scaling to ~1,000 photos
+### Storage and images
+- Persist original + three derivatives (`thumbnailUrl`, `mediumUrl`, `largeUrl`) in `PhotoNode`.
+- Viewer uses low-bandwidth toggle to prefer thumbnails.
+- URLs returned through signed CDN abstraction.
+
+### Backend performance
+- Prisma indexes:
+  - `PhotoNode(projectId, timestamp)`
+  - `PhotoNode(projectId, createdAt)`
+  - `Edge(projectId, fromNodeId)`
+  - `ActivityEvent(projectId, createdAt)`
+- Cursor pagination on project list and activity feed.
+- Snapshot endpoint returns a minimal DTO for graph render.
+
+### Frontend performance
+- Virtualized timeline/grid strategy using TanStack Virtual.
+- Keyboard-driven viewer keeps minimal state.
+- SVG mini-map only renders a capped subset for smoothness.
+
+### Sort wizard
+- O(n log n) timestamp ordering.
+- Similarity heuristic uses hashes only (never full-resolution image bytes).
+- Uncertain transitions flagged by confidence threshold.
+
+### Background jobs
+- `/api/jobs` simulates hash generation/background processing and emits activity.
+- Can be moved to queue workers (BullMQ/SQS) without changing node schema.
+
+## Tests
+- `tests/sortWizard.test.ts`
+- `tests/edgeValidation.test.ts`
+
+Run with:
+```bash
+npm test
+```
+
+## ASSUMPTIONS
+- Magic-link flow is dev-oriented; production should persist one-time tokens and send via SMTP provider.
+- Upload endpoint currently demonstrates resumable-compatible boundaries; production should use direct multipart upload (tus/chunking) to object storage.
+- Graph cycle details are summarized; full cycle path listing should run asynchronously for very large graphs.
+- Presence throttling is expected at the client/event emitter layer to keep events under ~1/sec per user.
 
EOF
)
