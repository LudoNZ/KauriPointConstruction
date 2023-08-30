import { useState, useReducer } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useUserRole } from "../../../hooks/useUserRole";
import { useFirestore } from "../../../hooks/useFirestore";
import Collapsible from "react-collapsible";

import {
  ProgressBar,
  calculateStageProgress,
  calculateTaskClaimed,
  sumLabourList,
} from "../../../components/progressBar/ProgressBar";
import { numberWithCommas } from "../ProjectFinancialInfo";

import UpdateTaskStatus from "./components/UpdateTaskStatus";
import AddStage from "./components/AddStage";
import AddTask from "./components/AddTask";

//styles
import "../../../components/MainList.css";
import "./ProjectUpdateMainList.css";
import CreateNewStage from "./components/CreateNewStage";
import ClaimOnTask from "./components/ClaimOnTask";
import PDF_Creator from "../../../components/PDF_Creator";

export const ACTIONS = {
  CREATE_STAGE: "create_stage",
  ADD_STAGE: "add_stage",
  ADD_TASK: "add_task",
  CHANGE_STATUS: "change_status",
  DELETE_STAGE: "delete_stage",
  DELETE_TASK_ITEM: "delete_task_item",
  RESET: "reset",
  MAKE_CLAIM: "make_claim",
  REFRESH_LABOUR_LIST: "REFRESH_LABOUR_LIST",
};

function mainListReducer(reStages, action) {
  let stageTask;
  let newTask;
  //let taskIndex
  let newTaskArr;
  // console.log('reducer payload', tasks, name)
  console.log("PAYLOAD:", action);
  switch (action.type) {
    case ACTIONS.MAKE_CLAIM:
      stageTask = [...reStages];

      stageTask.forEach((stage) => {
        if (stage.name === action.stageName) {
          stage.tasks[action.index].nextClaim = action.payload.nextClaim;
          //console.log('CLAIMED AT: ', action.stageName, ' task:' ,action.index)
        }
        return;
      });

      return stageTask;

    case ACTIONS.REFRESH_LABOUR_LIST:
      stageTask = [...reStages];
      stageTask.forEach((stage) => {
        if (stage.name === "Labour") {
          stage.tasks.forEach((task) => {
            if (task.task === "Labour") {
              const newAmount = action.payload.sumCost;
              task.subcontractedamount = newAmount;
              task.calculatedamount = newAmount;
            }
          });
        }
      });
      console.log("refreshed stageTask: ", stageTask);
      return stageTask;

    case ACTIONS.CREATE_STAGE:
      stageTask = [...reStages];
      stageTask.push(action.payload.newStage);
      return stageTask;

    case ACTIONS.ADD_STAGE:
      const name = action.payload.stage;
      const tasks = action.payload.tasks;
      // console.log('Reducer')
      stageTask = [...reStages];
      stageTask.push({ name, tasks });
      return stageTask;

    case ACTIONS.ADD_TASK:
      return reStages.map((stage) => {
        // console.log('reducer', action.payload.stageName)
        // console.log('action.payload.taskList', action.payload.taskList)
        // console.log('stage', stage)
        if (stage.name === action.payload.stageName)
          return {
            ...stage,
            tasks: [
              ...stage.tasks,
              action.payload.task,
              // action.payload.taskList.map(details => {return {...details}})
            ],
          };
        return { ...stage };
      });

    // Change task details
    case ACTIONS.CHANGE_STATUS:
      stageTask = [...reStages];
      console.log("CHANGING STATUS action: ", action);
      const deleteTask = stageTask.map((stage) => {
        // console.log('action.payload.task', action.payload.task)
        // console.log('stage.tasks', stage.tasks)
        return {
          ...stage,
          tasks: stage.tasks
            .filter((task) => {
              const label = task.label ? task.label : task.task;
              return label !== action.payload.task.label;
            })
            .map((task) => {
              return { ...task };
            }),
        };
      });
      // console.log('deleteTask', deleteTask)
      // const newTaskArr = action.payload.task
      newTask = {
        ...action.payload.task,
      };

      console.log("new Task", newTask);
      return deleteTask.map((stage) => {
        // console.log('reducer', action.payload.stageName)
        // console.log('action.payload.taskList', action.payload.taskList)
        // console.log('stage', stage)
        //taskIndex = action.payload.index
        // console.log(taskIndex)
        // console.log('action.payload.stageName', action.payload.stageName)
        // console.log('stage.name', stage.name)
        // console.log('newTaskArr',newTaskArr)
        if (stage.name === action.payload.stageName) {
          newTaskArr = stage.tasks;
          newTaskArr.splice(action.payload.index, 0, newTask);
          return {
            ...stage,
            tasks: newTaskArr.map((replacetask) => {
              return { ...replacetask };
            }),
            // action.payload.taskList.map(details => {return {...details}})
          };
        }
        return { ...stage };
      });

    case ACTIONS.DELETE_STAGE:
      console.log("payload", action.payload.stageName);
      return reStages.filter(
        (stage) => stage.name !== action.payload.stageName
      );
    // return reStages

    case ACTIONS.DELETE_TASK_ITEM:
      return reStages.map((stage) => {
        return stage.name === action.payload.stageName
          ? {
              ...stage,
              tasks: stage.tasks.filter(
                (task) =>
                  (task.label ? task.label : task.task) !== action.payload.label
              ),
            }
          : { ...stage };
        //console.log('action.payload.task', action.payload.task)
        // console.log('stage.tasks', stage.tasks)
      });

    case ACTIONS.RESET:
      return action.payload;

    default:
      return reStages;
  }
}

const TaskSectionData = ({ label, value }) => {
  return (
    <div className="TaskSectionData">
      <span className="TaskSectionData-label">{label}: </span>
      <span className="TaskSectionData-value">{value}</span>
    </div>
  );
};

function TaskSection({ task, fee }) {
  return (
    <div className="TaskSection">
      <TaskSectionData label="Details" value={task.details} />
      <TaskSectionData
        label="Quote, Estimate or Provision"
        value={task.quoteEstimateOrProvision}
      />
      {task.customPercentage ? (
        <TaskSectionData
          label="custom Fee %"
          value={numberWithCommas(task.customPercentage - 1)}
        />
      ) : (
        <TaskSectionData label="project Fee %" value={fee * 100} />
      )}
      <TaskSectionData label="comment" value={task.comment} />
    </div>
  );
}

// function TaskDetails({stageKey, index, task, dispatch}) {
function TaskDetails({
  stageName,
  index,
  task,
  dispatch,
  switchUpdateMainlist,
  fee,
}) {
  const [expandTask, setExpandTask] = useState(false);
  const subcontractedamount = parseFloat(task.subcontractedamount);
  const handleExpandTask = () => {
    setExpandTask(!expandTask);
  };
  const taskName = task.label ? task.label : task.task;
  const subContractor = task.subcontractor ? task.subcontractor : " -";
  const calculatedamount = parseFloat(
    task.customPercentage
      ? subcontractedamount * task.customPercentage
      : subcontractedamount * (1 + fee)
  );
  const status = task.status ? task.status : " -";
  const claimed =
    calculateTaskClaimed(task) > 0
      ? numberWithCommas(calculateTaskClaimed(task))
      : "-";
  const percentageComplete =
    (calculateTaskClaimed(task) / calculatedamount) * 100;
  const nextClaim = task.nextClaim ? parseFloat(task.nextClaim) : 0;
  const percentageClaimed =
    ((calculateTaskClaimed(task) + nextClaim) / calculatedamount) * 100;

  return (
    <>
      <Collapsible
        onOpening={handleExpandTask}
        onClosing={handleExpandTask}
        trigger={
          <div className="mainlist-task">
            <span className={expandTask ? "arrow-down" : "arrow-right"} />
            <span className="mainlist-taskHeader-name">
              <div>{taskName}</div>
              {nextClaim > 0 && (
                <span className="mainlist-nextClaim">
                  next claim: ${numberWithCommas(nextClaim)}
                </span>
              )}
              <ProgressBar
                progress={percentageComplete}
                warning={percentageClaimed}
              />
            </span>
            <span className="mainlist-taskHeader-subContractor">
              {subContractor}
            </span>
            <div className="mainlist-taskHeader-cost space">
              {switchUpdateMainlist && (
                <ClaimOnTask
                  stageName={stageName}
                  index={index}
                  task={task}
                  dispatch={dispatch}
                />
              )}
              <span className="">
                {claimed} / {numberWithCommas(calculatedamount)}
              </span>
            </div>

            {switchUpdateMainlist ? (
              <UpdateTaskStatus
                stageName={stageName}
                index={index}
                task={task}
                dispatch={dispatch}
                fee={fee}
              />
            ) : (
              <span className="mainlist-taskHeader-status">{status} </span>
            )}
          </div>
        }
      >
        <TaskSection task={task} fee={fee} />
      </Collapsible>
    </>
  );
}

function Tasks({
  stageName,
  stage,
  dispatch,
  switchUpdateMainlist,
  fee,
  expandStages,
}) {
  return (
    <div>
      <div className="mainList-stageTasks">
        <div className="mainlist-taskHeader">
          <span className="mainlist-taskHeader-name">Task Items</span>
          <span className="mainlist-taskHeader-subContractor">
            SubContractor
          </span>
          <span className="mainlist-taskHeader-cost">Claimed / Cost</span>
          <span className="mainlist-taskHeader-status">Status</span>
        </div>

        {Object.entries(stage).map(([key, task]) => {
          return (
            <TaskDetails
              stageName={stageName}
              key={key}
              index={key}
              task={task}
              dispatch={dispatch}
              switchUpdateMainlist={switchUpdateMainlist}
              fee={fee}
            />
          );
        })}
      </div>
    </div>
  );
}

// function Stage({ stageKey, stage, dispatch }) {
function Stage({ stage, dispatch, userRole, switchUpdateMainlist, fee }) {
  const [expandStages, setExpandStages] = useState(false);

  function handleExpand() {
    setExpandStages(!expandStages);
  }

  function handleDeleteStage(e) {
    const stageName = e.target.value;
    dispatch({ type: ACTIONS.DELETE_STAGE, payload: { stageName: stageName } });
  }

  const stageFinancials = calculateStageProgress(stage, fee);
  const stageCost = stageFinancials.totalCost;
  const stageClaimed = stageFinancials.totalClaimed;
  const stageProgress = (stageClaimed / stageCost) * 100;
  const stageNextClaim = stageFinancials.totalNextClaim;
  const NextClaimProgress = ((stageClaimed + stageNextClaim) / stageCost) * 100;

  // console.log('stage: ',stage)
  return (
    <Collapsible
      onOpening={handleExpand}
      onClosing={handleExpand}
      trigger={
        <div className="mainlist-stageCard">
          <div className="mainlist-stageCard-header">
            <div className={expandStages ? "arrow-down" : "arrow-right"} />
            <div className="stageCard-header-titleBar">
              <h3>{stage.name}</h3>
              <ProgressBar
                progress={stageProgress}
                warning={NextClaimProgress}
              />
              {switchUpdateMainlist &&
                userRole === "admin" &&
                "labour" !== stage.name.toLowerCase() && (
                  <div className="updateStage-footer">
                    <AddTask stage={stage} dispatch={dispatch} />
                    <button
                      value={stage.name}
                      onClick={(e) => handleDeleteStage(e)}
                    >
                      - Delete Stage
                    </button>
                  </div>
                )}
            </div>
            <div className="mainlist-stageTotals">
              <span className="numerator">
                ${numberWithCommas(stageClaimed)}
              </span>
              <span> / ${numberWithCommas(stageCost)}</span>
            </div>
          </div>
        </div>
      }
    >
      <Tasks
        stageName={stage.name}
        stage={stage.tasks}
        dispatch={dispatch}
        switchUpdateMainlist={switchUpdateMainlist}
        fee={fee}
        expandStages={expandStages}
      />
    </Collapsible>
  );
}

// Reducer setup here
export default function ProjectUpdateMainList({
  project,
  SetSwitchUpdateMainlist,
  switchUpdateMainlist,
}) {
  const { user, authIsReady } = useAuthContext();
  const userRole = useUserRole(user);

  const passMainlist = project.mainList;
  const stages = passMainlist;
  const [reStages, dispatch] = useReducer(mainListReducer, stages);
  const { updateDocument, response } = useFirestore("projects");

  const updateLabour = () => {
    const labourListSums = sumLabourList(project);
    const wrap = {
      type: ACTIONS.REFRESH_LABOUR_LIST,
      payload: labourListSums,
    };
    dispatch(wrap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateLabour();
    const mainList = {
      mainList: reStages,
    };

    //UPDATE LABOUR

    console.log("UPDATING MAINLIST:", mainList);
    await updateDocument(project.id, mainList);

    if (!response.error) {
      //history.push('/')
      SetSwitchUpdateMainlist();
    }
  };

  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET, payload: passMainlist });
    SetSwitchUpdateMainlist();
  };
  const fee = parseFloat(project.subContractFee);

  console.log("reStages", reStages);

  return (
    <div>
      <div className="update-mainlist">
        <PDF_Creator>
          <h2>Main List:</h2>
          {Object.entries(reStages).map(([key, stage]) => {
            // console.log('stageKey',key)
            return (
              <Stage
                stage={stage}
                dispatch={dispatch}
                key={key}
                userRole={userRole}
                switchUpdateMainlist={switchUpdateMainlist}
                fee={fee}
              />
            );
          })}
          {switchUpdateMainlist && (
            <>
              <AddStage stage={stages} dispatch={dispatch} />
              <CreateNewStage stage={stages} dispatch={dispatch} />
            </>
          )}
        </PDF_Creator>

        <div className="sticky-bottom">
          {switchUpdateMainlist ? (
            <>
              <button onClick={handleSubmit} className="btn " id="btn_right">
                Save All Changes
              </button>
              <button
                onClick={handleReset}
                className="btn-cancel"
                id="btn_right"
              >
                Discard Changes
              </button>
            </>
          ) : (
            <button
              className="btn-white"
              onClick={() => {
                SetSwitchUpdateMainlist();
              }}
            >
              + Update Main List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
