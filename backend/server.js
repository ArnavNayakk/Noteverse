import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js'; 
import noteRoutes from './routes/noteRoutes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(port, () => console.log(`Server Started on Port ${port}`));
