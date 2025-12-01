import { Board } from "../Models/Board.Model.js";
import { Task } from "../Models/Task.Model.js";


// board controlleer
export const getBoard = async (req, res) => {
    try {
        const boards = await Board.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: boards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const postBoard = async (req, res) => {
    try {
        const { name, description } = req.body;
        await Board.find({ name })
        // if (isBoardExist) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "Board with this name is already exist"
        //     })
        // }
        if (!name) return res.status(400).json({ success: false, message: "Board name required" });

        const board = await Board.create({ name,description });
        res.status(201).json({ success: true, message: "Board created", data: board });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// taskController
export const getTasksByBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await Task.find({ boardId: id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, assignedTo, dueDate } = req.body;


        if (!title) return res.status(400).json({ success: false, message: "Title required" });

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            assignedTo,
            dueDate,
            boardId: id
        });

        res.status(201).json({ success: true, message: "Task created", data: task });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ success: true, message: "Task updated", data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

