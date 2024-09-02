import { matchedData, validationResult } from 'express-validator'
import { User } from '../db/mongoose/schemas/user.mjs'
import { hashPassword } from '../utils/helper.mjs'

export const register = async (request, response) => {
    const error = validationResult(request)
    if (!error.isEmpty()) {
        return response.status(400).send({ errors: error.array() })
    }
    try {
        const data = matchedData(request)
        data.password = hashPassword(data.password)

        const newUser = new User(data)
        const saveUser = await newUser.save()
        return response.status(201).send(saveUser)
    } catch (error) {
        return response.status(400).json({ message: error.message })
    }
}