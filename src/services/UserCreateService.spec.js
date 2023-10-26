const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');
const AppError = require('../utils/AppError');

describe('UserCreateService', () => {
  let userRepositoryInMemory = null;
  let userCreateService = null;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userCreateService = new UserCreateService(userRepositoryInMemory);
  });

  it('user is to be created', async () => {
    const user = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123'
    };
    const userCreated = await userCreateService.execute(user);

    expect(userCreated).toHaveProperty('id');
  });

  it('testing existing email', async () => {
    const user1 = {
      name: 'User Test 1',
      email: 'user@test.com',
      password: '123'
    };
    const userWithSameEmail = {
      name: 'User Test 2',
      email: 'user@test.com',
      password: '456'
    };

    await userCreateService.execute(user1);
    await expect(userCreateService.execute(user1)).rejects.toEqual(
      new AppError('Este email já está em uso')
    );
  });
});
