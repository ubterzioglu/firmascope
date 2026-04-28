# Instagram Publisher Service

Kucuk bir Node/Express servisidir. OpenClaw'dan gelen istekleri alir, Instagram Graph API ile image veya reel publish eder ve sonucunu Supabase'e loglar.

## Endpoint

`POST /instagram/post`

Headers:

- `Authorization: Bearer <OPENCLAW_API_TOKEN>`
- `Content-Type: application/json`

Body:

```json
{
  "media_type": "IMAGE",
  "media_url": "https://cdn.example.com/post.jpg",
  "caption": "Bugunun postu"
}
```

## Env Vars

- `PORT=3001`
- `GRAPH_API_VERSION=v19.0`
- `IG_USER_ID=your-instagram-user-id`
- `IG_ACCESS_TOKEN=your-long-lived-access-token`
- `OPENCLAW_API_TOKEN=shared-secret-between-openclaw-and-service`
- `SUPABASE_URL=https://your-project.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`
- `REEL_STATUS_POLL_INTERVAL_MS=3000`
- `REEL_STATUS_MAX_ATTEMPTS=10`

## Local Run

```bash
npm install
npm test
npm start
```

## Coolify

- Bu klasoru ayri servis olarak deploy edin.
- Build command: `npm install`
- Start command: `npm start`
- Public URL ornegi: `https://hooks.your-domain.com`
- Health check: `GET /health`
