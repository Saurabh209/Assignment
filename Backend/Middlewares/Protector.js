import { Board } from "../Models/Board.Model.js";
import bcrypt from "bcrypt";

export const BoardProtector = async (req, res, next) => {
    try {
        const { Password } = req.body;
        const { id } = req.params;

        const board = await Board.findById(id);
        if (!board) return res.status(404).json({success:false,  message: "Board not found" });

        const isValid = await bcrypt.compare(Password, board.password);
        if (!isValid) return res.status(401).json({ success:false,message: "Invalid password" });

        next();
    } catch (err) {
        return res.status(500).json({ success:false, message: "Server error" });
    } 
};
