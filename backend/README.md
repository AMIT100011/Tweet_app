# Mini Tweet App — Backend

Django REST API backend for the Mini Tweet App, using Supabase for auth and PostgreSQL.

---

## Setup Instructions

### 1. Navigate into the backend folder

```bash
cd "my tweetapp/backend"
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create your .env file

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```
SECRET_KEY=your-django-secret-key
DEBUG=True

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-db-password
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

> **Where to find SUPABASE_JWT_SECRET:**
> Supabase Dashboard → Project Settings → API → JWT Secret

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Start the development server

```bash
python manage.py runserver
```

API is now live at `http://localhost:8000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sync-user` | Sync Supabase user, auto-create profile |
| GET | `/api/profile/me` | Get current user's profile |
| POST | `/api/tweets/` | Create a tweet |
| GET | `/api/tweets/` | Home feed (paginated) |
| GET | `/api/tweets/me` | My tweets (paginated) |
| POST | `/api/tweets/{id}/like` | Toggle like on a tweet |
| GET | `/api/tweets/{id}/comments` | Get comments for a tweet |
| POST | `/api/tweets/{id}/comments` | Post a comment |

All endpoints require `Authorization: Bearer <supabase_jwt>` header.

---

## Pagination

Feed endpoints support:
- `?page=1` — page number
- `?limit=20` — results per page (max 50)

---

## Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
├── tweetapp/
│   ├── settings/
│   │   └── base.py
│   ├── urls.py
│   └── wsgi.py
├── authentication/
│   ├── backends.py   ← Supabase JWT verification
│   ├── views.py
│   └── urls.py
├── profiles/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
└── tweets/
    ├── models.py
    ├── serializers.py
    ├── views.py
    └── urls.py
```
