import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
// import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'

// styles
import './Create.css'
import Sidebar from '../../components/Sidebar'

//to prep VBA import docs
import modifyData from './updateList'


export default function Create() {
  const history = useHistory()
  const { addDocument, response } = useFirestore('projects')
  const { documents } = useCollection('projects')
  // const { user } = useAuthContext()

  // form field values
  const [name, setName] = useState('')
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [line1, setLine1] = useState('')
  const [suburb, setSuburb] = useState('')
  const [city, setCity] = useState('')
  
  // const [financialSummary, setfinancialSummary] = useState([])
  const [projectList, setProjectList] = useState([])
  const [tempMain, setTempMain] = useState(null)
  const [tempLabourList, setTempLabourList] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [subContractFee, setSubContractFee] = useState('')
  const [description, setDescription] = useState([])
  const [memberName, setMemberName ] = useState('') 
  const [memberRole, setMemberRole ] = useState('') 
  const [memberRate, setMemberRate ] = useState('') 
  const [teamList, setTeamList] = useState([])

  // console.log(teamList)

  const [formError, setFormError] = useState(null)

  // console.log(startDate)
  useEffect(() => {
    if(documents){
      const options = documents.map(project => {
        return { value: {...project, id:project.id}, label: project.name}
      })
      setProjectList(options)
    }
  }, [documents])

  const handleTeamAdd = (e) => {
    (e).preventDefault()
    const member = {name: memberName, role: memberRole, rate: memberRate}
    setTeamList([...teamList, member])
    setMemberName('')
    setMemberRole('') 
    setMemberRate('') 
  }

  const handleTeamRemove = (index) => {
    const list = [...teamList]
    list.splice(index, 1)
    setTeamList(list)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setFormError(null)
    if(!projectList){
      setFormError('Please select a task group')
      return
    }

    const address = {
        line1,
        suburb,
        city,   
    }

    const blankLabourList = [{
      name: 'Labour',
      tasks: [{
        task:'Labour',
        details: 'Summary of Labour List tasks. refresh MainList to update',        
        quoteEstimateOrProvision: "",
        status: "Open",
        subcontractedamount: 0,
        subcontractor: 'KPC',
       }]
    }]

    let project = {
      name,
      clientName,
      phone,
      email,
      address, 
      mainList: tempMain ? tempMain.value.mainList : blankLabourList,
      labourList: tempLabourList ? tempLabourList.value.labourList: [],
      startDate: timestamp.fromDate(new Date(startDate)),
      subContractFee,
      description,
      team: teamList,
      projectStatus: "upcoming"
    }

    //Restart progress on all tasks
    project = resetProject(project)
   

    //IMPORT PROJECT
    //DUMP PROJECT HERE:
    //project = {}
    // **MODIFY EXCEL IMPORTED DATA**
    //project = modifyData(project)

    await addDocument(project)

    if (!response.error) {
      history.push('/')
    }
  }

  const handleSubContractFee = (value) =>  {
    let restrictedValue = value > 1 ? value/100 : value
    setSubContractFee(restrictedValue)
  }

  return (
    <div className='page-container'>
    <Sidebar />
    <div className='content-container'>
      <h2 className="page-title">Create new project</h2>
      <div className="create-form">
        <h2>New Project form</h2>
        <form onSubmit={handleSubmit}>
          
            <FormInput label='Title' onChange={setName} value={name} />
            <FormInput label='Client' onChange={setClientName} value={clientName} />
            <FormInput label='Phone' onChange={setPhone} value={phone} />
            <FormInput label='Email' onChange={setEmail} value={email} />
            <h3>Address:</h3>
            <FormInput label='Line 1' onChange={setLine1} value={line1} />
            <FormInput label='Suburb' onChange={setSuburb} value={suburb} />
            <FormInput label='City' onChange={setCity} value={city} />
            <h3>Project Details</h3>
            <FormInput label='Start date' onChange={setStartDate} value={startDate} type='date'/>
            <FormInput label='Sub Contract Fee' onChange={handleSubContractFee} value={subContractFee} type='number' step={.01}/>
            <FormInput label='Description' onChange={setDescription} value={description} />

          <h3>Lists Templates</h3>
          <div className='content-section'>
            <label>
              <span>Main List:</span>
              <div>
                <Select
                  onChange={(option) => setTempMain(option)}
                  options={projectList}
                />
              </div>
            </label>
            
            <label>
              <span>Labour List:</span>
              <Select
                onChange={(option) => setTempLabourList(option)}
                options={projectList}
              />
            </label>
          </div>

          <h3>Assign Staff Members</h3>
            <div className='assigned-staff'>
              <table className='staffTable'>
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>role</th>
                    <th>rate</th>
                    <th>delete</th>
                  </tr>

                  {teamList.map((singleStaff, index) => {
                  const name = singleStaff.name ? singleStaff.name : '-no-name-'
                  const role = singleStaff.role ? singleStaff.role : '-no-roll-'
                  const rate = singleStaff.rate ? singleStaff.rate : '-no-rate-'
                  return (
                      <tr key={index} className='staffMember'>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>{role}</td>
                        <td>{rate}</td>  
                        <td>
                          <button 
                            type="button" 
                            className="btn-red"
                            onClick={() => handleTeamRemove(index)}
                            >
                            x
                          </button>
                        </td>
                      
                      </tr>
                    )
                  })}
                </tbody>
                
              </table>
            
              <div >
                <label>
                  <input 
                    name="name" 
                    type="text" 
                    id="name"
                    placeholder='name'
                    value={memberName}
                    
                    onChange = {(e) => setMemberName(e.target.value)}
                  />
                  <select 
                    name="role" 
                    type="text" 
                    id="role" 
                    placeholder='role'
                    value={memberRole}
                    onChange = {(e) => setMemberRole(e.target.value)}
                  >
                    <option value={'-'}>{'-'}</option>
                    <option value={'Site Manager'}>{'Site Manager'}</option>
                    <option value={'Foreman'}>{'Foreman'}</option>
                    <option value={'Builder 1'}>{'Builder 1'}</option>
                    <option value={'Builder 2'}>{'Builder 2'}</option>
                    <option value={'Apprentice 1'}>{'Apprentice 1'}</option>
                    <option value={'Apprentice 2'}>{'Apprentice 2'}</option>
                  </select>
                  <input 
                    name="rate" 
                    type="text" 
                    id="rate"
                    placeholder='rate'
                    value={memberRate}
                    onChange = {(e) => setMemberRate(e.target.value)}
                  />
                  <button className="btn" onClick={handleTeamAdd}>+</button>                     
              </label>
            </div>
          
            </div>
          
        <div className='align-btn'>
          <button className="btn add-btn">Add Project</button>
        </div>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
    </div>
    </div>
  )
}

function FormInput({label, onChange, value, type, options, step}) {
  const handleInput = (value) => {
    onChange(value)
  }

  if(!options){
    return (
      <label>
        <span>{label}</span>
        <input 
          required
          type={type ? type : 'text'}
          step={step ? step : 1 }
          onChange={(e) => handleInput(e.target.value)}
          value={value} 
        ></input>
      </label>
    )
  }
  else{
    return (
      <label>
        <span>{label}</span>
          <select 
            required
            type={type ? type : 'text'}
            onChange={(e) => { handleInput(e.target.value); console.log('target.value: ', e.target.value) }}
            value={value}
          >
            { Object.entries(options).map( ([key, option]) => <option key={key} value={option}>{option}</option>) }
          </select>
      </label>
    )
  }
  
}

function resetProject(project) {
  //reset claims to null throughout project
  project.mainList.forEach(stage => {
    stage.tasks.forEach(task => {
        task.nextClaim = null
        task.claims = {}
    })
  })

  return project
}

export{ FormInput }

