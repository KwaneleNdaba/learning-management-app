import { Loader2 } from 'lucide-react'
import React from 'react'
 
function Loading() {
  return (
    <div className = "loading">

        <Loader2 className = "loading-spinner"/>
        <span className='loading_text'>
            Loading
        </span>
    </div>
  )
}
 
export default Loading