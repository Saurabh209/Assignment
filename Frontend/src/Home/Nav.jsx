import React from 'react';
import { useBoard } from "../../Context/BoardContext";
const Nav = () => {

    const { selectedBoard } = useBoard();
    console.log("selectedBoard", selectedBoard, Math.random)
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#1e1e1e",
                color: "white",
                padding: "10px 20px",
                borderBottom: "2px solid #333",
                fontFamily: "monospace",
            }}
        >
            <span style={{ fontWeight: "bold", letterSpacing: "0.5px" }}>
                ⚙️ Assignment
            </span>


            <div
                style={{
                    fontSize:"18px",
                    color: "#00ff88",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}

            >
                {selectedBoard?.name}
            </div>




        </div>
    );
};

export default Nav;