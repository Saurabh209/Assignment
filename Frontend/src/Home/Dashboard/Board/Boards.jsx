import { useEffect } from "react";
import { useBoard } from "../../../../Context/BoardContext";
import './Boards.scss'


export default function Boards() {
    const { boards, setBoards, selectedBoard, setSelectedBoard, tasks, setTasks } = useBoard();


    return (
        <>
            <section className="BoardContainer">
              {boards.map((singleBoard, index)=>{
                return(
                    <div className="singleBoard">
                        <p>{singleBoard.name}</p>
                    </div>
                )
              })}
            </section>


        </>
    )


}