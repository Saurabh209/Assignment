import React, { useState, useEffect } from "react";
import "./ActivityArea.scss";


const Activity = ({ initialItems }) => {


    useEffect(() => {
        // Placeholder for loading live activity or subscribing to updates.
        // Example:
        // fetch("/api/activity").then(r => r.json()).then(setItems);
        return () => {
            // cleanup if needed
        };
    }, []);

    return (
        <section className="activityAreaContainer">
            <div className=""></div>
            <div className=""></div>
        </section>
    );
};


export default Activity;