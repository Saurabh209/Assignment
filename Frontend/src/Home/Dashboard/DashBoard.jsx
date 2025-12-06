import { useContext, useEffect, useState } from "react";
import axios from "axios";
import './DashBoard.scss'
import SpotlightCard from '../../../reactBitsComponents/SpotlightCard/SpotlightCard'
import { Context } from "../../main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ShinyText from "../../../reactBitsComponents/ShinyText/ShinyText";
import Lottie from "lottie-react";
import { Player } from "@lottiefiles/react-lottie-player";


// import CompletedLogo from '../../../public/AnimatedLogo/completed.json'
import CompletedLogo from '../../../public/AnimatedLogo/completedv2.json'
// import DeleteLogo from '../../../public/AnimatedLogo/delete.json'
import DeleteLogo from '../../../public/AnimatedLogo/deletev2.json'


function Dashboard() {

    const { boards, getBoards } = useContext(Context)
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

    const [isSingleTaskViewerVisible, setIsSingleTaskViewerVisible] = useState(false)
    const [currentTask, setCurrentTask] = useState({})

    const [dueDate, setDueDate] = useState()



    const handleSubmitTask = async (BoardId, generatedTaskId) => {

        if (taskSubmitType === "Add") {

            const newTask = {
                title: taskTitle,
                priority: taskPriority,
                status: taskStatus,
                description: description,
                assignedTo: assignedUser,
                dueDate: dueDate
            };


            try {
                await axios.post(
                    `https://assignment-1-sup2.onrender.com/boards/${BoardId}/tasks`,
                    newTask
                );


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
                dueDate: dueDate
            };



            try {
                const res = await axios.put(
                    `https://assignment-1-sup2.onrender.com/tasks/${generatedTaskId}`,
                    updatedTask
                );


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


            getBoards();
        } catch (err) {
            console.log("Error creating board:", err);
        }
    };
    const HandleDeleteTask = async (taskId) => {
        try {
            const res = await axios.delete(`https://assignment-1-sup2.onrender.com/tasks/${taskId}`);

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
    function activeAgo(date) {
        const created = new Date(date);
        const now = new Date();

        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const days = diffDays % 365;

        // Status dot

        // Return formatted result
        if (years === 0 && days === 0) return ` Created today`;
        if (years === 0) return `Created ${days}d ago`;
        return `Created  ${years}y ${days}d ago`;
    }
    function getRemainingTime(dateString) {
        const target = new Date(dateString);
        const now = new Date();


        if (target < now) return "Expired";


        const diff = target - now;


        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = (days % 365) % 30;

        // Formatting logic
        if (years > 0) return `${years}y ${months}m ${remainingDays}d left`;
        if (months > 0) return `${months}m ${remainingDays}d left`;
        if (remainingDays < 1) return `Last Day`;
        return `${remainingDays}d left`;
    }
    function dueDateColor(date) {
        const target = new Date(date);
        const now = new Date();

        // past date
        if (target < now) return "#8b8b8b"; // light grey

        const diffMs = target - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Very soft pastel color scaling
        if (diffDays <= 1) return "#f25a5aff";      // soft light red
        if (diffDays <= 3) return "#ffcc99";      // peach/orange-ish
        if (diffDays <= 7) return "#ffe4a1";      // soft warm yellow
        if (diffDays <= 30) return "#d2f5c8";     // light green
        return "#c9e7ff";                         // light blue for far dates
    }
    function getShortName(fullName) {
        if (!fullName) return "";
        const arr = fullName.trim().split(" ").slice(0, 2);
        let shortName = "";
        arr.forEach(word => {
            if (word.length > 0) shortName += word[0].toUpperCase();
        });
        return shortName;
    }
    function truncateText(text) {
        if (text.length > 17) {
            return `${text.slice(0, 17)}...`
        }
        return text
    }



    const getColor = {
        "Low": "#77d3e9",
        "Medium": "#f7bd51",
        "High": "#e39ef2",
        "To Do": "#eb89a8",
        "In Progress": "#77d3e9",
        "Done": "#6ee771"
    }



    return (
        // <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.13)">
        <main className="DashBoardContainer" >
            <div className="DashboardTaskbar">
                <p>{`Total Boards ${boards?.length}`}</p>

            </div>

            <div className="boardContainer" style={{ paddingRight: isSingleTaskViewerVisible ? "500px" : "100px" }}>
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
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsAddTaskVisible(index);
                                                SetTaskSubmitType("Add");
                                            }}
                                            className="editBtnContainer"
                                        >
                                            <p>+</p>
                                        </div>

                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                HandleDeleteBoard(singleBoard?._id);
                                            }}
                                            src="/delete.png"
                                            alt=""
                                        />
                                        {/* 

                                        <Lottie
                                            className="delete"
                                            animationData={DeleteLogo
                                            }
                                            loop={false}
                                            autoplay={true}
                                        /> */}


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
                                    <div className="dueDate">
                                        <DatePicker
                                            selected={dueDate}
                                            onChange={(date) => setDueDate(date)}
                                            customInput={
                                                <div className="customDateTrigger">
                                                    <img src="/pickDate.png" alt="" />
                                                    <span>{dueDate ? dueDate.toLocaleDateString() : "Set Due Date"}</span>
                                                </div>
                                            }
                                        />


                                    </div>

                                    <button onClick={() => handleSubmitTask(singleBoard?._id, generatedTaskId)} className="addTaskBtn">
                                        Add Task
                                    </button>
                                </div>
                            }


                            <div className="singleBoardTaskContainer">
                                {singleBoard?.tasks?.map((singleTask, taskindex) => {

                                    return (
                                        <div
                                            onClick={() => { setIsSingleTaskViewerVisible(true), setCurrentTask(singleTask) }}
                                            onMouseEnter={() => { setHoveredTask(taskindex), setHoveredIndex(index) }}
                                            onMouseLeave={() => { setHoveredTask(null), setHoveredIndex(null) }}


                                            key={taskindex}
                                            className={`singleTaskContainer  ${singleTask?.status === "Done" ? "taskCompleted" : "taskNotCompleted"}  `}
                                        >
                                            <div className={`leftContainer  `} style={{gap:singleTask?.status === "Done" ? "" :"12px"}}>
                                                <div className="titleContainer">
                                                    <p>
                                                        {truncateText(singleTask?.title)}

                                                    </p>
                                                    {singleTask?.status === "Done" &&
                                                        // <img src="/complete.png" alt="" />

                                                        <Lottie
                                                            animationData={CompletedLogo}
                                                            loop={false}
                                                            autoplay={true}
                                                            className="done"
                                                        />
                                                    }

                                                </div>
                                                {singleTask?.status !== "Done" &&
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
                                                }


                                                <div className="AssignedNdueContainer">
                                                    <p className={`assignedTo  ${singleTask?.status === "Done" && "done" }  `} style={{ padding: `${getShortName(singleTask?.assignedTo).length === 1 ? " 4px 8px" : "6px 6px"}` }}>{getShortName(singleTask?.assignedTo)}</p>
                                                    {singleTask?.status === "Done" ?
                                                        <>
                                                            <ShinyText
                                                                text="completed"
                                                                disabled={false}
                                                                speed={2}
                                                                className='custom-class'
                                                            />
                                                        </>
                                                        :

                                                        <>
                                                            {singleTask?.dueDate ?
                                                                <p className="dueDate" style={{ color: dueDateColor(singleTask?.dueDate) }}> {getRemainingTime(singleTask?.dueDate)}</p>
                                                                :
                                                                <p className="dueDate"  >No Deadline</p>
                                                            }
                                                        </>
                                                    }


                                                </div>

                                            </div>
                                            <div className="deleteEditBtnContainer">
                                                {hoveredTask === taskindex && hoveredIndex === index &&
                                                    <>
                                                        <div onClick={(e) => {
                                                            e.stopPropagation();
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
                                                        <div onClick={(e) => { e.stopPropagation(), HandleDeleteTask(singleTask?._id) }}>
                                                            <img src="/delete.png" alt="" />
                                                        </div>
                                                    </>
                                                }

                                            </div>

                                        </div>
                                    );
                                })}

                                <div onClick={() => { setIsAddTaskVisible(index), SetTaskSubmitType("Add") }} className="addTaskButton">
                                    <ShinyText
                                        text="+ Add task"
                                        disabled={false}
                                        speed={2}
                                        className='custom-class'
                                    />
                                    {/* <p></p> */}

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
                            {/* <p>+ Add</p> */}
                            <ShinyText
                                text="+ Add"
                                disabled={false}
                                speed={2}
                                className='custom-class'
                            />
                            <span onClick={() => setIsBoardVisible(false)}>+</span>
                        </div>
                    </div>
                }
                {!isboardAddVisible &&
                    <div onClick={() => setIsBoardVisible(true)} className="addBoardButton">
                        <div className="editBtnContainer">
                            {/* <p></p> */}
                            <ShinyText
                                text="+ Add Board"
                                disabled={false}
                                speed={2}
                                className='custom-class'
                            />
                        </div>
                    </div>
                }


            </div>

            {/* {
                isSingleTaskViewerVisible &&
                <div className="darkOverlay" onClick={()=>setIsSingleTaskViewerVisible(false)}>

                </div>

            } */}



            <div className="singleTaskDetailedContainer" style={{ right: isSingleTaskViewerVisible ? "0%" : "-502px" }}>
                <div className="taskBar">
                    <img onClick={() => { setIsSingleTaskViewerVisible(false) }} src="/Back.png" alt="" />
                </div>
                <div className="singleTaskHeading">
                    <p>{currentTask?.title}</p>
                </div>
                <section className="singleTaskDataContainer">
                    <div className="priority">
                        <p >Priority</p>
                        <p style={{ backgroundColor: getColor[currentTask?.priority] }}>{currentTask?.priority}</p>
                    </div>
                    <div className="status">
                        <p >Status</p>
                        <p style={{ backgroundColor: getColor[currentTask?.status] }}>{currentTask?.status}</p>
                    </div>

                    <div className="description">
                        <p >Description</p>
                        <p>{currentTask?.description ? currentTask?.description : "No Description Provided"}</p>
                    </div>
                    <div className="assignedUser">
                        <p >Assigned To <span>{currentTask?.assignedTo}</span></p>
                    </div>
                    <div className="createdAgo">
                        <p >{activeAgo(currentTask?.createdAt)}</p>
                    </div>

                </section>
            </div>

        </main>
        // </SpotlightCard>


    );
}

export default Dashboard;
