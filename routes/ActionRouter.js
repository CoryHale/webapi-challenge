const express = require('express');
const db = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const actions = await
        db.get();
            res.status(200).json({ success: true, actions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the actions.', err });
    }
});

router.get('/:id', validateActionId, async (req, res) => {
    try {
        const {id} = req.params;
        const action = await
        db.get(id);
            res.status(200).json({ success: true, action });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while retrieving the action', err });
    }
});


router.post('/', validateAction, (req, res) => {
    const action = req.body;

    db.insert(action)
        .then(actions => {
            res.status(201).json({ success: true, actions });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: 'There was an error while adding the action.', err });
        })
});

router.put('/:id', validateActionId, validateAction, async (req, res) => {
    try {
        const {id} = req.params;
        const updated = req.body;
        const action = await
        db.update(id, updated);
            res.status(200).json({ success: true, action });
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while updating the action.', err });
    }
});

router.delete('/:id', validateActionId, async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await
        db.remove(id);
            res.status(204).end();
    } catch (err) {
        res.status(500).json({ success: false, error: 'There was an error while deleting the action.', err });
    }
});

// custom middleware

async function validateActionId(req, res, next) {
    try {
        const {id} = req.params;
        const action = await
        db.get(id);
            if(action) {
                req.action = action;
                next();
            } else {
                res.status(400).json({ message: 'Invalid action id.' });
            }
    } catch (err) {
        res.status(500).json({ error: 'There was an error while validating the action id.', err });
    }
};

function validateAction(req, res, next) {
    const action = req.body;
    if (!action) {
        res.status(400).json({ message: 'Missing action data.' });
    } else {
        if (!action.project_id || !action.description || !action.notes) {
            res.status(400).json({ message: 'Please add a project id and a description and notes.' });
        } else {
            req.action = action;
            next();
        }
    }
}

module.exports = router;