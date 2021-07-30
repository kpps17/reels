import React, { useEffect, useState } from "react";

const UseEffect = () => {
    const [task, setTask] = useState("");
    const [taskList, setTaskList] = useState([]);
    
    const handleAddTask = () => {
        let newTaskList = [...taskList, {id: Date.now(), task: task}];
        setTaskList(newTaskList);
        setTask("");
    }

    return ( 
        <div className="task-container">
            <div className="task-input">
                <input type="text" value={task} onChange={(e) => { setTask(e.target.value); }}/>
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <div className="task-list">
                {taskList.map((taskObj) => {
                    return <div key={taskObj.id}> {taskObj.task} </div>
                })}
            </div>
        </div>
    );
}
 
export default UseEffect;