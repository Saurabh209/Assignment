import { Board } from "../Models/Board.Model.js";
import { Task } from "../Models/Task.Model.js";
import bcrypt from 'bcrypt'

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
        const { name, password } = req.body;
     
        if (!name) return res.status(400).json({ success: false, message: "Board name required" });

        if (password) {
            const hashedPass = await bcrypt.hash(password, 10)
            const board = await Board.create({ name, password: hashedPass });
            res.status(201).json({ success: true, message: "Board created", data: board });
        } else {
            const board = await Board.create({ name });
            res.status(201).json({ success: true, message: "Board created", data: board });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBoard = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBoard = await Board.findByIdAndDelete(id);

        if (!deletedBoard) {
            return res.status(404).json({ message: "Board not found, fell into the abyss 💀" });
        }

        return res.status(200).json({
            message: "Board deleted successfully ",
            data: deletedBoard
        });

    } catch (error) {
        console.error("Error deleting board:", error);
        return res.status(500).json({
            message: "Server error while deleting board — another death screen moment",
            error: error.message
        });
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

export const postCheckBoard = async (req, res) => {
    try {
        const { id } = req.params;

        return res.status(200).json({
            success: true,
            message: "Board unlocked successfully",
            boardId: id,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


