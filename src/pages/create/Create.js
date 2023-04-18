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
  const [line2, setLine2] = useState('')
  const [suburb, setSuburb] = useState('')
  const [city, setCity] = useState('')
  
  // const [financialSummary, setfinancialSummary] = useState([])
  const [projectList, setProjectList] = useState([])
  const [tempMain, setTempMain] = useState([])
  const [tempLabourList, setTempLabourList] = useState([])

  const [startDate, setStartDate] = useState('')
  const [GSTno, setGSTno] = useState('')
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

  const handleTeamAdd = () => {
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
        line2,
        suburb,
        city,   
    }

    let project = {
      name,
      clientName,
      phone,
      email,
      address, 
      mainList: tempMain.value.mainList,
      labourList: tempLabourList.value.labourList,
      startDate: timestamp.fromDate(new Date(startDate)),
      GSTno,
      subContractFee,
      description,
      team: teamList,
      status: "upcoming"
    }

    await addDocument(project)

    if (!response.error) {
      history.push('/')
    }
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
            <FormInput label='Line 2' onChange={setLine2} value={line2} />
            <FormInput label='Suburb' onChange={setSuburb} value={suburb} />
            <FormInput label='City' onChange={setCity} value={city} />
            <h3>Project Details</h3>
            <FormInput label='Start date' onChange={setStartDate} value={startDate} type='date'/>
            <FormInput label='GST No' onChange={setGSTno} value={GSTno} />
            <FormInput label='Sub Contract Fee' onChange={setSubContractFee} value={subContractFee} type='number'/>
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
                )})}
                
              </table>
            
              <form >
                <label>
                  <input 
                    name="name" 
                    type="text" 
                    id="name"
                    placeholder='name'
                    required
                    value={memberName}
                    
                    onChange = {(e) => setMemberName(e.target.value)}
                  />
                  <input 
                    name="role" 
                    type="text" 
                    id="role" 
                    placeholder='role'
                    required
                    value={memberRole}
                    onChange = {(e) => setMemberRole(e.target.value)}
                  />
                  <input 
                    name="rate" 
                    type="text" 
                    id="rate"
                    placeholder='rate'
                    required
                    value={memberRate}
                    onChange = {(e) => setMemberRate(e.target.value)}
                  />
                  <button className="btn" onClick={handleTeamAdd}>+</button>                     
              </label>
            </form>
          
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

function FormInput({label, onChange, value, type}) {
  const handleInput = (value) => {
    onChange(value)
  }
  return (
    <label>
      <span>{label}</span>
      <input 
        required
        type={type ? type : 'text'}
        onChange={(e) => handleInput(e.target.value)}
        value={value} 
      ></input>
    </label>
  )
}

export{ FormInput }