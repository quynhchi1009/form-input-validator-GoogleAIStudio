import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(">>> SERVER FILE LOADED <<<");

// Middleware
// Enable CORS for development (React runs on 5173, Express on 3000)
if (NODE_ENV === 'development') {
  app.use(cors());
}

app.use(express.json() as any);

// Validation Interface
interface ValidationRequest {
  value: string;
}

interface ValidationResponse {
  valid: boolean;
  reasons: string[];
}

// API Routes
app.post('/api/validate', (req: express.Request, res: express.Response) => {
  // Cast to any to avoid "Property 'body' does not exist" type issues
  const body = (req as any).body as ValidationRequest;
  
  if (!body || typeof body.value !== 'string') {
    return (res as any).status(400).json({ error: 'Missing or invalid "value" field' });
  }

  const input = body.value;
  const reasons: string[] = [];

  // Rule 1: Length > 8
  if (input.length <= 8) {
    reasons.push('too_short');
  }

  // Rule 2: Contains at least one digit
  if (!/\d/.test(input)) {
    reasons.push('no_digit');
  }

  const isValid = reasons.length === 0;

  const response: ValidationResponse = {
    valid: isValid,
    reasons: reasons
  };

  return (res as any).status(200).json(response);
});

  app.get("/", (_req, res) => {
  res.status(200).send("Backend is running. Use POST /api/validate");
  });
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

// Production: Serve Frontend Static Files
if (NODE_ENV === 'production') {
  // In Docker: server is at /app/dist/server.js, frontend is at /app/frontend/dist
  // path.join(__dirname, '../frontend/dist') resolves to /app/frontend/dist
  const staticPath = path.join(__dirname, '../frontend/dist');
  
  app.use(express.static(staticPath) as any);

  // SPA Fallback
  app.get('*', (req: express.Request, res: express.Response) => {
    (res as any).sendFile(path.join(staticPath, 'index.html'));
  });

}

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});