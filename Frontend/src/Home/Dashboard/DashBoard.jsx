import { useEffect } from "react";
import axios from "axios";
import { useBoard } from "../../../Context/BoardContext";
import './Dashboard.scss'
import SpotlightCard from '../../../SpotlightCard/SpotlightCard'
import Boards from "./Board/Boards";
import ActivityArea from "./Activity/ActivityArea";

function Dashboard() {
    const { boards, setBoards, selectedBoard, setSelectedBoard, tasks, setTasks } = useBoard();


    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await axios.get("http://localhost:3000/boards");
                if (res.data.success) {
                    setBoards(res.data.data);
                    // optionally select first board by default
                    if (res.data.data.length > 0) setSelectedBoard(res.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching boards:", error);
            }
        };

        fetchBoards();
    }, [setBoards, setSelectedBoard]);

    // Fetch tasks whenever selectedBoard changes
    useEffect(() => {
        if (!selectedBoard) return;

        const fetchTasks = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/boards/${selectedBoard._id}/tasks`);
                if (res.data.success) {
                    setTasks(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [selectedBoard, setTasks]);

    return (

        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.11)">
            <div className="MainDashBoardContainer">
                <Boards />
                <ActivityArea />
            </div>
        </SpotlightCard>


        // <div className="dashboard">
        //     <h1>Boards</h1>
        //     <div className="board-list">
        //         {boards.map((board) => (
        //             <div
        //                 key={board._id}
        //                 onClick={() => setSelectedBoard(board)}
        //                 style={{ fontWeight: selectedBoard?._id === board._id ? "bold" : "normal" }}
        //             >
        //                 {board.name}
        //             </div>
        //         ))}
        //     </div>

        //     <h2>Tasks for: {selectedBoard?.name}</h2>
        //     <div className="tasks">
        //         {tasks.map((task) => (
        //             <div key={task._id}>
        //                 <strong>{task.title}</strong> - {task.status} - {task.priority}
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
}

export default Dashboard;
