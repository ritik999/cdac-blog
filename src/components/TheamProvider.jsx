import React from 'react'
import { useSelector } from 'react-redux'

const TheamProvider = ({children}) => {
    const {theam}=useSelector(state=>state.theam);
  return (
    <div className={theam}>
        <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]'>
            {children}
        </div>
    </div>
  )
}

export default TheamProvider