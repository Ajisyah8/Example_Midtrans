import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'  
}));


app.use(bodyParser.json());


app.use('/api', transactionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
