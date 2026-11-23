# Security Specification & Hardened Rules Verification

## 1. Data Invariants
1. **Single Public Surface (`public_portfolio/live`)**: Unauthenticated public visitors may ONLY `get` the exact document `/public_portfolio/live`. Collection `list` on `/public_portfolio` is denied, and all writes require verified admin authentication.
2. **Draft & Master Isolation**: Draft presets (`profile_presets`), permanent master records (`master_*`), publish history (`publish_history`), active state (`app_state`), and the passcode vault (`admin_vault`) are strictly inaccessible to unauthenticated or non-admin users.
3. **Verified Admin Identity**: `isAdmin()` enforces `request.auth != null && request.auth.token.email_verified == true` and restricts access to the bootstrapped owner (`ijazulhaqfazli2020@gmail.com`) or explicit `/admins/{uid}` documents created by the owner.
4. **Path ID & Payload Boundary Guards**: All single-document operations enforce `isValidId(docId)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars), strict `hasAll` + `hasOnly` key allowlists on create, `affectedKeys().hasOnly(...)` on update, string `.size()` caps, and list `.size()` caps.
5. **Immutable Audit & Temporal Integrity**: `createdAt` / `publishedAt` fields are validated against `request.time` on creation and locked immutable on update. `publish_history` records are append-only (updates disallowed).

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. Unauthenticated write to `/public_portfolio/live` (`{"activePresetName": "Hacked"}`) -> Denied (`!isAdmin()`).
2. Unauthenticated `list` query on `/profile_presets` or `/admin_vault` -> Denied (`!isAdmin()`).
3. Authenticated non-admin user (`attacker@gmail.com`) attempting `create` on `/admins/{uid}` -> Denied.
4. Spoofed email claim with `email_verified: false` attempting `get` on `/admin_vault/gate` -> Denied (`email_verified == true` required).
5. Path ID poisoning on `/master_projects/../../etc/passwd` or 500-char ID -> Denied (`isValidId` regex + size <= 128).
6. Shadow/ghost field injection (`{"title": "Test", "isSuperAdmin": true}`) on `/profile_presets/p1` -> Denied (`keys().hasOnly(...)`).
7. Owner UID spoofing (`{"ownerUid": "other-uid"}`) on `/master_projects/p1` -> Denied (`ownerUid == request.auth.uid`).
8. Timestamp forgery (`{"createdAt": "2020-01-01"}`) -> Denied (`createdAt == request.time`).
9. Resource exhaustion attack (1MB description string > 4000 chars) -> Denied (`.size() <= 4000`).
10. Array flooding (`tags` array with 200 items) -> Denied (`tags.size() <= 20`).
11. Mutating an immutable `publish_history` snapshot via `update` -> Denied (`allow update: if false;`).
12. Mutating `createdAt` or `ownerUid` during a valid admin `update` on `/profile_presets/p1` -> Denied (`affectedKeys().hasOnly(...)` + immutability check).
