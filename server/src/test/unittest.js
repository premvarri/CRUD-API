
import * as chai from 'chai';
const { expect } = chai;
import chaiHttp from 'chai-http';
const app = require('../app')
chai.use(chaiHttp)

chai.should()

describe('API Tests', () => {
    beforeEach(() => {
      usersController.users = [];
    });
  
    it('Scenario 1: Get all records with a GET api/users request (an empty array is expected)', async () => {
      const res = await chai.request(app).get('/api/users');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  
    it('Scenario 2: A new object is created by a POST api/users request (a response containing a newly created record is expected)', async () => {
      const newUser = { username: 'TestUser', age: 25, hobbies: ['Reading', 'Coding'] };
      const res = await chai.request(app).post('/api/users').send(newUser);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.username).to.equal(newUser.username);
    });
  
    it('Scenario 3: With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
      const newUser = usersController.createUser({ username: 'TestUser', age: 25, hobbies: ['Reading', 'Coding'] });
      const res = await chai.request(app).get(`/api/users/${newUser.id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(newUser);
    });
  
    it('Scenario 4: We try to update the created record with a PUT api/users/{userId} request (a response is expected containing an updated object with the same id)', async () => {
      const newUser = usersController.createUser({ username: 'TestUser', age: 25, hobbies: ['Reading', 'Coding'] });
      const updatedData = { age: 26, hobbies: ['Reading', 'Coding', 'Gaming'] };
      const res = await chai.request(app).put(`/api/users/${newUser.id}`).send(updatedData);
      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(newUser.id);
      expect(res.body.age).to.equal(updatedData.age);
      expect(res.body.hobbies).to.deep.equal(updatedData.hobbies);
    });
  
    it('Scenario 5: With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
      const newUser = usersController.createUser({ username: 'TestUser', age: 25, hobbies: ['Reading', 'Coding'] });
      const res = await chai.request(app).delete(`/api/users/${newUser.id}`);
      expect(res).to.have.status(204);
      expect(usersController.getUserById(newUser.id)).to.be.null;
    });
  
    it('Scenario 6: With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
      const newUser = usersController.createUser({ username: 'TestUser', age: 25, hobbies: ['Reading', 'Coding'] });
      usersController.deleteUser(newUser.id);
      const res = await chai.request(app).get(`/api/users/${newUser.id}`);
      expect(res).to.have.status(404);
    });
  });
