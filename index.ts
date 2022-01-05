import express, {Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
 
dotenv.config();

const app: Application = express();

if(!process.env.FRONTEND_URL){
    throw new Error('FRONTEND_URL environment variable is not defined');
}

app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});