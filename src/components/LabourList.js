import React, {useState} from 'react';
import './LabourList.css'
import { calculateStageLabour } from './progressBar/ProgressBar';

export default function LabourList({ labourList , team }) {
    //console.log('TEAM: ', team)
    let missingRoles = []
    missingRoles = checkMinTeam(labourList, team)

    return (
        <>
            { missingRoles && (
                <div className='error'>
                    WARNING MISSING ROLES! {missingRoles.map(role => {
                        return <p>{role}</p>
                    })}
                </div>
             )}
    
            { Object.entries( labourList ).map( ([key, stage ]) => {
                return (
                    <LabourStageCard key={key} stage={stage} team={team} />    
            )})}
        </>
    )
}

function checkMinTeam(labourList, team) { 
    let missingRoles = []

    labourList.forEach(stage => {
        stage.tasks.forEach(task => {
            Object.entries(task.hoursPredicted).forEach(([role, prediction]) => {
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

function LabourStageCard({stage, team}) {
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

        let sumDays = 0.0

        stage.tasks.forEach( task => {
            const hours = parseFloat(task.hoursPredicted[member.role]) ? parseFloat(task.hoursPredicted[member.role]) : 0
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

    return (
        <div className='labourStageCard'>
            <div onClick={handleToggleStage} className='stage-container'>
                <div className="stage-name-container">{stage.name}</div>
                <div className="stage-role-container">
                    {expandLabourStage && team.map((member) => {return <span key={member.role}>{member.role}</span>})}
                </div>
            </div>
            {expandLabourStage && <LabourStageTask stage={stage.tasks} team={team} />}


            {/* sums for each team member for each stage */}
            {expandLabourStage &&
            (<>
                <div className='labourList-StageTask labourList-StageSum'>
                    <div className='task-container'>Sum Days:</div>
                    <div className='hours-container'>
                        {totalDays.map((totalDay, key) => <span>{totalDay.days}</span>)}
                    </div>
                </div>
                <div className='labourList-StageTask labourList-StageSum'>
                <div className='task-container'>Sum Cost:</div>
                    <div className='hours-container'>
                    {totalDays.map((totalDay, key) => 
                        <span>${totalDay.cost}</span>
                    )}
                    </div>
                </div>
            </>)
            }

            <div className='labourList-StageTask labourList-StageTotal'>
                <span>Stage Totals</span>
                <span>{stageLabourHours.stageDays}</span>
                <span>${stageLabourHours.stageCost}</span>
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
    // console.log('HOURS_PREDICTED:', hoursPredicted)
    // console.log('TEAM:', team)

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