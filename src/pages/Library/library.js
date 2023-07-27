import { useState } from "react";
import LabourList from "./labourList";
import MainList from "./mainList";

export default function Library() {
    const [switchList, setSwitchList] = useState(true)

    const handleSwitch = () => {
        setSwitchList(!switchList)
    }
    return (
        <div>
            <h2 onClick={handleSwitch}>Library</h2>
            {switchList && 
                <MainList />
            }  
            {!switchList && 
                <LabourList />    
            }
        </div>
    )
}