import dotenv from 'dotenv';
dotenv.config({ override: true });

import app from './src/app.js';
import connectDB from './src/config/db.js';
import { TestAi } from './src/services/ai.service.js';

const PORT = process.env.PORT || 3000;

// TestAi().catch(error => {
//   console.error('AI test failed during startup:', error.message);
// });






const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
