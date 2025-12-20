import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const secretkey = process.env.JWT_SECRET

