# Appointment Booking System

A full-stack appointment booking system with Google Calendar integration.

## Features

- **Public Appointment Form**: Users can book appointments with name, email, date/time, and notes
- **Google Calendar Integration**: Automatically creates calendar events and invites attendees
- **Admin Dashboard**: View all appointments and manage admin users
- **Authentication**: JWT-based admin authentication

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TailwindCSS
- **Backend**: NestJS, Prisma, PostgreSQL
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Running with Docker

1. Clone the repository
2. Create a `.env` file in the root directory (optional, defaults are provided)
3. Run the application:

```bash
docker-compose up --build
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Local Development

#### Backend (API)

```bash
cd apps/api
npm install
npm run start:dev
```

#### Frontend (Web)

```bash
cd apps/web
npm install
npm run dev
```

### Creating the First Admin User

Since there's no initial admin user, you'll need to create one:

```bash
cd apps/api
node create-admin.js
```

Enter your desired email and password when prompted.

Default credentials for testing:
- Email: `admin@example.com`
- Password: `admin123`

## Google Calendar Setup (Required)

Google Calendar integration is **required** for this application to function.

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**

### Step 2: Configure OAuth 2.0 Credentials
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Select **Web application**
4. Add the following URLs:

**Authorized JavaScript Origins:**
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

**Authorized Redirect URIs:**
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`
- **Crucial**: Also add `https://developers.google.com/oauthplayground` (required for generating refresh token)

### Step 3: Generate Refresh Token
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click ⚙️ icon -> Check **"Use your own OAuth credentials"** -> Enter Client ID & Secret
3. Select scopes: `calendar` and `calendar.events`
4. Authorize and **IMMEDIATELY** click "Exchange authorization code for tokens"
5. Copy the `refresh_token`

### Step 4: Configure Environment
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

### Troubleshooting
**Error: `deleted_client`**
- Your OAuth client was deleted or credentials are invalid.
- Solution: Create new credentials in Google Cloud Console and generate a new refresh token.

**Error: `redirect_uri_mismatch`**
- Ensure `https://developers.google.com/oauthplayground` is added to Authorized Redirect URIs in Google Cloud Console.

**Error: `invalid_grant`**
- The authorization code expired.
- Solution: In OAuth Playground, click "Exchange authorization code for tokens" immediately after authorizing.


### Quick Reference: OAuth URLs

| Environment | JavaScript Origins | Redirect URIs |
|------------|-------------------|---------------|
| **Development** | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
| **Production** | `https://yourdomain.com` | `https://yourdomain.com/api/auth/callback/google` |

## API Endpoints

### Public
- `POST /appointments` - Create a new appointment

### Protected (Requires JWT)
- `POST /auth/login` - Admin login
- `GET /auth/profile` - Get current user profile
- `GET /appointments` - List all appointments
- `GET /appointments/:id` - Get appointment details
- `POST /users` - Create a new admin user

## Environment Variables

### Root `.env`
```
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=appointment_db
```

### API `.env`
```
DATABASE_URL=postgresql://admin:admin123@localhost:5432/appointment_db?schema=public
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

### Web `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
.
├── apps/
│   ├── api/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── appointments/
│   │   │   ├── calendar/
│   │   │   └── prisma/
│   │   └── prisma/
│   │       └── schema.prisma
│   └── web/          # Next.js frontend
│       └── src/
│           └── app/
│               ├── page.tsx
│               └── admin/
├── docker-compose.yml
└── README.md
```

## License

MIT
