const { config } = require('dotenv');
const request = require('supertest')
const app = require('../app');
const db = require('../knex/knex');

describe('POST /users', () => {
  const apiPrefix = '/api/v1';

  beforeEach(() => {
    config();
  });

  afterEach(async () => {
    // clear the DB
    await db('users').del();
  });

  describe('when passed a email and password', () => {
    it('should save the email and password in the database', async () => {
      const payload = {
        email: 'user111@gmail.com',
        first_name: 'victor',
        last_name: 'ude',
        password: 'ubo456victor',
        password_confirm: 'ubo456victor',
      };
      const { statusCode, body } = await request(app).post(`${apiPrefix}/user`).send(payload);

      // fetch the user from database
      const [user] = await db('users').where('email', payload.email);
      // compare with the payload sent

      expect(statusCode).toBe(201);
      expect(body.status).toStrictEqual('success');
      expect(body.token).toBeDefined();
      expect(body.data).toBeDefined();
      expect(user.email).toStrictEqual(payload.email);
      expect(user.id).toStrictEqual(body.data.user.id);
    });
  });
});


