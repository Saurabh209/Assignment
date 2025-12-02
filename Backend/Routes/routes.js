import express from 'express';
import {
    getBoard,
    postBoard,
    deleteBoard,
    getTasksByBoard,
    createTask,
    updateTask,
    deleteTask
} from '../Controllers/Controller.js';

const router = express.Router();

// Board Routes
router.get('/boards', getBoard);
router.post('/boards', postBoard);
router.delete('/boards/:id',deleteBoard)

// Task routes
router.get('/boards/:id/tasks', getTasksByBoard);

router.post('/boards/:id/tasks', createTask);

router.put('/tasks/:id', updateTask);

router.delete('/tasks/:id', deleteTask);

export default router;
