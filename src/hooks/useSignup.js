import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const history = useHistory()

  const signup = async (email, password, displayName, thumbnail, userRole ) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const img = await projectStorage.ref(uploadPath).put(thumbnail)
      const imgUrl = await img.ref.getDownloadURL()

      // add display AND PHOTO_URL name to user
      await res.user.updateProfile({ displayName, photoURL: imgUrl, userRole  })

      // create a user document
      await projectFirestore.collection('users').doc(res.user.uid).set({
        displayName,
        photoURL: imgUrl,
        userRole,     
      })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
        history.push('/')
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    } 
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}