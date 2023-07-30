import { useState } from "react";
import LabourList from "./labourList";
import MainList from "./mainList";
import Sidebar from "../../components/Sidebar";
import { useCollection } from "../../hooks/useCollection";
import { useEffect } from "react";

export default function Library() {
    const { documents, error } = useCollection('taskLibrary')
    const [switchList, setSwitchList] = useState('LABOUR_LIST')
    const [labourList, setLabourList] = useState([])
    const [mainList, setMainList] = useState([])

    useEffect(() => {
        if(documents){
            console.log('DOCUMENTSa:', documents)
            const lList = documents.filter(doc => doc.id === 'labourList')[0].stages
            const mList = documents.filter(doc => doc.id === 'mainList')[0].stages
          setLabourList(lList)
          setMainList(mList)
        }  
      }, [documents])


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
                {error && <div>{error}</div>}
                <ListPicker />

                {switchList === 'MAIN_LIST' && 
                    <MainList list={mainList}/>
                }  
                {switchList === 'LABOUR_LIST' && 
                    <LabourList list={labourList}/>    
                }
            </div>
        </div>
    )
}