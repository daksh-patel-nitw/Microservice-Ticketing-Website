import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
], 
validateRequest
,async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const exsitingUser = await User.findOne({ email });

    if (exsitingUser) {
        console.log('Email in use for', exsitingUser.email);
        throw new BadRequestError('Email aready in use');;
    }

    const user = User.build({ email, password });
    await user.save();

    //kubectl create secret generic jwt-secret --from-literal=JWT_KEY="har har mahadev"
    //Genereate JWT Token
    const userJwt = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_KEY!
    );

    //Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send({user});
});

export { router as signUpRouter };