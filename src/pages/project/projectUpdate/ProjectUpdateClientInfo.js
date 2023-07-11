import { useParams, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useFirestore } from '../../../hooks/useFirestore'
import Modal from "react-overlays/Modal"
import { FormInput } from '../../create/Create.js'

// styles
import './ProjectUpdate.css'
import { ConvertLabourList } from '../../create/updateList'

export default function ProjectUpdateClientInfo({ project }) {
  const { updateDocument, response } = useFirestore('projects')
  // const { updateDocument, response } = useFirestore('taskLibrary')
  //const history = useHistory()
  const { id } = useParams()
  const location = useLocation()
  const [formError, setFormError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  console.log(location.pathname)

  // const [ currentProject, setCurrentProject ] = useState('projects')
  const [ clientName, setClientName]  = useState(project.clientName)
  const [ phone, setPhone ] = useState(project.phone)
  const [ email, setEmail ] = useState(project.email)
  const [line1, setLine1] = useState(project.address.line1)
  const [suburb, setSuburb] = useState(project.address.suburb)
  const [city, setCity] = useState(project.address.city)



  const handleClose = () => setShowModal(false)

  const renderBackdrop = (props) => <div className="backdrop" {...props} />

  const handleUpdate = async(e) => {
    e.preventDefault()
    setFormError(null)

    const address = {
        line1,
        suburb,
        city,   
    }

    const updateProject = {
      clientName,
      phone,
      email,
      address,
    }

    await updateDocument(id, updateProject)

    // let labourList = {}

    // let modLabourList = {
    //   stages: ConvertLabourList(labourList)
    // }

    // console.log('UPDATING LABOUR LIST!!: , ', modLabourList)
    // await updateDocument('labourList', modLabourList)

    if (!response.error) {
      handleClose()
      //history.push('/')
    }
  }

  return (
    <div className="project-updateClient-info">
      <div>
        <button type="btn" id="btn_right" onClick={() => setShowModal(true)}>
          + Update Client Details
        </button>
      </div>

      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
        >
          <div>
            <div className="modal-header">
              <div className="modal-title">
                <h3>Update Client Details:</h3></div>
              <div>
                <span className="close-button" onClick={handleClose}>
                  x
                </span>
              </div>
            </div>
            <div className="modal-desc">

              <form onSubmit={handleUpdate}>
                <h3>Client:</h3>
                <FormInput label='Name' onChange={setClientName} value={clientName}/>
                <FormInput label='Phone' onChange={setPhone} value={phone}/>
                <FormInput label='Email' onChange={setEmail} value={email}/>
                
                <h3>Address:</h3>
                <FormInput label='Line 1' onChange={setLine1} value={line1}/>
                <FormInput label='Suburb' onChange={setSuburb} value={suburb}/>
                <FormInput label='City' onChange={setCity} value={city}/>
                <div className="modal-footer">
                  <div>
                    <button className="btn-cancel" onClick={handleClose}>
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button className="btn">
                      Update Client
                    </button>
                  </div>
                </div>
              {formError && <p className="error">{formError}</p>}
            </form>


            </div>
          </div>
      </Modal>

    </div>    
  )
}