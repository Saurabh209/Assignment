import { useContext, useEffect, useState } from "react";
import axios from "axios";
import './DashBoard.scss'
import SpotlightCard from '../../../reactBitsComponents/SpotlightCard/SpotlightCard'
import { Context } from "../../main";

function Dashboard() {

    const { boards, setBoards, loading, setLoading, getBoards } = useContext(Context)
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [boardEditHovered, setBoardEditHovered] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskSubmitType, SetTaskSubmitType] = useState()
    const [taskPriority, setTaskPriority] = useState("Low");
    const [taskStatus, setTaskStatus] = useState("To Do");
    const [assignedUser, setAssignedUser] = useState("")
    const [description, setDescription] = useState("")
    const [newBoardName, setNewBoardName] = useState("")

    const [generatedTaskId, setGeneratedTaskId] = useState()

    const [isAddTaskVisible, setIsAddTaskVisible] = useState(null)
    const [isboardAddVisible, setIsBoardVisible] = useState(false)

    const [hoveredTask, setHoveredTask] = useState(null);



    const handleSubmitTask = async (BoardId, generatedTaskId) => {
        if (taskSubmitType === "Add") {
            const newTask = {
                title: taskTitle,
                priority: taskPriority,
                status: taskStatus,
                description: description,
                assignedTo: assignedUser,
            };

            console.log("Task Submitted:", newTask);

            try {
                const res = await axios.post(
                    `https://assignment-1-sup2.onrender.com/boards/${BoardId}/tasks`,
                    newTask
                );
                console.log("Task Added Successfully:", res.data);

                getBoards();
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }

        if (taskSubmitType === "Update") {
            const updatedTask = {
                title: taskTitle,
                priority: taskPriority,
                status: taskStatus,
                description: description,
                assignedTo: assignedUser,
            };

            console.log("Updated Task:", updatedTask);

            try {
                const res = await axios.put(
                    `https://assignment-1-sup2.onrender.com/tasks/${generatedTaskId}`,
                    updatedTask
                );
                console.log("Task Updated Successfully:", res.data);

                getBoards();
            } catch (error) {
                console.error("Error updating task:", error);
            }
        }
    };

    const HandleSubmitBoard = async (title) => {
        try {
            const res = await axios.post("https://assignment-1-sup2.onrender.com/boards", {
                name: title, description: "testing"
            });

            console.log("Board Created:", res.data);
            getBoards();
        } catch (err) {
            console.log("Error creating board:", err);
        }
    };
    const HandleDeleteTask = async (taskId) => {
        try {
            const res = await axios.delete(`https://assignment-1-sup2.onrender.com/tasks/${taskId}`);
            console.log("Task Deleted:", res.data);
            getBoards();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    }
    const HandleDeleteBoard = async (BoardId) => {
        if (!BoardId) {
            console.log("Board id is missing");
            return;
        }

        try {
            const res = await axios.delete(`https://assignment-1-sup2.onrender.com/boards/${BoardId}`);
            console.log("Board Deleted ", res.data);

            // Optional: refetch boards after delete
            getBoards();
        } catch (err) {
            console.log("Error deleting board:", err.response?.data || err.message);
        }
    };

    const getColor = {
        "Low": "#77d3e9",
        "Medium": "#f7bd51",
        "High": "#e39ef2",
        "To Do": "#8b9cbeff",
        "In Progress": "#77d3e9",
        "Done": "#f6d861"
    }

    return (
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.13)">
            <main className="DashBoardContainer">
                <div className="DashboardTaskbar">
                    <p>{`Total Boards ${boards?.length}`}</p>
                </div>

                <div className="boardContainer">
                    {boards?.map((singleBoard, index) => {
                        return (
                            <div
                                key={index}
                                className="singleBoard"
                            >
                                <div
                                    onMouseEnter={() => setBoardEditHovered(index)}
                                    onMouseLeave={() => setBoardEditHovered(null)}
                                    className="singleBoardNameContainer">
                                    <div className="nameContainer">
                                        <p>{singleBoard?.name}</p>
                                        <span>{singleBoard?.tasks?.length}</span>
                                    </div>

                                    {boardEditHovered === index && (
                                        <div style={{ display: "flex", gap: '8px' }}>
                                            <div onClick={() => setIsAddTaskVisible(index)} className="editBtnContainer">
                                                <p>+</p>

                                            </div>
                                            <img onClick={() => HandleDeleteBoard(singleBoard?._id)} src="/delete.png" alt="" />
                                        </div>
                                    )}
                                </div>

                                {isAddTaskVisible === index &&
                                    <div className="addTaskCard">
                                        <div onClick={() => { setIsAddTaskVisible(null), SetTaskSubmitType("Add") }} className="closeAddTaskCard">
                                            <p>+</p>
                                        </div>
                                        <div className="title">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={taskTitle}
                                                onChange={(e) => setTaskTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="status">
                                            <p className="priority">
                                                <select
                                                    name="Priority"
                                                    value={taskPriority}
                                                    onChange={(e) => setTaskPriority(e.target.value)}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </p>

                                            <p className="status">
                                                <select
                                                    name="status"
                                                    value={taskStatus}
                                                    onChange={(e) => setTaskStatus(e.target.value)}
                                                >
                                                    <option value="To Do">To Do</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Done">Done</option>
                                                </select>
                                            </p>
                                        </div>
                                        <div className="description">
                                            <textarea
                                                value={description}
                                                onChange={(e) => { setDescription(e.target.value) }}
                                                name="Description" id="">
                                            </textarea>
                                        </div>

                                        <div className="Assigned">
                                            <input
                                                className="assignedTo"
                                                type="text"
                                                placeholder="Assigned User"
                                                value={assignedUser}
                                                onChange={(e) => setAssignedUser(e.target.value)}
                                            />

                                        </div>

                                        <button onClick={() => handleSubmitTask(singleBoard?._id, generatedTaskId && generatedTaskId)} className="addTaskBtn">
                                            Add Task
                                        </button>
                                    </div>
                                }


                                <div className="singleBoardTaskContainer">
                                    {singleBoard?.tasks?.map((singleTask, taskindex) => {
                                        // console.log(singleTask, "singleTask")
                                        return (
                                            <div
                                                onMouseEnter={() => { setHoveredTask(taskindex), setHoveredIndex(index) }}
                                                onMouseLeave={() => { setHoveredTask(null), setHoveredIndex(null) }}


                                                key={taskindex} className="singleTaskContainer">
                                                <div className="leftContainer">
                                                    <div className="titleContainer">
                                                        <p>
                                                            {singleTask?.title}
                                                        </p>
                                                    </div>
                                                    <div className="statusContainer">
                                                        <p
                                                            className="priority"
                                                            style={{ backgroundColor: getColor[singleTask?.priority] }}
                                                        >
                                                            {singleTask?.priority}
                                                        </p>
                                                        <p style={{ backgroundColor: getColor[singleTask?.status] }} className="status">
                                                            {singleTask?.status}
                                                        </p>
                                                    </div>
                                                    <div className="AssignedContainer">
                                                        <p className="assignedTo">{singleTask?.assignedTo}</p>
                                                    </div>
                                                </div>
                                                <div className="deleteEditBtnContainer">
                                                    {hoveredTask === taskindex && hoveredIndex === index &&
                                                        <>
                                                            <div onClick={() => {
                                                                setGeneratedTaskId(singleTask?._id)
                                                                setTaskTitle(singleTask?.title),
                                                                    setTaskStatus(singleTask?.status),
                                                                    setTaskPriority(singleTask?.priority),
                                                                    setDescription(singleTask?.description),
                                                                    setAssignedUser(singleTask?.assignedTo),
                                                                    SetTaskSubmitType("Update"),
                                                                    setIsAddTaskVisible(index)
                                                            }} className="">
                                                                <img src="/editme.png" alt="" />

                                                            </div>
                                                            <div onClick={() => HandleDeleteTask(singleTask?._id)}>
                                                                <img src="/delete.png" alt="" />
                                                            </div>
                                                        </>
                                                    }




                                                </div>

                                            </div>
                                        );
                                    })}

                                    <div onClick={() => { setIsAddTaskVisible(index), SetTaskSubmitType("Add") }} className="addTaskButton">
                                        <p>+ Add task</p>

                                    </div>


                                </div>


                            </div>
                        );
                    })}
                    {isboardAddVisible &&
                        <div className="addBoardContainer">
                            <div className="addBoardInput">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                />
                            </div>
                            <div onClick={() => HandleSubmitBoard(newBoardName)} className="addBoardBtn">
                                <p>+ Add</p>

                                <span onClick={() => setIsBoardVisible(false)}>+</span>
                            </div>
                        </div>
                    }
                    {!isboardAddVisible &&
                        <div className="addBoardButton">
                            <div onClick={() => setIsBoardVisible(true)} className="editBtnContainer">
                                <p>+ Add Board</p>
                            </div>
                        </div>
                    }


                </div>





            </main>
        </SpotlightCard>


    );
}

export default Dashboard;
