# Database Schema — DevConnect

Entity-relationship diagram for the schema defined in `server/prisma/schema.prisma`.
GitHub renders this Mermaid diagram automatically on the repo page.

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ BLOGPOST : writes
    USER ||--o{ USERSKILL : has
    USER ||--o{ ENDORSEMENT : gives
    USER ||--o{ CONNECTION : requests
    USER ||--o{ CONNECTION : receives
    USER ||--o{ NOTIFICATION : receives

    SKILL ||--o{ USERSKILL : "tagged on"
    USERSKILL ||--o{ ENDORSEMENT : "endorsed via"

    USER {
        string id PK
        string name
        string username UK
        string email UK
        string passwordHash
        string githubId UK
        string avatarUrl
        string bio
        string location
    }
    SKILL {
        string id PK
        string name UK
    }
    USERSKILL {
        string id PK
        string userId FK
        string skillId FK
    }
    ENDORSEMENT {
        string id PK
        string userSkillId FK
        string endorserId FK
    }
    PROJECT {
        string id PK
        string userId FK
        string title
        string description
        string[] techStack
        string repoUrl
        string liveUrl
    }
    BLOGPOST {
        string id PK
        string authorId FK
        string title
        string slug UK
        string contentMd
        boolean published
    }
    CONNECTION {
        string id PK
        string requesterId FK
        string addresseeId FK
        enum status
    }
    NOTIFICATION {
        string id PK
        string recipientId FK
        enum type
        string message
        boolean read
    }
```

## Notes on design decisions
- **`UserSkill` is a join table**, not a plain many-to-many, because endorsements attach to a *specific user's instance* of a skill, not the skill itself — that's what `Endorsement` references.
- **`Connection` is directional** (`requesterId` / `addresseeId`) with a `status` enum, so pending/accepted/rejected states and "who sent the request" are both recoverable from one row — matches the brief's send/accept/reject flow.
- **`Notification` stores `fromUserId` as a plain string, not a relation**, since notifications should survive even if we later want to prune old actor data independently; the recipient relation is what matters for querying "my notifications."
- Unique constraints (`@@unique([userId, skillId])`, `@@unique([requesterId, addresseeId])`, etc.) prevent duplicate endorsements / duplicate connection requests at the DB level, not just in application code.
