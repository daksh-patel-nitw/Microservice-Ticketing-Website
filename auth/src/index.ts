import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { currentuserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';

const app=express();
app.use(json());

app.use(currentuserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*',async()=>{
    throw new NotFoundError
})

app.use(errorHandler);

const start = async()=>{
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to mongdb');
    }catch(error){
        console.log(error)
    }
    app.listen(3000,()=>{
        console.log('Listening on port 3000');
    })
}

start();