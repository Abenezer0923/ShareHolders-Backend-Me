import path from 'path';
import express from 'express';
import cors from "cors";
import ConnDB from './config/db.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import dotenv from 'dotenv';
import routeAPI from './Routers/authRouter.js';
import cookieParser from 'cookie-parser';
import routeShareHolders from "./Routers/shareHolderRouter.js";
import uploadRoutes from './Routers/uploadRoutes.js';

dotenv.config();

const port = process.env.PORT || 4000

ConnDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use the cors middleware before defining your routes


const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};



app.use(cors(corsOptions));


app.use("/api/auth", routeAPI);
app.use('/api/upload', uploadRoutes) 
app.use("/api/shareHolders", routeShareHolders);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
}
  
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`the server runn on ${port}`));

