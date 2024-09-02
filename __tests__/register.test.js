import { register } from '../controllers/authControllers.mjs';
import { User } from '../db/mongoose/schemas/user.mjs'
import { hashPassword } from '../utils/helper.mjs'
import { matchedData, validationResult } from 'express-validator';
//mock dependencies
jest.mock('../db/mongoose/schemas/user.mjs')
jest.mock('../utils/helper.mjs')
jest.mock('express-validator')

describe('Register Controller', () => {
    let mockRequest
    let mockResponse

    beforeEach(() => {
        //reset mocks
        User.mockClear();
        hashPassword.mockClear();
        matchedData.mockClear();
        validationResult.mockClear();
    }
    )

    test('successful registration', async () => {
        mockRequest = {
            body: {
                username: 'testuser',
                password: 'password123'
            }
        }
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        }
        //mock successfull validation
        validationResult.mockReturnValue({ isEmpty: () => true })

        //mock matchedData
        matchedData.mockReturnValue({
            username: 'testuser',
            password: 'hashedpassword123'
        })

        //mock hash password
        hashPassword.mockReturnValue('hashedpassword123')

        //mock User.save
        const mockSave = jest.fn().mockResolvedValue({
            _id: "someId",
            username: 'testuser',
            password: 'hashedpassword123'
        })
        User.mockImplementation(() => ({
            save: mockSave
        }))

        await register(mockRequest, mockResponse);

        expect(validationResult).toHaveBeenCalledWith(mockRequest);
        expect(matchedData).toHaveBeenCalledWith(mockRequest);
        expect(hashPassword).toHaveBeenCalledWith('hashedpassword123');
        expect(User).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'hashedpassword123'
        });

        expect(mockSave).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            _id: 'someId',
            username: 'testuser',
            password: 'hashedpassword123'
        });
    })

    test('invalid credentials', async () => {
        jest.mock('express-validator', () => ({
            validationResult: jest.fn(),
            matchedData: jest.fn(),
        }));

        let mockinvalidRequest = {}
        let mockInvalidResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        }

        //mock unsuccessful validation
        validationResult.mockReturnValue({
            isEmpty: () => false, array: () => [{ msg: 'Validation error' }]
        })

        await register(mockinvalidRequest, mockInvalidResponse);


        expect(validationResult).toHaveBeenCalled()
        expect(validationResult).toHaveBeenCalledWith(mockinvalidRequest);
        expect(mockInvalidResponse.status).toHaveBeenCalledWith(400);
        expect(mockInvalidResponse.send).toHaveBeenCalledWith({
            errors: [{ msg: 'Validation error' }]
        });
    })

    test('error message when save fails', async () => {
        let req
        let res
        req = {
            body: { username: 'testUser', password: 'password123' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        validationResult.mockReturnValue({
            isEmpty: () => true,
        });

        // Mock matchedData to return the body data
        matchedData.mockReturnValue(req.body);

        // Mock User and simulate save throwing an error
        const saveMock = jest.fn().mockRejectedValue(new Error('Database save failed'));
        User.mockImplementation(() => ({
            save: saveMock,
        }));

        await register(req, res);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database save failed' });
    })
})
