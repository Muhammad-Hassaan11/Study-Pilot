# Initial implementation: guest planner development milestone

Authorized by the request to start building on 2026-10-03. Implement a local, single-server Next.js App Router application with TypeScript, SQLite, and opaque HttpOnly guest sessions. Resolve stable dependencies from npm and lock exact versions. SQLite lives outside the public directory; all reads and writes derive ownership from the session, never a client owner ID. Store only a hash of each session token.

This is an initial development milestone, not a declaration that Phases 1–2 pass release. Google OAuth/linking requires provider configuration and remains a release gate. Local guest records live on this server; clearing cookies or signing out loses recovery access. No cross-device recovery is promised. Explicit deletion removes this local identity and its records immediately; production backup/purge policy remains a launch gate.

Build guest entry, profile/timezone/theme, protected navigation, course instances, recurring class creation, deadline creation/edit/completion, and canonical Overview derivation. Reject nonexistent/ambiguous local times until explicit offset selection is implemented. Preserve schedule timezone when preferences change. Use revision checking and idempotent request IDs for writes. Offline mutations are disabled and failed form drafts remain.

Acceptance: test ownership isolation, expired sessions, idempotent retries, stale writes, canonical counts, due boundaries and DST rejection. Run TypeScript and production build. Document remaining phase cases and responsive verification honestly. Later modules have no navigation until implemented.
