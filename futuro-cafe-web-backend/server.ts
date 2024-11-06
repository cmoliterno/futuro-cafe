
import express from 'express';
import dotenv from 'dotenv';
import routes from './src/config/routes';
import { setupAssociations } from './src/models/associations';

setupAssociations();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
