import { useState } from "react"
import { useDocument } from "../../hooks/useDocument"

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
                stage.tasks.map(task => <div className='task'>{task.task}</div>)
            }
        </div>
    )
}

export default function MainList() {
    const {error, document} = useDocument('taskLibrary', 'mainList')
    
    console.log('MAINLIST: ', document)
    console.log('error: ', error)

    if (!document) {
        return <div>Loading...</div>;
      }
      
    return(
        
        <div>
            {document.stages.map(stage => <StageCard stage={stage} />)}
        </div>
    )
}