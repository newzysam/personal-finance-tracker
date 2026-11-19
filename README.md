# Personal Finance Tracker

A private, beginner-friendly React Native and MongoDB app for manually recording income and expenses as reports. Each report has a name, type, amount, and date. The API calculates totals, current balance, and the balance after each report.

## Moni Check visual identity

**Moni Check** is the selected product name: direct, friendly, and easy to understand at a glance. Its logo combines a person raising visible coins, an ascending chart, and a check mark to signal money management, expense tracking, awareness, trust, and growth. The horizontal logo is an unboxed vector; the square mobile icon uses a high-contrast navy background.

- Horizontal logo (SVG): `mobile/assets/moni-check-logo.svg`
- Mobile app icon (1024 × 1024 PNG): `mobile/assets/moni-check-icon.png`
- Android adaptive foreground (transparent PNG): `mobile/assets/moni-check-mark.png`
- Editable vector mark: `mobile/assets/moni-check-mark.svg`

Name and domain availability have not been legally or commercially verified.

| Role | Color | Hex |
|---|---|---|
| Trustworthy primary blue | Blue | `#2457C5` |
| Deep balance-card blue | Navy | `#173B70` |
| Income | Emerald | `#087A55` |
| Warning | Orange | `#B45309` |
| Expense / error | Soft red | `#BE3A48` |
| Light background | Cloud gray | `#F5F7FA` |
| Surface | White | `#FFFFFF` |
| Main text | Ink navy | `#172B4D` |
| Supporting text | Slate | `#5C6B80` |
| Borders | Mist | `#E2E8F0` |

The interface uses Inter with platform system fallbacks (Roboto on Android and the system UI font on iOS) for a familiar, readable mobile experience without adding a remote font dependency. Use semibold weights for labels, bold weights for section headings, and tabular/lining numerals for money when available.

### Screen experience

- **Dashboard:** Balance is the hero; income and expense summaries sit together beneath it. Recent activity uses readable, separated rows with clear IN/OUT labels, signed amounts, dates, and running balances. The empty state gives a direct first action.
- **Report entry:** Name, type, amount, and date are grouped in one card. Inline field errors, a disabled save action, and a concise name hint help prevent mistakes before submission.
- **Income and expense views:** These are type filters within Reports rather than separate navigation destinations, keeping the small app simple while making each kind of activity easy to review.
- **Reports:** Filter chips distinguish all, income, and expense records; rows retain their chronological balance context and open directly for editing.

Screens are centered with a readable maximum width on larger displays, while using fluid widths and touch-friendly controls on phones. Color is paired with text labels and signs so income and expense are not distinguished by color alone.

## Project structure

See `Folder structure.html` for the complete visual map.

- `backend/` — Express REST API, MongoDB models, JWT authentication, password reset.
- `mobile/` — Expo React Native app using React Navigation and Context API.

## Prerequisites

- Node.js 18+
- MongoDB Community Server or MongoDB Atlas
- Expo Go on Android/iOS, or an emulator

## Backend setup

```powershell
cd "C:\Users\Dell\Desktop\Personal Mobile App Tracker\backend"
npm install
Copy-Item .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET
npm run dev
```

Health check: `http://localhost:5000/api/health`

Use a strong, unique `JWT_SECRET`. Keep `.env` private. In `development`, when SMTP is not configured, reset codes are logged by the backend and returned to the app for local testing. Configure SMTP for other environments; code disclosure is limited to explicit development/test mode.

## Mobile setup

```powershell
cd "C:\Users\Dell\Desktop\Personal Mobile App Tracker\mobile"
npm install
Copy-Item .env.example .env
# Set EXPO_PUBLIC_API_URL to http://YOUR_LAN_IP:5000/api for a physical device
npx expo start
```

For a browser preview instead of Expo Go, run `npx expo start --web` and open the local URL printed by Expo. Web platform dependencies are included.

## Database schema

### User

| Field | Type | Rules |
|---|---|---|
| name | String | required, 100 characters max |
| email | String | required, unique, lowercase |
| password | String | required, bcrypt hash, minimum 8 characters |
| resetTokenHash | String | private SHA-256 reset code hash |
| resetTokenExpires | Date | reset code expiry |

### Transaction

| Field | Type | Rules |
|---|---|---|
| user | ObjectId | required, indexed, references User |
| amount | Number | required, greater than zero |
| type | String | `income` or `expense` |
| name | String | required, 120 characters max |
| date | Date | required |

## Authentication API

- `POST /api/auth/register` — body: `{name,email,password,confirmPassword}`
- `POST /api/auth/login` — body: `{email,password}`
- `GET /api/auth/me` — bearer token required
- `POST /api/auth/forgot-password` — body: `{email}`
- `POST /api/auth/reset-password` — body: `{email,code,password,confirmPassword}`

Successful register/login responses contain a JWT token and user profile. Include the JWT in the Authorization header for report routes. Unknown reset emails return a clear `404` message; invalid or expired codes are rejected.

## Report API

- `GET /api/transactions/summary` — total income, total expenses, and balance
- `GET /api/transactions` — every report newest first, with its running balance, plus the summary
- `POST /api/transactions` — create
- `PUT /api/transactions/:id` — edit
- `DELETE /api/transactions/:id` — delete

Create/edit body:

```json
{"name":"Market shopping","type":"expense","amount":18500,"date":"2026-11-19"}
```

## Report validation and calculation rules

- Name is trimmed, required, starts with a letter, is limited to 120 characters, and cannot contain numbers or unsupported symbols.
- Type must be exactly `income` or `expense`.
- Amount must be a positive finite JSON number; numeric strings are not accepted by the API.
- Date must be a real calendar date written as `YYYY-MM-DD`. Future dates are allowed because no rule in this app prohibits them.
- Income adds to balance; expense subtracts from balance. Each report's running balance follows date order. Identical reports are treated as separate entries and each affects totals once.

## Screen wireframes

### Sign In

- App title and welcome copy
- Email and password fields
- Sign-in button, forgot-password link, create-account link

### Create Account

- Name, email, and password fields
- Confirm-password field, create-account button, and back link

### Forgot Password

- Email field and Send Code button
- Helpful error when the account email is unknown
- Reset code field after a code is generated or delivered

### Recover Password

- Reset code, new password, and confirm-password fields
- Invalid or expired codes and mismatched passwords are rejected
- After success, return to Sign In; the old password no longer authenticates

### Previous Reports (Dashboard)

- Welcome/name and sign-out/theme controls
- Large current-balance card
- Side-by-side income and expense cards
- Reports listed newest first, with income/expense clearly distinguished
- Floating Add Report button

### Previous Reports List

- Every report with name, type, amount, date, and its calculated running balance
- Tap a report to edit it

### Add/Edit Report

- Name, Income/Expense choice, amount, and date fields
- Date defaults to today and can be changed
- Invalid names, amounts, and dates show inline errors; Save stays disabled until all fields are valid
- Edit view also includes delete and unsaved changes can be cancelled by going back

## User privacy and balance behavior

MongoDB reports are indexed and queried by `req.userId` from a verified JWT. The backend also checks ownership on update and delete. Every report mutation recalculates totals, and the app refreshes its Context state after create, edit, and delete.

Balance is never entered by the user: current balance is total income minus total expenses. The history endpoint calculates each report's running balance from the full account history, then returns reports newest first.

## Example data

| Date | Name | Type | Amount | Balance after report |
|---|---|---|---:|---:|
| 01 Nov 2026 | Monthly salary | Income | 150,000 | 150,000 |
| 03 Nov 2026 | House rent | Expense | 60,000 | 90,000 |
| 07 Nov 2026 | Market shopping | Expense | 18,500 | 71,500 |
| 12 Nov 2026 | Freelance design job | Income | 40,000 | 111,500 |
| 15 Nov 2026 | Electricity bill | Expense | 9,200 | 102,300 |
