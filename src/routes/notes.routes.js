const { Router } = require('express');
const NotesController = require('../controllers/NotesControllers');

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.post('/', notesController.create);

module.exports = usersRoutes;
