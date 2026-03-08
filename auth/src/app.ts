import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentuserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { errorHandler , NotFoundError } from '@dj_ticketing/common';

import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV!=='test'
}));

app.use(currentuserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (req,res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export {app};