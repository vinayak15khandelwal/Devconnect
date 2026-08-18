# End-to-End Test Checklist — DevConnect

Manual test plan covering the full feature set. Run through this after any deployment, or before a demo, with **two** logged-in accounts (A and B) since most of the interesting behavior is between two users.

## Auth (Day 3, 5)
- [ ] Register a new account — lands on Dashboard immediately, no manual login needed
- [ ] Log out, log back in with the same credentials
- [ ] Wrong password → clear error message, not a silent failure
- [ ] Refresh the page while logged in — session persists (doesn't bounce to `/login`)
- [ ] "Continue with GitHub" completes the OAuth loop and lands on Dashboard
- [ ] Password eye toggle on both Login and Register actually shows/hides the typed value

## Profile (Day 4, 6)
- [ ] Edit bio/location/GitHub URL/skills — persists after a refresh (not just local state — this was the Day 6 bug, worth re-checking after any refactor)
- [ ] Upload an avatar — appears immediately and persists after refresh
- [ ] Add a project with title/description/tech stack — appears as a card, persists after refresh
- [ ] Visiting your own profile shows "Edit profile", not a Connect button
- [ ] Visiting someone else's profile shows a Connect button, not Edit controls

## Blog (Day 7)
- [ ] Write a post with Markdown (headings, bold, a list) — Preview toggle renders it correctly before publishing
- [ ] Published post appears on `/blog` and at `/blog/:slug` with Markdown rendered
- [ ] Edit your own post — changes persist
- [ ] Delete your own post — disappears from the list
- [ ] Someone else's post shows no Edit/Delete controls for you

## Search (Day 8)
- [ ] Filtering by a skill that exists narrows results correctly
- [ ] Filtering by a location that exists narrows results correctly
- [ ] Empty filters show everyone, paginated
- [ ] Pagination controls only appear when there's more than one page (working as designed — see prior verification)

## Connections (Day 9)
- [ ] A sends a request to B — A sees "Request sent", B sees Accept/Reject on A's profile and in `/connections`
- [ ] B accepts — both now show "✓ Connected"; both appear in each other's `/connections` list
- [ ] Remove a connection — disappears from both sides
- [ ] Mutual connections indicator appears correctly once a third user connects to both A and B

## Endorsements (Day 10)
- [ ] Connected users can endorse each other's skills — count increments, persists after refresh
- [ ] Cannot endorse a skill twice (second attempt fails cleanly)
- [ ] Cannot endorse without an accepted connection (button doesn't even appear; API also blocks it directly)
- [ ] Highest-endorsed skill shows the 🏆 badge and sorts first

## Notifications (Day 11)
- [ ] Connection request, accept, and endorsement each produce a live notification (no refresh needed) if the recipient is online
- [ ] Notification history survives a refresh (persisted, not just the live socket feed)
- [ ] Clicking a notification marks it read, badge count decrements

## Dashboard (Day 13)
- [ ] Stats (projects/posts/connections) match what you've actually created
- [ ] Activity feed shows posts from your connections only
- [ ] Trending shows posts from outside your network
- [ ] Connection suggestions show a working Connect button

## Cross-cutting
- [ ] **Dark mode**: toggle persists across a refresh; every page listed above is readable in both themes, not just Dashboard
- [ ] **Mobile** (< 640px): hamburger menu works, no horizontal overflow on any page, notification dropdown doesn't clip off-screen
- [ ] **Security**: uploading a non-image file as an avatar is rejected (400, not silently accepted); 21 rapid login attempts trigger a 429 on the 21st

## Known non-bugs (already investigated — don't re-report these)
- Search pagination controls hidden when there's only one page of results — intentional, confirmed correct
- "Trending" is a recency-based proxy (no view/like schema), documented as such — not a real ranking algorithm
