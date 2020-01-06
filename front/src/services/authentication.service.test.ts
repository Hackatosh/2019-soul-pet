import { httpClient, history } from "../helpers";
import { User } from "../models";
import { AuthenticationService } from "./authentication.service";

const user: User = {
    id: 1,
    username: 'testuser',
    email: 'testuser@test.ts',
    token: 'aaaa'
};

const post = jest.spyOn(httpClient, "post");
const historySpy = jest.spyOn(history, "push");

beforeEach(() => {
    AuthenticationService.logout();
    historySpy.mockClear();
})

test('Successful login', async () => {
    post.mockResolvedValueOnce(user);
    await AuthenticationService.login(user.email, 'password').then(u => {
        expect(u).toBe(user);
        expect(historySpy).toHaveBeenCalled();
        expect(AuthenticationService.isLoggedIn).toBe(true);
    });
});

test('Failed login', async () => {
    post.mockRejectedValueOnce({ message: 'Wrong password' });
    await AuthenticationService.login(user.email, 'wrongpassword').catch(e => {
        expect(e).toBe('Identifiants incorrects');
        expect(historySpy).not.toHaveBeenCalled();
        expect(AuthenticationService.isLoggedIn).toBe(false);
    });
    expect.assertions(3);
});

test('Register success', async () => {
    post.mockResolvedValueOnce(user);
    await AuthenticationService.register('usertest', 'testuser@test.ts', 'password').then(u => {
        expect(u).toBe(user);
    });
});

test('Register failure', async () => {
    post.mockRejectedValueOnce({ message: 'E-mail already exists' });
    await AuthenticationService.register('usertest', 'existingemail@test.ts', 'password').catch(e => {
        expect(e).toBe('Création du compte impossible ; veuillez réessayer.');
        expect(historySpy).not.toHaveBeenCalled();
    });
    expect.assertions(2);
});

test('Retrieve user', async () => {
    expect(AuthenticationService.user).toStrictEqual({} as User);
    post.mockResolvedValueOnce(user);
    await AuthenticationService.login('testemail@test.ts', 'password');
    expect(AuthenticationService.user).toStrictEqual(user);
});
