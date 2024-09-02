import expresss, { response } from "express";
import productRoutes from './routes/productRoutes.mjs'
import authRoutes from './routes/authRoutes.mjs'
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./strategies/localStrategy.mjs"
const app = expresss()
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(`Error: ${err}`))
    
app.use(expresss.json())
app.set('view engine', 'ejs')
app.use(expresss.static('public'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    })
}))
app.use(passport.authenticate('session'))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', productRoutes)
app.use('/api', authRoutes)

export default app
const PORT = process.env.PORT || 3000


app.get('/', (request, response) => {
    response.send('Welcome to WearIt Home')
})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})
