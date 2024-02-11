import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'

const OAuth = () => {
  return (
    <Button type='button' gradientDuoTone={'pinkToOrange'} outline>
        <AiFillGoogleCircle className='mr-2'/>
        Continue with Google
    </Button>
  )
}

export default OAuth