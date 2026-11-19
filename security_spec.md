# AUNARA Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default Deny**: Every unmatched path in Firestore is denied for read and write.
2. **PII Isolation (`/users/{userId}`)**: Contains user `email`. Read (`get`) is strictly limited to the document owner (`request.auth.uid == userId`) or a verified admin. Blanket `list` queries across `/users` are strictly forbidden (`allow list: if false`).
3. **Verified Identity**: All writes require `request.auth != null && request.auth.token.email_verified == true`.
4. **UID & Document ID Integrity**: `isValidId(userId)` enforces `^[a-zA-Z0-9_\-]+$` and length `<= 128`; `incoming().uid == userId && incoming().uid == request.auth.uid`.
5. **No Shadow Fields & Strict Bounds**: Create enforces exact `hasAll` and `hasOnly` keys matching `firebase-blueprint.json`, with `.size()` bounds on every string. Updates enforce `isValidUserProfile(incoming())` plus action-based `affectedKeys().hasOnly(...)`.
6. **Temporal & Immutability Integrity**: `createdAt == request.time` on create and `incoming().createdAt == existing().createdAt` + `incoming().uid == existing().uid` + `incoming().updatedAt == request.time` on update.

## 2. The "Dirty Dozen" Adversarial Payloads (All Must Yield `PERMISSION_DENIED`)
1. **Unauthenticated Read**: `GET /users/uid_alice` with `auth == null`.
2. **Cross-User PII Read**: `GET /users/uid_alice` as authenticated `uid_bob`.
3. **Collection Enumeration (`list`)**: `LIST /users` as authenticated `uid_bob`.
4. **Unverified Email Write**: `CREATE /users/uid_alice` with `email_verified: false`.
5. **Email Spoofing Admin Bypass**: `GET /users/uid_alice` as `uid_eve` with `token.email == 'aulyasyukur@gmail.com'` and `email_verified: false`.
6. **Identity Spoofing on Create**: `CREATE /users/uid_alice` as `uid_bob` with `{ uid: 'uid_alice', ... }`.
7. **Shadow Field Injection on Create**: `CREATE /users/uid_alice` with extra field `isAdmin: true` or `role: 'admin'`.
8. **ID Poisoning**: `CREATE /users/../../etc/passwd` or 200-char junk document ID.
9. **Denial of Wallet String Overflow**: `CREATE /users/uid_alice` with `displayName` of 500 characters (`> 80`).
10. **Client-Forged Timestamp**: `CREATE /users/uid_alice` with `createdAt` not equal to `request.time`.
11. **Immutable Field Tampering on Update**: `UPDATE /users/uid_alice` modifying `createdAt` or `uid`.
12. **Value Poisoning on Update**: `UPDATE /users/uid_alice` changing `provider` to `'invalid_provider'` or `displayName` to boolean `true`.
