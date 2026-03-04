import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

interface UserPayload{
    id:String,
    email:String
}

declare global{
    namespace Express{
        interface Request{
            currentUser?:UserPayload
        }
    }
}

export const requireAuth= (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError;
    }

    next();
}