import express from 'express'
import { register } from '../controllers/authControllers.mjs'
import passport from 'passport'
import { createUserValidationSchema } from '../utils/vallidationSchema.mjs'
const router = express.Router()
import {checkSchema} from 'express-validator';

router.post("/register", checkSchema(createUserValidationSchema), register)
router.post("/login", passport.authenticate('local'), (_, response) => {
    response.sendStatus(200)
})
router.get("/status", (request, response) => {
    console.log('Session', request.session)
    console.log('User', request.user)
    return request.user ? response.send(request.user) : response.sendStatus(401)
})
export default router