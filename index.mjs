import expresss, { response } from "express";
import { pool } from "./db/db.mjs";
import { validationResult, matchedData, checkSchema, query, body } from "express-validator";
import productRoutes from './routes/productRoutes.mjs'

const app = expresss()

app.use(expresss.json())
app.use('/api', productRoutes)
app.set('view engine', 'ejs')
app.use(expresss.static('public'))

export default app
const PORT = process.env.PORT || 3000

app.use('/api', productRoutes)

app.get('/', (request, response) => {
    response.send('Welcome to WearIt Home')
})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})
