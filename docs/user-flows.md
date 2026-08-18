# User Flow Diagrams — DevConnect

Covers the core journey called out in the project brief: registration → profile → connect → endorse.

```mermaid
flowchart TD
    A[Visit app] --> B{Have an account?}
    B -- No --> C[Register: name, username, email, password]
    B -- Yes --> D[Login: email + password]
    B -- Has GitHub --> E[Continue with GitHub]
    C --> F[JWT issued, redirected to Dashboard]
    D --> F
    E --> G[GitHub OAuth consent] --> H[Server exchanges code, upserts user] --> F

    F --> I[Edit profile: bio, location, GitHub, skills]
    I --> J[Upload avatar]
    I --> K[Add projects]
    I --> L[Write a blog post]

    F --> M[Search / Discover developers]
    M --> N[Filter by skill / location]
    N --> O[Visit another developer's profile]

    O --> P{Connection status?}
    P -- None --> Q[Click Connect]
    Q --> R[Request sent — recipient notified live via Socket.io]
    R --> S[Recipient: Accept or Reject]
    S -- Accept --> T[Connected — both notified live]
    S -- Reject --> P

    T --> U[Visit connected user's profile]
    U --> V[Endorse a skill]
    V --> W[Endorsement recorded — recipient notified live]
    W --> X[Skill's endorsement count increments, sorts toward top, 🏆 badge if #1]
```

## Notes
- The **Connect → Accept → Endorse** chain is enforced server-side, not just hidden in the UI: `POST /api/endorsements/:username/:skillName` returns 403 if there's no `ACCEPTED` connection, regardless of what the frontend shows.
- Every live-notification step (request sent, accepted, endorsed) round-trips through `POST`-triggered `notifyUser()` → persisted `Notification` row → pushed over the recipient's socket if they're online, and is still visible via `GET /api/notifications` if they weren't.
