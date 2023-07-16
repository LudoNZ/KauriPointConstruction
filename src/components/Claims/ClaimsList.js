import './ClaimsList.css'

import { NumberFormat, numberWithCommas } from '../../pages/project/ProjectFinancialInfo'
import NextClaim from './NextClaim'
import { useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'

export default function ClaimsList ({ project }) {
    const [mainList, setNewMainList] = useState(project.mainList)
    const [claimList, setClaimList] = useState(updateClaims(project.mainList))
    const { updateDocument, response } = useFirestore('projects')
    
    console.log('CLAIM LIST initial state:', claimList)

    let claimCount = Object.keys(claimList.submittedClaims).length +1

    const handleProcessClaim = async () => {
        setNewMainList(processClaim(mainList, claimCount))
        setClaimList(updateClaims(mainList))
        
        //Save mainlist
        let newMainList = { mainList: mainList}
        console.log('UPDATING MAINLIST:', newMainList)
        await updateDocument(project.id, newMainList)
    }

    if (!response.error) {
        //history.push('/')
      }


    return (
        <div>
            <NextClaim claimList={claimList} handleProcessClaim={handleProcessClaim}/>
            
            <h1>Project Claims:</h1>

            {claimList 
            
                ? <div>{Object.entries(claimList.submittedClaims).map(([key, claim] ) => {
                    let totalClaim = claimTotal(claim)
                    return (
                        <div key={key} className='claimCard'>
                            <div className='flex'>
                                <p className='claim-count'>claim: {key}</p>
                                <p className='claim-total'>$ {numberWithCommas(totalClaim)}</p>
                            </div>
                            
                            <div>{Object.entries(claim.tasks).map( ([key, task]) => {
                                return (
                                    <div key={key} className='claimCard-row'>
                                        <p className='row-name'>{task.task.task}</p>
                                        <NumberFormat number={task.value} prefix='$'/>
                                        <NumberFormat number={numberWithCommas(task.task.calculatedamount)} prefix='/' className='taskTotal'/>
                                    </div>
                                )
                            })}</div>
                        </div>
                    )
                })}</div> 
                
                : <p>NO CLAIMS</p>}

        </div>
    )
} 

// collect claim info from mainList tasks and update the claims collection
function updateClaims( mainlist ) {
    let projectClaims = {
        submittedClaims: {},
        nextClaim: [],
    }

    console.log('MAINLIST: ', mainlist )

    mainlist.forEach(stage => {
        stage.tasks.forEach(task => {
            if(task.nextClaim) {
                projectClaims.nextClaim.push({
                    task: task,
                    value: task.nextClaim
                })
            }

            if(task.claims) {
                Object.entries(task.claims).forEach( ([claim, value]) => {
                    //console.log('TASK_NAME:', task.task, ', CLAIM:', claim, ', VALUE:', value)
                    
                    
                    projectClaims.submittedClaims[claim] 
                        //if claim exists
                        ? projectClaims.submittedClaims[claim].tasks.push({
                                task: task,
                                value: value,
                                })
                        //if claim doesnt exist yet
                        : projectClaims.submittedClaims[claim] = {                                
                            tasks: [{
                                task: task,
                                value: value,
                                },]
                        }
                return
                })
            }
        })
           
    })

    console.log('projectClaims:', projectClaims)
    
    return projectClaims

}

//calculate total value of each claim
function claimTotal(claim) {
    let claimTotal = 0;

    claim.tasks.forEach(c => {
        claimTotal += parseFloat(c.value)
    });

    return claimTotal
}

//move next claim data into an actual claim.
function processClaim(mainList, claimCount) {
    console.log("PROCESSING CLAIM....")
    mainList.forEach(stage => {
        stage.tasks.forEach(task => {
            if(task.nextClaim) {
                console.log('TASK: ', task.nextClaim , task.task)
                task.claims[claimCount] = task.nextClaim
                task.nextClaim = null
            }
        })
    })
    return mainList
}