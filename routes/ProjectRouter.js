const express = require('express');
const db = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await
        db.get();
            res.status(200).json({ success: true, projects });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the projects.', err });
    }
});

router.get('/:id', validateProjectId, async (req, res) => {
    try {
        const {id} = req.params;
        const project = await
        db.get(id);
            res.status(200).json({ success: true, project });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the project.', err });
    }
});

router.post('/', validateProject, (req, res) => {
    const project = req.body;

    db.insert(project)
        .then(projects => {
            res.status(201).json({ success: true, projects });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while adding the project.', err });
        })
});

router.put('/:id', validateProjectId, validateProject, async (req, res) => {
    try {
        const {id} = req.params;
        const updated = req.body;
        const project = await
        db.update(id, updated);
            res.status(200).json({ success: true, project });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while updating the project.', err });
    }
});

router.delete('/:id', validateProjectId, async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await
        db.remove(id);
            res.status(204).end();
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while deleting the project.', err });
    }
});

// extra method

router.get('/:id/actions', validateProjectId, (req, res) => {
    const {id} = req.params;

    db.getProjectActions(id)
        .then(actions => {
            res.status(200).json({ success: true, actions });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while retrieving the actions.', err });
        })
});

// custom middleware

async function validateProjectId(req, res, next) {
    try {
        const {id} = req.params;
        const project = await

        db.get(id);
            if(project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({ message: 'Invalid project id.' });
            }
    } catch (err) {
        res.status(500).json({ error: 'There was an error while validating the project id.', err });
    }
};

function validateProject(req, res, next) {
    const project = req.body;
    if (!project) {
        res.status(400).json({ message: 'Missing project data.' });
    } else {
        if (!project.name || !project.description) {
            res.status(400).json({ message: 'Please add name and description to project.' });
        } else {
            req.project = project;
            next();
        }
    }
};

module.exports = router;