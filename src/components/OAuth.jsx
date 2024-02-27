import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase'

const OAuth = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const auth=getAuth(app);
  const handleGoogleClick=async()=>{
    const provider= new GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'});
    try {
      const resultsFromGoogle= await signInWithPopup(auth,provider);
      const res=await fetch('/api/v1/users/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:resultsFromGoogle.user.displayName,
          email:resultsFromGoogle.user.email,
          googlePhotoUrl:resultsFromGoogle.user.photoURL
        })
      })
      const data=await res.json();
      console.log(data);
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button type='button' gradientDuoTone={'pinkToOrange'} outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='mr-2'/>
        Continue with Google
    </Button>
  )
}

export default OAuth