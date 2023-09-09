// Imports
const express = require('express');
const checkAuth = require('../middleware/check-auth');
const ProjectsController = require('../controllers/projects.controller');
const router = express.Router();


/** POST - Create a new project (auth) */
router.post("", checkAuth, ProjectsController.addProject);
/** GET - List all projects (auth)*/
router.get("", checkAuth,  ProjectsController.getProjects);
/** POST /:id/notes - Update project notes (auth) */
router.post("/:id/notes", checkAuth,  ProjectsController.saveNotes);
/** GET /:id/notes - List all project notes (auth) */
router.get("/:id/notes", checkAuth, ProjectsController.getNotes);
/** DELETE /:id - Delete a project (auth) */
router.delete('/:id', checkAuth, ProjectsController.deleteProject);


module.exports = router;
