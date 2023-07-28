import { useState } from "react";
import LabourList from "./labourList";
import MainList from "./mainList";
import Sidebar from "../../components/Sidebar";

export default function Library() {
    const [switchList, setSwitchList] = useState('LABOUR_LIST')

    const ListPicker = () => {
        return (
            <div className='libraryNav'>
                <button 
                    onClick={() => setSwitchList('MAIN_LIST')}
                    className='btn'
                    id={switchList === "MAIN_LIST" ? 'btn-active' : 'btn-disabled'}
                    >Main List</button>
                <button 
                    onClick={() => setSwitchList('LABOUR_LIST')}
                    className='btn'
                    id={switchList === "LABOUR_LIST" ?'btn-active' : 'btn-disabled'}
                    >Labour List</button>
            </div>
        )
    }

    return (
        <div className='page-container'>
            <Sidebar />
            <div className='content-container'>
                <ListPicker />

                {switchList === 'MAIN_LIST' && 
                    <MainList />
                }  
                {switchList === 'LABOUR_LIST' && 
                    <LabourList />    
                }
            </div>
        </div>
    )
}