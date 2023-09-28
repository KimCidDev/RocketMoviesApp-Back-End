const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersControllers {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkIfUserExists = await database.get(
      'SELECT FROM users WHERE email = (?)',
      email
    );

    if (!checkIfUserExists) {
      throw new AppError('O usuário não existe');
    }

    response.status(201).json({ name, email, password });
  }
}

module.exports = UsersControllers;
