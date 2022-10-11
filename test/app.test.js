// const jest  =  require('jest');
const request  = require('supertest')
const makeApp = require('../app');


const createUser = jest.fn();
const app = makeApp({ createUser });

describe('POST /users', () => {
  beforeEach(() => {
    createUser.mockReset();
  });

  describe('when passed a username and password', () => {
    test('should save the username and password in the database', async () => {
      const body = {
        email: 'user3@gmail.com',
        first_name: 'victor',
        last_name: 'ude',
        password: 'ubo456victor',
        password_confirm: 'ubo456victor',
      };
      const response = await request(app).post('/users').send(body);

      expect(createUser.mock.calls[0][0]).toBe(body.email);
      expect(createUser.mock.calls[0][1]).toBe(body.first_name);
      expect(createUser.mock.calls[0][2]).toBe(body.last_name);
      expect(createUser.mock.calls[0][3]).toBe(body.password);
      expect(createUser.mock.calls[0][4]).toBe(body.password_confirm);
    });
  });
});
