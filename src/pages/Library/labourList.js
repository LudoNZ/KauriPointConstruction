import { useState } from "react";

//styles
import "./library.css";
import { useReducer } from "react";
import { FormInput } from "../create/Create";
import { useFirestore } from "../../hooks/useFirestore";

function labourListReducer(reLabourList, action) {
  console.log("REDUCER: ", action);
  let modList = [...reLabourList];
  switch (action.type) {
    case "ADD_TASK":
      return modList.map((stage) => {
        if (stage.name == action.payload.stageName) {
          return {
            ...stage,
            tasks: [...stage.tasks, action.payload.task],
          };
        }
        return { ...stage };
      });
    case "UPDATE_TASK":
      return modList.map((stage) => {
        if (stage.name === action.payload.stageName) {
          const updatedTasks = stage.tasks.map((task) => {
            if (task.name === action.payload.task.name) {
              return action.payload.task;
            }
            return task;
          });
          return {
            ...stage,
            tasks: updatedTasks,
          };
        }
        return { ...stage };
      });
    case "DELETE_TASK":
      return modList.map((stage) => {
        if (stage.name == action.payload.stageName) {
          return {
            ...stage,
            tasks: stage.tasks.filter((task) => task !== action.payload.task),
          };
        }
        return { ...stage };
      });

    case "ADD_STAGE":
      return [
        ...modList,
        {
          name: action.payload.stageName,
          tasks: [],
        },
      ];

    case "DELETE_STAGE":
      return modList.filter((stage) => stage.name !== action.payload.stageName);

    default:
      return reLabourList;
  }
}

const AddTask = ({ dispatch, stageName }) => {
  const [taskName, setTaskName] = useState("");

  const handleAddTask = () => {
    const payload = {
      stageName: stageName,
      task: { name: taskName },
    };
    dispatch({ type: "ADD_TASK", payload: payload });
  };
  const handleUpdateTask = (oldTask, newTask) => {
    const payload = {
      stageName: stage.name,
      oldTask: oldTask,
      newTask: newTask,
    };
    dispatch({ type: "UPDATE_TASK", payload: payload });
  };
  const handleDeleteTask = (task) => {
    const payload = {
      stageName: stage.name,
      task: task,
    };
    dispatch({ type: "DELETE_TASK", payload: payload });
  };

  return (
    <div className="flex">
      <FormInput
        label="New Task:"
        value={taskName}
        onChange={(e) => {
          setTaskName(e.target.value);
        }}
      />
      <button onClick={handleAddTask} className="btn-green">
        Add Task
      </button>
    </div>
  );
};

const StageCard = ({ stage, dispatch }) => {
  const [expandCard, setExpandCard] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");

  const handleExpand = () => {
    setExpandCard(!expandCard);
  };
  const handleUpdateTask = (oldTask, newTask) => {
    const payload = {
      stageName: stage.name,
      oldTask: oldTask,
      newTask: { name: newTask },
    };
    dispatch({ type: "UPDATE_TASK", payload: payload });
    setUpdatedTask(""); // Clear the input after updating
  };
  const handleDeleteTask = (task) => {
    const payload = {
      stageName: stage.name,
      task: task,
    };
    dispatch({ type: "DELETE_TASK", payload: payload });
  };
  return (
    <div className="card">
      <h2 className="title" onClick={handleExpand}>
        {stage.name}
      </h2>

      {expandCard && (
        <div>
          <AddTask stageName={stage.name} dispatch={dispatch} />
          {stage.tasks.map((task) => (
            <div className="task" key={task.name}>
              {task.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LabourList({ list }) {
  const { updateDocument, response } = useFirestore("taskLibrary");

  const [reLabourList, dispatch] = useReducer(labourListReducer, list);
  console.log("LABOURLIST: ", reLabourList);

  const handleSave = async (reList) => {
    const labourList = {
      stages: reList,
    };
    console.log("UPDATING LABOUR LIST:", labourList);
    await updateDocument("labourList", labourList);
  };
  return (
    <div>
      {reLabourList && (
        <>
          <div className="btn-green" onClick={() => handleSave(reLabourList)}>
            {" "}
            Save Changes{" "}
          </div>
          {reLabourList.map((stage) => (
            <StageCard stage={stage} key={stage.name} dispatch={dispatch} />
          ))}
        </>
      )}
    </div>
  );
}
