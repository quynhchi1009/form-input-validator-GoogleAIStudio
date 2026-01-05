# Full-Stack Validator App

A minimal full-stack application using React (Vite), Node.js (Express), and TypeScript in a monorepo structure.

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS (via CDN for simplicity).
- **Backend**: Node.js + Express + TypeScript. Handles API validation and serves frontend static files in production.
- **Deployment**: Single Docker container hosted on Google Cloud Run.

## Local Development

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Environment Setup**:
   - Create `frontend/.env` (see `frontend/.env.example`)
   - Create `backend/.env` (see `backend/.env.example`)

3. **Run**:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## GitHub Actions Deployment (Google Cloud Run)

This repo includes a workflow to deploy to Google Cloud Run.

### Prerequisites
1. A Google Cloud Project with billing enabled.
2. APIs enabled: Artifact Registry API, Cloud Run API.
3. An Artifact Registry Docker repository created.

### Secrets Configuration
Add the following Secrets to your GitHub Repository:
- `GCP_PROJECT_ID`: Your Google Cloud Project ID.
- `GCP_SA_KEY`: JSON key of a Service Account with `Cloud Run Admin` and `Artifact Registry Writer` roles.

### Deployment Logic
The `.github/workflows/deploy.yml` pipeline will:
1. Authenticate with Google Cloud.
2. Build the Docker image (combining frontend build and backend code).
3. Push to Artifact Registry.
4. Deploy to Cloud Run.

## Example API Usage

**Request:**
```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"value": "password123"}'
```

**Response:**
```json
{
  "valid": true,
  "reasons": []
}
```
