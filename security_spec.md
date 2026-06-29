# MIRCA CONTROL Security Spec: Firestore Rules Zero-Trust Blueprint

This specification details the security invariants and validation guidelines designed for the **MIRCA CONTROL** database architecture.

---

## 🔒 1. Core Data Invariants & Access Control Matrices

| Collection | Path Path | Read Access | Write Access (Create/Update/Delete) | Key Constraints / Required Fields |
| :--- | :--- | :--- | :--- | :--- |
| **products** | `/products/{id}` | Public | Super-Admin / Employee (Auth) | Must match `Product` schema. `id`, `name`, `category`, `price` (if visible) |
| **projects** | `/projects/{id}` | Public | Super-Admin / Employee (Auth) | Must match `Project` schema. `id`, `title`, `afterImage` |
| **gallery** | `/gallery/{id}` | Public | Super-Admin / Employee (Auth) | Must match `GalleryItem` schema. |
| **quotations** | `/quotations/{id}` | Owner (by email) / Employee / Admin | Public (Create) / Admin (Update/Delete) | Status can only change through valid transitions. Owner cannot edit after terminal state. |
| **categories** | `/categories/{id}` | Public | Super-Admin only | Controls global dropdown categories. |
| **services** | `/services/{id}` | Public | Super-Admin only | Services and benefits. |
| **shoppingRequests**| `/shoppingRequests/{id}`| Owner (by email) / Emp / Admin | Public (Create) / Admin (Update/Delete) | Cart items submissions. |
| **banners** | `/banners/{id}` | Public | Super-Admin only | Carousel homepage. |
| **websiteContent** | `/websiteContent/{id}` | Public | Super-Admin only | Mission, Vision, Values, Hours, and Phone. |
| **testimonials** | `/testimonials/{id}` | Public | Super-Admin only | Customer reviews. |
| **partners** | `/partners/{id}` | Public | Super-Admin only | Sub-logos displaying credible clients. |
| **settings** | `/settings/{id}` | Public | Super-Admin only | Site name, SEO descriptive titles. |
| **activityLogs** | `/activityLogs/{id}` | Super-Admin only | Server / Admin (Appending log entries) | Immutable once created. No updates or deletions allowed. |
| **users** | `/users/{id}` | Logged-In User / Admin | Owner (Updates self profile) / Super-Admin | Users cannot self-escalate `role` field from `employee` to `admin`. |

---

## ☣️ 2. The "Dirty Dozen" Payloads (Exploit Scenarios)

These represent the 12 attack vectors designed to subvert typical validation filters. The deployed `firestore.rules` must successfully block ALL of these vectors with `PERMISSION_DENIED`:

### Exploit 1: User Self-Escalation
*   **Payload**: User `employee-uid` sets `role = 'admin'` in `/users/employee-uid`.
*   **Vulnerability**: Lacking rules validation allowing arbitrary writes to public user documents.

### Exploit 2: Price Poisoning
*   **Payload**: Attacker overwrites `/products/sec-01` with `price = -99999` or `price = 'free'`.
*   **Vulnerability**: No type-checking or minimum boundary boundaries.

### Exploit 3: Activity Log Erasure
*   **Payload**: Malicious actor issues `delete` request to `/activityLogs/log-123` to cover their tracks.
*   **Vulnerability**: Allowing delete operations on administrative streams.

### Exploit 4: Log Modification (Spoofing)
*   **Payload**: Operator updates log timestamp to 2012 or changes user field of `/activityLogs/log-456`.
*   **Vulnerability**: Timestamps not checked against `request.time`.

### Exploit 5: Invalid ID Injection (Resource Poisoning)
*   **Payload**: Creation of `/projects/` with a 2MB non-alphanumeric unicode string as ID.
*   **Vulnerability**: No ID length or character check (`isValidId`).

### Exploit 6: State Shortcutting
*   **Payload**: Bypassing triaging, client updates `/quotations/quote-001` with `status = 'completed'` directly.
*   **Vulnerability**: No field differences / `affectedKeys()` controls.

### Exploit 7: PII Scraping By Guests
*   **Payload**: Non-authenticated user queries `/quotations`.
*   **Vulnerability**: Lack of rule-enforced query parameters checking for owner email or technician state.

### Exploit 8: Brand Spoofing
*   **Payload**: Attacker uploads malicious content into CMS text block in `/websiteContent/general-cms`.
*   **Vulnerability**: Allowing write access to anyone on website content config document.

### Exploit 9: Category Order Corrupting
*   **Payload**: Attacker tries to set category order `displayOrder = "first"` (string rather than number).
*   **Vulnerability**: Schema/type validation gaps.

### Exploit 10: Anonymous Orphaned Quotations
*   **Payload**: Bot posts a quotation request with empty `name` and missing `email`.
*   **Vulnerability**: Non-empty requirements for lead forms.

### Exploit 11: Timestamp Forgery
*   **Payload**: Forging `/quotations/quote-005` creation with a client-supplied timestamp `createdAt = '2030-01-01T00:00:00Z'`.
*   **Vulnerability**: Trusting client payload dates over `request.time`.

### Exploit 12: Carousel Hijack
*   **Payload**: Update homepage banners with link pointing to a phishing page.
*   **Vulnerability**: Open write access.

---

## 🧪 3. Security Rules Verification Strategy

A secure `firestore.rules` file is created matching the invariants. Let's draft the fortress ruleset.
