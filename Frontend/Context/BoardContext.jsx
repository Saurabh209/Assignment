import { createContext, useState, useContext } from "react";


const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
    const [boards, setBoards] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);



    return (
        <BoardContext.Provider
            value={{ boards, setBoards, tasks, setTasks, selectedBoard, setSelectedBoard }}
        >
            {children}
        </BoardContext.Provider>
    );
};


export const useBoard = () => useContext(BoardContext);
