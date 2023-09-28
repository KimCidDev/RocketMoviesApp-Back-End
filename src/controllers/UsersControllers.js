const { hash } = require('bcryptjs');
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

    const hashedPassword = await hash(password, 8);

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    response.status(201).json({ name, email, password });
  }

  async update(request, response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM USERS WHERE id = (?)', [id]);

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM USERS WHERE email = (?)',
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
      throw new AppError('Este email já está em uso');
    }

    user.name = name;
    user.email = email;

    await database.run(
      `
    UPDATE users SET
    name = ?,
    email = ?,
    updated_at = ?,
    WHERE id = ?`[(user.name, user.email, new Date(), id)]
    );

    return response.json({});
  }
}

module.exports = UsersControllers;
