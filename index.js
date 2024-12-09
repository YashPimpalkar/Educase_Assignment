import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import schoolRoutes from './routes/schoolRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(bodyParser.json());

// Use the routes
app.use('/api', schoolRoutes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
