import express from 'express';
import healthRoute from './api/health';
import transferRoutes from './api/transfer.route';

const app = express();

/** Server Port */
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

/** To fix CORS Errors  */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

/** Health Route */
app.get('/health', healthRoute);

/** Transfer Routes */
app.use('/api', transferRoutes);

/** Server Running */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
