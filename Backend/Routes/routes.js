import express from 'express';
import {
    getBoard,
    postBoard,
    deleteBoard,
    getTasksByBoard,
    createTask,
    updateTask,
    deleteTask,
    postCheckBoard
} from '../Controllers/Controller.js';

import { BoardProtector } from '../Middlewares/Protector.js';

const router = express.Router();

// Board Routes
router.get('/boards', getBoard);
router.post('/boards', postBoard);
router.delete('/boards/:id', deleteBoard)

// Task routes
router.get('/boards/:id/tasks', getTasksByBoard);
router.post('/boards/:id/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// verify board
router.post('/board/verify/:id', BoardProtector, postCheckBoard)

export default router;
