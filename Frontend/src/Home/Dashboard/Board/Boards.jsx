import { useContext, useEffect, useState } from "react";
import axios from "axios";
import './Boards.scss'
import ShinyText from "../../../../reactBitsComponents/ShinyText/ShinyText";
import { Context } from "../../../main";



export default function Boards() {


    const [boardLoading, setBoardLoading] = useState(false)
    const [boardAddVsisble, setBoardAddVisible] = useState(false)

    const [boardName, setBoardName] = useState("");
    const [description, setDescription] = useState("");

    const { boards, setBoards, loading, setLoading } = useContext(Context);



    // const handleAddBoard = () => {
    //     console.log("clicked")
    //     axios.post('./boards', {})
    // }

    function activeAgo(date) {
        const created = new Date(date);
        const now = new Date();

        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const days = diffDays % 365;


        if (years === 0 && days === 0) return ` Created today`;
        if (years === 0) return `Created ${days}d ago`;
        return `Created  ${years}y ${days}d ago`;
    }

    const handleBoardSubmit = async () => {
        console.log("start: ", boardName, description)
        if (!boardName.trim()) {
            console.log("Bro name dal 😑");
            return;
        }

        const payload = {
            name: boardName,
            description: description,
        };

        try {
            const res = await axios.post("https://assignment-1-sup2.onrender.com/boards", payload);

            console.log("Board Created 👉", res.data);
            // getBoards();

            setBoardName("");
            setDescription("");
            setBoardAddVisible(false);

        } catch (err) {
            console.log("Error creating board:", err.response?.data || err.message);
        }
        console.log("end: ")
    };

    console.log("boardsvfrom :", boards)

    return (
        <>

            <section className="MainBoardContainer">

                <div className="BoardStatus">
                    {/* <p>{`Total Boards`} <span>{` ${boards?.length}`}</span></p> */}
                    <img onClick={() => setBoardAddVisible(true)} src="/icons8-add-50.png" alt="" />

                </div>

                {boardAddVsisble &&
                    <div className="addBoard">
                        <input
                            className="boardTitleInput"
                            type="text"
                            placeholder="Board Name"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                        />

                        <textarea
                            placeholder="Add description..."
                            className="board-description"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className="boardAddButton" onClick={handleBoardSubmit}>
                            Add +
                        </button>
                    </div>
                }




                <div className="allBoardsContainer">
                    {/* {boards?.map((singleBoard, index) => (
                        <div key={index} className="singleBoard">
                            <div className="singleBoardLeft">
                                <h3 className="singleBoardLeftTitle">{singleBoard?.name}</h3>
                                <p className="singleBoardLeftDesc">
                                    {singleBoard?.description}
                                </p>
                                <p className="singleBoardLeftCreated">{activeAgo(singleBoard?.createdAt)}</p>
                            </div>

                            <div className="singleBoardRight">

                            </div>
                        </div>
                    ))} */}
                </div>

            </section>



        </>
    )


}