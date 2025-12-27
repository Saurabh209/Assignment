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

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


// import CompletedLogo from '../../../public/AnimatedLogo/completed.json'
import CompletedLogo from '../../../public/AnimatedLogo/completedv2.json'
// import DeleteLogo from '../../../public/AnimatedLogo/delete.json'
import DeleteLogo from '../../../public/AnimatedLogo/deletev2.json'


function Dashboard() {
    let timeoutId = null;

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
    const [password, setPassword] = useState("")
    const [currentCollapseBoardPass, setCurrentCollapseBoardPass] = useState("")
    const [collapseBoardLoader, setCollapseBoardLoader] = useState(null)
    const [generatedTaskId, setGeneratedTaskId] = useState()
    const [collapseBoardShake, setCollapseBoardShake] = useState()
    const [collapseBoardShakev2, setCollapseBoardShakev2] = useState()
    const [isAddTaskVisible, setIsAddTaskVisible] = useState(null)
    const [isboardAddVisible, setIsBoardVisible] = useState(false)
    const [hoveredTask, setHoveredTask] = useState(null);
    const [isSingleTaskViewerVisible, setIsSingleTaskViewerVisible] = useState(false)
    const [currentTask, setCurrentTask] = useState({})
    const [collapseBoardPasswordField, setCollapseBoardPasswordField] = useState()
    const [dueDate, setDueDate] = useState()
    const [disabledButton, setDisabledButton] = useState(false);

    const [isBoardCollapse, setIsBoardCollapse] = useState(() => {
        const stored = localStorage.getItem('collapsedBoardsId');
        return stored ? JSON.parse(stored) : [];
    });



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
    const HandleSubmitBoard = async (title, password) => {
        try {
            const res = await axios.post("https://assignment-1-sup2.onrender.com/boards", {
                name: title, password: password
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
            const boardIdList = localStorage.getItem('collapsedBoardsId');
            const newBoardId = JSON.parse(boardIdList).filter((item) => item != BoardId)
            setIsBoardCollapse(newBoardId)
            localStorage.setItem("collapsedBoardsId", JSON.stringify(newBoardId));
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
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`
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


    function handleCollapseExpand(type, currentBoard) {
        if (!collapseBoardPasswordField) {
            if (currentBoard?.password) {
                setTimeout(() => {
                    setCollapseBoardShakev2(currentBoard?._id)
                });
                setTimeout(() => {
                    setCollapseBoardShakev2()
                }, 600);

            }
        }


        if (type === "collapse") {
            console.log(currentBoard)
            const updatedCollapseID = isBoardCollapse.filter(item => item !== currentBoard?._id);
            setIsBoardCollapse(updatedCollapseID);
            localStorage.setItem("collapsedBoardsId", JSON.stringify(updatedCollapseID));
        } else if (!currentBoard?.password && type === "expand") {
            console.log(currentBoard)
            const updatedCollapseID = [...isBoardCollapse, currentBoard?._id];
            setIsBoardCollapse(updatedCollapseID);
            localStorage.setItem("collapsedBoardsId", JSON.stringify(updatedCollapseID));
        }

    }
    const handleBoardUnlock = async (Id) => {
        setCollapseBoardLoader(Id);

        try {
            const res = await axios.post(`https://assignment-1-sup2.onrender.com/board/verify/${Id}`, {
                Password: currentCollapseBoardPass
            });
            if (res?.data?.success) {
                const updatedCollapseID = [...isBoardCollapse, Id];
                setIsBoardCollapse(updatedCollapseID);
                localStorage.setItem("collapsedBoardsId", JSON.stringify(updatedCollapseID));
            }
            console.log("Response:", res.data);
            setCollapseBoardPasswordField(null);
            setCurrentCollapseBoardPass("");

        } catch (error) {
            console.error("Error verifying board:", error);
            setTimeout(() => {
                setCollapseBoardShake(Id)
            });
            setTimeout(() => {
                setCollapseBoardShake(null)
            }, 1000);

        }
        finally {
            setCollapseBoardLoader(null)
            setCollapseBoardPasswordField(null);
            setCurrentCollapseBoardPass("");
        }
    };



    return (
        // <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.13)">
        <main onClick={() => {setCollapseBoardPasswordField(),setIsSingleTaskViewerVisible(false)}} className="DashBoardContainer" >
            <div className="DashboardTaskbar">
                <p>{`Total Boards ${boards?.length}`}</p>

            </div>

            <div className="boardContainer" style={{ paddingRight: isSingleTaskViewerVisible ? "500px" : "100px" }}>
                {boards?.map((singleBoard, index) => {
                    return (
                        <>
                            {isBoardCollapse.includes(singleBoard?._id) ?

                                <div
                                    key={index}
                                    className="singleBoard"
                                >
                                    <div
                                        onMouseEnter={() => setBoardEditHovered(index)}
                                        onMouseLeave={() => setBoardEditHovered(null)}
                                        className="singleBoardNameContainer">
                                        <div className="nameContainer">
                                            {singleBoard?.name?.length < 16 ?

                                                <p>{truncateText(singleBoard?.name, 16)}</p> :
                                                <Tippy content={singleBoard?.name} delay={150}>
                                                    <p>{truncateText(singleBoard?.name, 16)}</p>
                                                </Tippy>}
                                            <Tippy content={`This board Contain ${singleBoard?.tasks?.length} Tasks`} delay={150}>
                                                <span>{singleBoard?.tasks?.length}</span>
                                            </Tippy>
                                        </div>

                                        {boardEditHovered === index && (
                                            <section>
                                                <div style={{ display: "flex", gap: '8px' }}>
                                                    <Tippy content="Add Task" delay={150}>
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
                                                    </Tippy>

                                                    <Tippy content="Collapse Board" delay={150}>
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(), handleCollapseExpand("collapse", singleBoard) }}
                                                            className="collapseBtnContainer">
                                                            <img src="right.png" alt="" />
                                                            <img src="left.png" alt="" />
                                                        </div>
                                                    </Tippy>

                                                    {/* 

                                        <Lottie
                                            className="delete"
                                            animationData={DeleteLogo
                                            }
                                            loop={false}
                                            autoplay={true}
                                        /> */}


                                                </div>
                                                <Tippy content="Double Click to Delete Board" delay={150}>
                                                    <img

                                                        className="boardDeleteBtn"
                                                        onDoubleClick={(e) => {
                                                            e.stopPropagation();
                                                            HandleDeleteBoard(singleBoard?._id);
                                                        }}
                                                        src="/delete.png"
                                                        alt=""
                                                    />
                                                </Tippy>
                                            </section>
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
                                                    onClick={(e) => { e.stopPropagation(),setIsSingleTaskViewerVisible(true), setCurrentTask(singleTask) }}
                                                    onMouseEnter={() => { setHoveredTask(taskindex), setHoveredIndex(index) }}
                                                    onMouseLeave={() => { setHoveredTask(null), setHoveredIndex(null) }}


                                                    key={taskindex}
                                                    className={`singleTaskContainer  ${singleTask?.status === "Done" ? "taskCompleted" : "taskNotCompleted"}  `}
                                                >
                                                    <div className={`leftContainer  `} style={{ gap: singleTask?.status === "Done" ? "" : "12px" }}>
                                                        <div className="titleContainer">
                                                            {singleTask?.title?.length > 16 ?
                                                                <Tippy content={singleTask?.title} delay={150}>
                                                                    <p>
                                                                        {truncateText(singleTask?.title, 16)}

                                                                    </p>
                                                                </Tippy> :
                                                                <p>
                                                                    {truncateText(singleTask?.title, 16)}

                                                                </p>
                                                            }

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
                                                                <Tippy content="Priority" delay={150}>
                                                                    <p
                                                                        className="priority"
                                                                        style={{ backgroundColor: getColor[singleTask?.priority] }}
                                                                    >
                                                                        {singleTask?.priority}
                                                                    </p>
                                                                </Tippy>
                                                                <Tippy content="Status" delay={150}>
                                                                    <p style={{ backgroundColor: getColor[singleTask?.status] }} className="status">
                                                                        {singleTask?.status}
                                                                    </p>
                                                                </Tippy>
                                                            </div>
                                                        }


                                                        <div className="AssignedNdueContainer">
                                                            {singleTask?.assignedTo &&
                                                                <Tippy content={singleTask?.assignedTo} delay={150}>
                                                                    <p className={`assignedTo  ${singleTask?.status === "Done" && "done"}  `} style={{ padding: `${getShortName(singleTask?.assignedTo).length === 1 ? " 4px 8px" : "6px 6px"}` }}>{getShortName(singleTask?.assignedTo)}</p>
                                                                </Tippy>
                                                            }

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
                                                                <Tippy content="Edit Task" delay={150}>
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
                                                                </Tippy>
                                                                <Tippy content="Delete Task" delay={150}>
                                                                    <div onClick={(e) => { e.stopPropagation(), HandleDeleteTask(singleTask?._id) }}>
                                                                        <img src="/delete.png" alt="" />
                                                                    </div>
                                                                </Tippy>
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
                                :
                                <div key={index}
                                    // onMouseEnter={() => {
                                    //     clearTimeout(timeoutId);
                                    // }}
                                    // onMouseLeave={() => {
                                    //     clearTimeout(timeoutId);
                                    //     timeoutId = setTimeout(() => {
                                    //         setCollapseBoardPasswordField();
                                    //     }, 6000);
                                    // }}

                                    className={`collapseBoard  ${collapseBoardShake === singleBoard?._id ? "BoardShake" : ""} ${collapseBoardShakev2 === singleBoard?._id ? "onlyShake" : ""}`}
                                    onClick={(e) => { e.stopPropagation(), handleCollapseExpand("expand", singleBoard) }}>
                                    <img src="/expand.png" alt="" />
                                    <p>{singleBoard?.name}</p>
                                    <span>{singleBoard?.tasks?.length}</span>
                                    {singleBoard?.password &&
                                        <>
                                            {collapseBoardLoader === singleBoard?._id ?
                                                <div className="collapseLoader lock">
                                                    <div className="bar1"></div>
                                                    <div className="bar2"></div>
                                                    <div className="bar3"></div>
                                                    <div className="bar4"></div>
                                                    <div className="bar5"></div>
                                                    <div className="bar6"></div>
                                                    <div className="bar7"></div>
                                                    <div className="bar8"></div>
                                                    <div className="bar9"></div>
                                                    <div className="bar10"></div>
                                                    <div className="bar11"></div>
                                                    <div className="bar12"></div>
                                                </div>
                                                :
                                                <Tippy content="Locked" delay={150}>
                                                    <img onClick={(e) => { e.stopPropagation(), setCollapseBoardPasswordField(index) }} className="lock" src="lock.png" alt="" />
                                                </Tippy>
                                            }

                                            {/* {collapseBoardPasswordField === index && */}
                                            <input
                                                value={currentCollapseBoardPass}
                                                onChange={(e) => setCurrentCollapseBoardPass(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBoardUnlock(singleBoard?._id);
                                                    }
                                                }}
                                                style={{
                                                    height: collapseBoardPasswordField === index ? "100px" : "0px",
                                                    cursor: collapseBoardPasswordField === index ? "" : "pointer",
                                                    padding: collapseBoardPasswordField === index ? "10px 0px" : "0px"
                                                }}
                                                className="password"
                                                type="text"
                                            />

                                            {/* } */}

                                        </>
                                    }

                                </div >
                            }
                        </>
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
                        <div className="addBoardInput">
                            <input
                                type="text"
                                placeholder="Password(optional)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div onClick={() => HandleSubmitBoard(newBoardName, password)} className="addBoardBtn">
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

            <div onClick={(e)=>e.stopPropagation()} className="singleTaskDetailedContainer" style={{ right: isSingleTaskViewerVisible ? "0%" : "-502px" }}>
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

        </main >
        // </SpotlightCard>
    );
}

export default Dashboard;
