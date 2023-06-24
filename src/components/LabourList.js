import React, {useState} from 'react';
import './LabourList.css'
import { calculateStageLabour } from './progressBar/ProgressBar';

export default function LabourList({ labourList , team }) {
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
    const staffRole = Object.entries(team).map( staff => staff.role)
    // const staffRate = Object.entries(team).map(([i, staff]) => staff.rate)
    // const [totalHours, setTotalHours] = useState([{}])

    // const roleOne = calcHours.map((role) => role.at(0))
    // const a = roleOne.reduce(setSum, 0)
    // console.log(roleOne)
    //console.log(calcHours)
    // console.log('At', a)

    let totalDays = []

    const calcHours = Object.entries(stage.tasks).map(([key, task]) => (
        Object.entries(task.hoursPredicted).map(([role, hours]) =>  hours)
    ))

    for (let i = 0; i < staffRole.length; i++ ){
        const hourArray = calcHours.map((role) => role.at(i))
        const hourSum = hourArray.reduce(setSum, 0)
        // console.log('for:', hourSum)
        totalDays.push(hourSum)
        // console.log('TotalSum',i, ': ',totalDyas)
    }

    function setSum(total, num){
        if(!num || num===" ") {
            num = 0
        }
        return total + parseFloat(num)
    }   

    //Calculate stage labour
    const stageLabourHours = calculateStageLabour(stage.tasks)

    return (
        <div className='labourStageCard'>
            <div onClick={handleToggleStage} className='stage-container'>
                <div className="stage-name-container">{stage.name}</div>
                <div className="stage-role-container">
                {staffRole.map((role) => (<div>{role}</div>))}
                </div>
            </div>
            {expandLabourStage && <LabourStageTask stage={stage.tasks} />}
            <div className='labourList-StageTask labourList-StageSum'>
                <div className='task-container'>Total Days:</div>
                <div className='hours-container'>
                    {totalDays.map((totalDay) => <span>{totalDay}</span>)}
                </div>
            </div>
            <div className='labourList-StageTask labourList-StageSum'>
              <div className='task-container'>Total Amount:</div>
                <div className='hours-container'>
                  {/* {totalDyas.map((totalDay, staffRate) => 
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


function LabourStageTask({ stage }){
    return (
        <>
            {Object.entries(stage).map( ([key, task]) => {
                return(
                    <>
                    <div className='labourList-StageTask' key={key}>
                        <div className='task-container'>{task.name}</div>
                        <div className='hours-container'> 
                            <LabourStageHours hoursPredicted={task.hoursPredicted} />
                        </div>
                    </div>
                    <div className='lineSeperator'><div></div></div>
                    </>
                )
            })}
        </>
    )
}

function LabourStageHours({ hoursPredicted }){
    // console.log(hoursPredicted)
    return (      
        <>
            {Object.entries(hoursPredicted).map( ([role, hours]) => {
                if( hours === "" || hours===" " ){
                    hours = "-"
                }
                return(
                    <React.Fragment key={role}>
                        <div className="single-hour-container">
                            <span> {hours} </span>
                        </div>  
                    </React.Fragment>
                )}   
            )}
        </>
    )
}

// function CalcTotalAmountPerRoll({stage, team}) {
// const staffRate = Object.entries(team).map(([i, staff]) => staff.rate)
//   return{
//     <>>
//   }
// }