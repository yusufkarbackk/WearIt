import passport from "passport";
import { Strategy } from 'passport-local';
import { User } from '../db/mongoose/schemas/user.mjs';
import { comparePassword } from "../utils/helper.mjs";

passport.serializeUser((user, done) => {
    console.log('serialize user')
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log(`desirializing user id : ${id}`)
    try {
        const findUser = await User.findById(id)
        if (!findUser) throw new Error("User not found")
        done(null, findUser)
    } catch (error) {
        done(error, null)
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username })
            if (!findUser) throw new Error("User not found")
            if (!comparePassword(password, findUser.password)) throw new Error("Bad credentials")
            done(null, findUser)
        } catch (error) {
            done(error, null)
        }
    })
)