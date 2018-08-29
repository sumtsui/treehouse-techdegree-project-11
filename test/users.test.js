const request = require('supertest');
const User = require('../src/models/user.model');

let server;

describe('/api/users', () => {

  let token;
  const wrongToken = 'vvvvv';

  beforeAll(async () => {
    server = require('../src/index');
    user = new User({
      fullName: 'Bruce Banner',
      email: 'smash@pp.com',
      password: 'ppppp'
    });
    await user.save();
    token = user.generateAuthToken();
  });
  afterEach(async () => {
    server.close();
    await User.remove({});
  });

  describe('GET / with no credentials provided', () => {
    it('should return 401', () => {
      request(server)
        .get('/api/users')
        .then(res => expect(res.status).toBe(401))
        .catch(console.log);
    });
  });

  describe('GET / with incorrect credentials provided', () => {
    it('should return 400', () => {
      request(server)
        .get('/api/users')
        .set('x-auth-token', wrongToken)
        .then(res => expect(res.status).toBe(400))
        .catch(console.log);;
    });
  });

  describe('GET / with correct credentials provided', () => {
    it('should return corresponding user document', () => {
      request(server)
        .get('/api/users')
        .set('x-auth-token', token)
        .then(res => {
          expect(res.body).objectContaining({
            fullName: expect.any(String),
            email: expect.any(String)
          });
          expect(res.body).not.toHaveProperty('password');
        })
        .catch(console.log);;
    });
  });
})