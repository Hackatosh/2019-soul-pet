import {compareUserPassword} from '../password';
import { User } from '../../database/models/user';

const user = new User();
    user.hashedPassword = '$2a$10$Vc1hBNQoUvXNPqPrnj/FV.RmE0ZY3Eo5mNF4/wxs0kxz5wdGph8gy';

test('Correct passowrd', () => {
    compareUserPassword(user, 'dev123').then(result => {
        expect(result).toBe(true);
    });
});

test('Empty passowrd', () => {
    compareUserPassword(user, '').then(result => {
        expect(result).toBe(false);
    });
});

test('Wrong passowrd', () => {
    compareUserPassword(user, 'ofezfzefjze').then(result => {
        expect(result).toBe(false);
    });
});
