import { NumberFormat } from "../../pages/project/ProjectFinancialInfo"

import './NextClaim.css'

export default function NextClaim({ claimList, handleProcessClaim}) {
    let claimCount = Object.keys(claimList.submittedClaims).length +1
    let claimValue = sumNextClaim(claimList.nextClaim, claimCount)

    const handleProcessClaimClick = () => {
        handleProcessClaim()
    }

    return (
        <div className="nextClaim">
            <div className="nextClaim-header flex">
                <h1> Next Claim: { claimCount }</h1>
                <button className="btn-white" 
                        onClick={handleProcessClaimClick}>
                    Submit Claim
                </button>
            </div>

            {claimList.nextClaim.map( (item, key) => {
                return(
                    <div key={key} className="nextClaim-row">
                        <span>{item.task.task}</span>
                        <NumberFormat number={item.value} prefix='$'/>
                    </div>
                )    
            })
            // claimList.nextClaim.map( ([key, item]) => {
            //     return(
            //         <div key={key} className="nextClaim-row">
            //             <span>{item.task.task}</span>
            //             <NumberFormat number={item.value} prefix='$'/>
            //         </div>
            //     )    
            // })}
        }
            <strong>
                <div className="nextClaim-row">
                    <span>total:</span>
                    <NumberFormat number={claimValue} prefix='$'/>
                </div>
            </strong>
            
        </div>
    )
}

function sumNextClaim(nextClaim) {
    let sumValue = 0

    nextClaim.forEach(item => {
        sumValue += parseFloat(item.value)
        
    });

    return sumValue
}