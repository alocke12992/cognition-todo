import express, { Application } from 'express';
import cors from 'cors';
import { RegisterRoutes } from './generated/routes';
import { runMigrationIfNeeded } from './migrations/migrate-json-to-sqlite';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

runMigrationIfNeeded();

RegisterRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
