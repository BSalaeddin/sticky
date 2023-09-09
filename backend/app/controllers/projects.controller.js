const Project = require('../models/project'); // Project model
const Note = require('../models/note'); // User model


/**
 * Create a new project
 */
exports.addProject = (req, res, next) => {
  // Creating new Project object
  const project = new Project({
    title: req.body.title,
    notes: req.body.notes,
    createdAt: req.body.createdAt,
    creator: req.userData.userId
  });
  // Saving Project to Database
  const saveProjectQuery = project.save();
  saveProjectQuery.then(result => {
    //Succeeded request
    res.status(201).json({
      message: 'Project added successfully',
      project: {
        _id: result._id,
        title: result.title,
        notes: result.notes,
        createdAt: result.createdAt
      }
    });
  })
  .catch(error => {
    //Failed request
    res.status(500).json({
      message: 'Creating Project failed!'
    })
  });

};

/**
 * List all authenticated user projects
 */
exports.getProjects = (req, res, next) => {

  // Getting Projects from Database
  const projectQuery = Project.find({creator: req.userData.userId});
  projectQuery.then(fetchedProjects => {
      //Succeeded request
      res.status(200).json({
        message: "Projects fetched successfully!",
        projects: fetchedProjects,
      });
    })
    .catch(error => {
      //Failed request
      res.status(500).json({
        message: 'Fetching Projects failed!'
      })
    });
};

/**
 * Delete a project by id
 */
exports.deleteProject = (req, res, next) => {

  // Find the wanted project from the database
  const findProjectQuery = Project.findOne({_id: req.params.id, creator: req.userData.userId});
  findProjectQuery.then( result => {
    if (result === null) {
      //Failed request
      return res.status(404).json({
        message: 'Project not found!'
       });
    } else {
      const notesIds = result.notes; // Getting array of notes refs
      // Delete the project by id from the database
      const deleteProjectQuery = Project.deleteOne({_id: req.params.id, creator: req.userData.userId});
      deleteProjectQuery.then( result => {
        // Delete the notes belongs to this project from the database
        const deleteProjectNotesQuery = Note.deleteMany({_id: { $in: notesIds}});
        deleteProjectNotesQuery.then( result => {
          //Succeeded request
          res.status(200).json({
            message: "Project deleted successfully!",
          });
        }).catch( error => {
          //Failed request
          res.status(500).json({
            message: 'Deleting project notes failed!'
          });
        });
      }).catch( error => {
         //Failed request
        res.status(500).json({
          message: 'Deleting Project failed!'
        });
      });
    }
  })
  .catch(error => {
     //Failed request
    res.status(500).json({
      message: 'Deleting Project failed!'
    });
  });
};
/**
 * List all project notes
 */
exports.getNotes = (req, res, next) => {
  // Find the wanted project from the database
  const findProjectQuery = Project.findOne({_id: req.params.id, creator: req.userData.userId});
  findProjectQuery.populate('notes')
      .then((project) => {
        if (project === null) {
          // Failed request
          return res.status(404).json({
            message: 'Project not found!'
          });
        }

        if (project.notes.length === 0) {
          // Succeeded request with 0 notes
          return res.status(200).json({
            message: "Project has 0 notes!",
            notes: [],
          });
        }

        // Succeeded request with notes
        res.status(200).json({
          message: "Notes fetched successfully!",
          notes: project.notes,
        });
      })
      .catch((error) => {
        // Failed request
        res.status(500).json({
          message: 'Fetching notes failed!'
        });
      });
};

/**
 * Update project notes
 */
exports.saveNotes = (req, res, next) => {

  // Find the wanted project from the database
  const findProjectQuery = Project.findOne({_id: req.params.id, creator: req.userData.userId});
  findProjectQuery.then( result => {
    if (result === null) {
      //Failed request
      return res.status(404).json({
        message: 'Project not found!'
       });
    }
    // If project exist: Updating note by note
    req.body.map( note => {
      Note.findByIdAndUpdate(note._id,note, { upsert: true }).then(result => {
        // Success updating note
      }).catch(error => {
        // Failed updating note
        return res.status(500).json({
          message: 'Project save failed!'
        });
      })
    });
    // If project exist: Updating the references of notes in project document
    const updateProjectQuery = Project.updateOne({_id: req.params.id, creator: req.userData.userId}, { "notes": req.body  });
    updateProjectQuery.populate('notes')
        .then((notes) => {
          // Succeeded request
          res.status(200).json({
            message: "Project saved successfully!",
            notes: notes,
          });
        })
        .catch((error) => {
          // Failed request
          res.status(500).json({
            message: 'Project save failed!'
          });
        });

  })
  .catch( error => {
    //Failed request
    return res.status(500).json({
      message: 'Project save failed!'
    });
  });
};

