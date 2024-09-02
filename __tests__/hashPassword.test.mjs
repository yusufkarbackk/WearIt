import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../utils/helper.mjs";

describe('Password Utils', () => {
    const plainPassword = 'examplePassword123';

    it('should hash a password correctly', () => {
        // Hash the password
        const hashedPassword = hashPassword(plainPassword);

        // The hashed password should not be the same as the plain password
        expect(hashedPassword).not.toBe(plainPassword);

        // The hashed password should be a string of a certain length (bcrypt hash length is 60)
        expect(hashedPassword).toHaveLength(60);
    });

    it('should compare hashed and plain passwords correctly', () => {
        const hashedPassword = hashPassword(plainPassword);

        // The comparePassword function should return true for correct passwords
        expect(comparePassword(plainPassword, hashedPassword)).toBe(true);

        // The comparePassword function should return false for incorrect passwords
        expect(comparePassword('wrongPassword', hashedPassword)).toBe(false);
    });

    it('should call bcrypt functions with correct arguments', () => {
        const saltSpy = jest.spyOn(bcrypt, 'genSaltSync');
        const hashSpy = jest.spyOn(bcrypt, 'hashSync');

        hashPassword(plainPassword);

        // Check that genSaltSync was called with the correct number of salt rounds
        expect(saltSpy).toHaveBeenCalledWith(10);

        // Check that hashSync was called with the correct arguments
        expect(hashSpy).toHaveBeenCalledWith(plainPassword, expect.any(String));

        // Restore the original implementations of these functions
        saltSpy.mockRestore();
        hashSpy.mockRestore();
    });
});
