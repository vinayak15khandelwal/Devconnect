# API Reference — DevConnect

Base URL: `http://localhost:4000` (local) — all endpoints prefixed `/api/*` except `/health`.

All responses share the shape: `{ success: boolean, data?: T, message: string }`.

Auth: either an `Authorization: Bearer <token>` header or the `token` httpOnly cookie set on login/register/GitHub callback. Endpoints marked 🔒 require one of these; a missing/invalid token returns `401`.

---

## Health
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/health` | — | Pings the DB via Prisma; `{status:"ok"}` or a 500 with the DB error. |

## Auth (`/api/auth`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| POST | `/register` | — | `{name, username, email, password}` → creates user, returns `{accessToken, user}`. Rate-limited (20/15min/IP). |
| POST | `/login` | — | `{email, password}` → `{accessToken, user}`. Rate-limited. |
| POST | `/logout` | — | Clears the auth cookie. |
| GET | `/me` | 🔒 | Current user's public profile fields. |
| GET | `/github` | — | Redirects to GitHub's OAuth consent screen. |
| GET | `/github/callback` | — | OAuth callback — exchanges code, upserts user, redirects to `CLIENT_URL/dashboard?token=...`. |

## Profile (`/api/profile`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/:username` | optional | Public profile: bio/location/GitHub, skills (sorted by endorsement count, `endorsedByMe` if logged in), projects. |
| PATCH | `/` | 🔒 | `{name?, bio?, location?, githubUrl?, skills?}` — updates profile; `skills` upserts each name and links it to the user. |
| POST | `/avatar` | 🔒 | Multipart `avatar` field (image only, ≤2MB) → uploads to Cloudinary, updates `avatarUrl`. |

## Projects (`/api/projects`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/user/:username` | — | That user's projects, newest first. |
| POST | `/` | 🔒 | Multipart: `title, description, techStack (JSON string), repoUrl?, liveUrl?, image?` (image only, ≤2MB). |
| PATCH | `/:id` | 🔒 (owner) | Partial update of any of the above fields (JSON body, not multipart). |
| DELETE | `/:id` | 🔒 (owner) | Deletes the project. |

## Blog (`/api/blog`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/?page=` | — | Published posts, 10/page, newest first, includes author. |
| GET | `/:slug` | — | Single post + author. |
| POST | `/` | 🔒 | `{title, contentMd, excerpt?, published?}` — slug auto-generated. |
| PATCH | `/:id` | 🔒 (author) | Partial update. |
| DELETE | `/:id` | 🔒 (author) | Deletes the post. |

## Search (`/api/search`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/?skill=&location=&page=` | — | Case-insensitive partial match on either filter, 12/page. |

## Connections (`/api/connections`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/` | 🔒 | Your accepted connections. |
| GET | `/pending` | 🔒 | Requests received, awaiting your response. |
| GET | `/status/:username` | 🔒 | `{status: NONE\|PENDING_SENT\|PENDING_RECEIVED\|ACCEPTED\|SELF, connectionId?}` — drives the frontend `ConnectButton`. |
| GET | `/mutual/:username` | 🔒 | Users connected to both you and `:username`. |
| POST | `/request/:username` | 🔒 | Sends a request; 409 if one already exists, 400 on self-request. |
| PATCH | `/:id/respond` | 🔒 (addressee) | `{action: "ACCEPT"\|"REJECT"}`. |
| DELETE | `/:id` | 🔒 (either party) | Removes a connection. |

## Endorsements (`/api/endorsements`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| POST | `/:username/:skillName` | 🔒 | Requires an `ACCEPTED` connection with `:username`. Upserts the skill if the target didn't already have it. 409 on duplicate endorsement, 400 on self-endorse, 403 if not connected. |

## Notifications (`/api/notifications`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/` | 🔒 | Last 30, newest first, each resolved with `fromUser` (name/username/avatar). |
| PATCH | `/:id/read` | 🔒 (recipient) | Marks one as read. |

## Dashboard (`/api/dashboard`)
| Method | Path | Auth | Description |
|---|---|:-:|---|
| GET | `/` | 🔒 | `{feed, trending, suggestions, stats}` — see `README.md` Day 13 entry for what each field means. |

## Real-time (Socket.io)
Connect with `auth: { token }` on the socket handshake (JWT). Server emits a `notification` event (the created `Notification` row) to a connected recipient when: a connection request is sent, a connection is accepted, or a skill is endorsed. See `server/src/socket/index.ts`.
