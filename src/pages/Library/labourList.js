import { useState } from "react"

//styles
import './library.css'

const StageCard = ({stage}) => {
    const [expandCard, setExpandCard] = useState(false)

    const handleExpand = () => {
        setExpandCard(!expandCard)
    }

    return (
        <div className="card">
            <h2 className="title" onClick={handleExpand}>{stage.name}</h2>
            {expandCard &&
                stage.tasks.map(task => <div className='task'>{task.name}</div>)
            }
        </div>
    )
}

export default function LabourList({list}) {
    console.log('LABOURLIST: ', list)

    return(
        
        <div>
            {list.map(stage => <StageCard stage={stage} key={stage.name}/>)}
        </div>
    )
}