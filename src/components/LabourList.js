import React, {useState} from 'react';
import './LabourList.css'
import { calculateStageLabour } from './progressBar/ProgressBar';

export default function LabourList({ labourList , team }) {
    //console.log('TEAM: ', team)
    return (
        <>
            { Object.entries( labourList ).map( ([key, stage ]) => {
                return (
                    <LabourStageCard key={key} stage={stage} team={team} />    
            )})}
        </>
    )
}

function LabourStageCard({stage, team}) {
    const [expandLabourStage, setExpandLabourStage] = useState(false)
    const handleToggleStage = ()=>{setExpandLabourStage(!expandLabourStage)}
    //const staffRole = Object.entries(team).map( staff => staff.role)
    
    let totalDays = []

    
    //sum hours for each team member
    team.forEach(member => {

    });


    console.log('totalDays: ', totalDays)
    
    function setSum(total, num){
        if(!num || num===" ") {
            num = 0
        }
        return total + parseFloat(num)
    }   

    //Calculate stage labour
    const stageLabourHours = calculateStageLabour(stage.tasks, team)

    return (
        <div className='labourStageCard'>
            <div onClick={handleToggleStage} className='stage-container'>
                <div className="stage-name-container">{stage.name}</div>
                <div className="stage-role-container">
                    {expandLabourStage && team.map((member) => {return <span>{member.role}</span>})}
                </div>
            </div>
            {expandLabourStage && <LabourStageTask stage={stage.tasks} team={team} />}
            <div className='labourList-StageTask labourList-StageSum'>
                <div className='task-container'>Sum Days:</div>
                <div className='hours-container'>
                    {totalDays.map((totalDay) => <span>{totalDay}</span>)}
                </div>
            </div>
            <div className='labourList-StageTask labourList-StageSum'>
              <div className='task-container'>Sum cost:</div>
                <div className='hours-container'>
                  {/* {totalDays.map((totalDay, staffRate) => 
                    <span>{totalDay * staffRate}</span>
                  )} */}
                </div>
            </div>
            <div className='labourList-StageTask labourList-StageTotal'>
                <span>Stage Totals</span><span>{stageLabourHours.stageDays}</span><span>${stageLabourHours.stageCost}</span>
            </div>
        </div>
    )
}


function LabourStageTask({ stage, team }){
    return (
        <>
            {Object.entries(stage).map( ([key, task]) => {
                return(
                    <>
                    <div className='labourList-StageTask' key={key}>
                        <div className='task-container'>{task.name}</div>
                        <div className='hours-container'> 
                            <LabourTaskHours hoursPredicted={task.hoursPredicted} team={team}/>
                        </div>
                    </div>
                    <div className='lineSeperator'><div></div></div>
                    </>
                )
            })}
        </>
    )
}

function LabourTaskHours({ hoursPredicted, team}){
    console.log('HOURS_PREDICTED:', hoursPredicted)
    console.log('TEAM:', team)

    return (
        //cycle through Team member list and assign estimated hours from each task
        <>
            {team.map((member) => {
                const hours = (hoursPredicted[member.role] ? hoursPredicted[member.role] : '-')
                return (
                    <span className="single-hour-container">{hours}</span>
                )
            })}

        </>
    )
}

// function CalcTotalAmountPerRoll({stage, team}) {
// const staffRate = Object.entries(team).map(([i, staff]) => staff.rate)
//   return{
//     <>>
//   }
// }