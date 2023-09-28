const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersControllers {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkIfUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    );

    if (checkIfUserExists) {
      throw new AppError('Este email já está em uso');
    }

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    response.status(201).json({ name, email, password });
  }
}

module.exports = UsersControllers;
