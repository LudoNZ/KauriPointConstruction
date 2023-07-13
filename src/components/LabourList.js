import React, {useState, useReducer} from 'react';
import './LabourList.css'
import { calculateStageLabour } from './progressBar/ProgressBar';
import { useFirestore } from '../hooks/useFirestore';
import AddLabourTask from './LabourList_AddTask';
import LabourListAddStage from './LabourList_AddStage';

function labourListReducer(reLabourList, action) {
//WORK IN PROGRESS
//console.log('reLabourList: ', reLabourList)
let stages
let tempLabourList = [...reLabourList]
    switch (action.type) {
        case 'UPDATE_EXPECTED_HOURS':
            console.log('PAYLOAD: ', action)
            tempLabourList.forEach( stage => {
                if(stage.name === action.payload.stage) {
                    //console.log("DISPATCH UPDATING STAGE: ", stage)
                    stage.tasks.forEach(task => {
                        const taskId = task.label ? task.label : task.name
                        if(taskId === action.payload.task){
                            task.hoursPredicted = action.payload.hoursPredicted
                        }
                    });
                }
                
            });
            return tempLabourList

        case 'ADD_STAGE':
            const name = action.payload.stage
            const tasks = action.payload.tasks
            // console.log('Reducer')
            tempLabourList.push({ name, tasks })
        return tempLabourList
        
        case 'ADD_TASK':
            console.log('REDUCER PAYLOAD: ', action.payload)
            return reLabourList.map(stage => {
                // console.log('action.payload.taskList', action.payload.taskList)
                console.log('stage', stage)
                if(stage.name.toString().toLowerCase() === action.payload.stageName.toString().toLowerCase() )
                  return {
                    ...stage,
                    tasks: [
                      ...stage.tasks, 
                      action.payload.task,                 
                    ]}
                return { ...stage }
            })

        default:
            return reLabourList
    }
}

export default function LabourList({ project }) {
    //console.log('PROJECT: ', project, ' TEAM: ', team)
    const [reLabourList, dispatchLabourList] = useReducer(labourListReducer, project.labourList)
    const [switchUpdateLabourList, setSwitchUpdateLabourList] = useState(false)
    const { updateDocument, response } = useFirestore('projects')
    
    let missingRoles = []
    missingRoles = checkMinTeam(project.labourList, project.team)

    const switchUpdate = () => {
        setSwitchUpdateLabourList(!switchUpdateLabourList)
    }

    const handleSubmit = async() => {
        const newLabourList = {
            labourList: reLabourList
        }
    
        //console.log('UPDATING LabourList: ', newLabourList)
        await updateDocument(project.id, newLabourList)
    
        if (!response.error) {
            //history.push('/')
            switchUpdate()
          }
      }
      

    return (
        <>
            { missingRoles.length > 0 && (
                <div className='error'>
                    WARNING MISSING ROLES! 
                    {missingRoles.map(role => {
                        return <p>{role}</p>
                    })}
                </div>
             )}
    
            { Object.entries( reLabourList ).map( ([key, stage ]) => {
                return (
                    <LabourStageCard key={key} 
                                    stage={stage} 
                                    team={project.team} 
                                    switchUpdateLabourList={switchUpdateLabourList} 
                                    dispatchLabourList={dispatchLabourList}
                                    />    
            )})}

            { switchUpdateLabourList &&
            <LabourListAddStage stage={project.labourList} dispatch={dispatchLabourList} />
            }

            <div className='sticky-bottom'>
                {switchUpdateLabourList 
                ?
                <>
                    <button  onClick={() => {handleSubmit()}} className="btn " id="btn_right">Save All Changes</button>
                </>
                : 
                <button className='btn-white' onClick={() => {switchUpdate()}}>+ Update Labour List</button>  
                }
            </div>
        </>
    )
}

function checkMinTeam(labourList, team) { 
    let missingRoles = []

    labourList.forEach((stage) => {
        stage.tasks.forEach(task => {
            Object.keys(task.hoursPredicted).forEach((role) => {
                //console.log('PREDICTION: ', role, prediction)
                const match = matchTeam(role, team) 
                if(!match) {
                    if(!missingRoles.includes(role)) {
                        missingRoles.push(role)
                    }
                }   
            })
        })
    });
    //console.log('MISSING_ROLES: ', missingRoles)
    return missingRoles
}

function matchTeam(role, team) {
    let match = false
    team.forEach(member => {
        if(role === member.role){ match = true }
    }) 
    return match
}

function LabourStageCard({stage, team, switchUpdateLabourList, dispatchLabourList}) {
    const [expandLabourStage, setExpandLabourStage] = useState(false)
    const handleToggleStage = ()=>{setExpandLabourStage(!expandLabourStage)}
    //const staffRole = Object.entries(team).map( staff => staff.role)
    
    let totalDays = []

    
    //sum hours for each team member
    team.forEach(member => {
        let days = calculateMemberDays(member)
        totalDays.push({
            days: days,
            cost: days * member.rate,
        })        
    });

    function calculateMemberDays(member) {
        //console.log('MEMBER: ', member)
        //console.log('!STAGE: ', stage )
        let sumDays = 0.0
        //console.log('STAGE: ', stage )
        stage.tasks.forEach( task => {
            //console.log('TASK: ', task )
            const hours =  parseFloat(task.hoursPredicted[member.role]) ? parseFloat(task.hoursPredicted[member.role]) : 0
            sumDays += hours
        });
        //console.log('SUM DAYS: ', member, sumDays)
        return sumDays
    }


    //console.log('totalDays: ', totalDays)
    
    function setSum(total, num){
        if(!num || num===" ") {
            num = 0
        }
        return total + parseFloat(num)
    }   

    //Calculate stage labour
    const stageLabourHours = calculateStageLabour(stage.tasks, team)

    function handleTaskUpdate(taskToUpdate) {
        let updateTask = {  ...taskToUpdate,
                        stage: stage.name,
                    }
        //console.log('UPDATING: ', stageUpdate)
        dispatchLabourList({    type: 'UPDATE_EXPECTED_HOURS',
                                payload: updateTask,
                                })
    }
    return (
        <div className='labourStageCard'>
            <div onClick={handleToggleStage} className='stage-container'>
                <div className="stage-name-container">{stage.name}</div>
                <div className="stage-role-container">
                    {expandLabourStage && team.map((member) => {return <span key={member.role}>{member.role}</span>})}
                </div>
            </div>
            {expandLabourStage && 
            
                <>
                    <LabourStageTask stage={stage.tasks} 
                                                    team={team} 
                                                    switchUpdateLabourList={switchUpdateLabourList} 
                                                    handleTaskUpdate={handleTaskUpdate}
                                                    />
                                                    
                    {switchUpdateLabourList && 
                    <AddLabourTask stage={stage} dispatch={dispatchLabourList}/>
                    }
                
                    <div className='labourList-StageTask labourList-StageSum'>
                        <div className='task-container'>Sum Days:</div>
                        <div className='hours-container'>
                            {totalDays.map((totalDay, key) => <span key={key}>{totalDay.days}</span>)}
                        </div>
                    </div>
                    <div className='labourList-StageTask labourList-StageSum'>
                    <div className='task-container'>Sum Cost:</div>
                        <div className='hours-container'>
                        {totalDays.map((totalDay, key) => 
                            <span key={key}>${totalDay.cost}</span>
                        )}
                        </div>
                    </div>
                </>
            }

            <div className='labourList-StageTask labourList-StageTotal'>
                <span>Stage Totals</span>
                <span>{stageLabourHours.stageDays}</span>
                <span>${stageLabourHours.stageCost}</span>
            </div>
        </div>
    )
}


function LabourStageTask({ stage, team, switchUpdateLabourList, handleTaskUpdate }){
    
    
    return (
        <>
            {Object.entries(stage).map( ([key, task]) => {
                //console.log('TASK: ', task)
                function handleHoursUpdate(hoursPredicted) {
                    const taskToUpdate = {  task: task.label ? task.label : task.name,
                                        hoursPredicted: {...hoursPredicted},
                                        }
                    handleTaskUpdate(taskToUpdate)
                }
                return(
                    <div key={key}>
                    <div className='labourList-StageTask' key={key}>
                        <div className='task-container'>{task.label ? task.label : task.name}</div>
                        <div className='hours-container'> 
                            { switchUpdateLabourList 
                                ? <UpdateLabourTaskHours hoursPredicted={task.hoursPredicted} 
                                                        team={team} 
                                                        handleHoursUpdate={handleHoursUpdate}
                                                        />
                                : <LabourTaskHours hoursPredicted={task.hoursPredicted} 
                                                team={team}/>
                            }
                        </div>
                    </div>
                    <div className='lineSeperator'><div></div></div>
                    </div>
                )
            })}
        </>
    )
}

function LabourTaskHours({ hoursPredicted, team}){
    // console.log('TEAM:', team, 'HOURS_PREDICTED:', hoursPredicted)

    return (
        //cycle through Team member list and assign estimated hours from each task
        <>
            {team.map( member => {
                const hours = (hoursPredicted[member.role] ? hoursPredicted[member.role] : '-')
                return (
                    <span key={member.role} className="single-hour-container">{hours}</span>
                )
            })}

        </>
    )
}
function UpdateLabourTaskHours({ hoursPredicted, team, handleHoursUpdate}){
    //console.log('HOURS_PREDICTED:', hoursPredicted)
    // console.log('TEAM:', team)

    const [reHoursPredicted, setReHoursPredicted] = useState(hoursPredicted)

    const handleUpdate = (role, value) => {
        let tempReHoursPredicted = {...reHoursPredicted}
        tempReHoursPredicted[role] = value
        setReHoursPredicted(tempReHoursPredicted)
        handleHoursUpdate(tempReHoursPredicted)
    }

    return (
        //cycle through Team member list and assign estimated hours from each task
        <div className='flex'>
            {team.map((member, key) => {
                let hours = reHoursPredicted[member.role] ? reHoursPredicted[member.role] : '-'
                return (
                    <label key={key} className="single-hour-container">
                        <input  
                            type='number' 
                            onChange={(e) => {handleUpdate(member.role, e.target.value)}}
                            value = {hours}
                            step={0.25}
                        ></input>
                    </label>
                )
            })}
        </div>
    )
}

// function CalcTotalAmountPerRoll({stage, team}) {
// const staffRate = Object.entries(team).map(([i, staff]) => staff.rate)
//   return{
//     <>>
//   }
// }