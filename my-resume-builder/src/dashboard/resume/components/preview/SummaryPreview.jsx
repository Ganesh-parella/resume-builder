import React from 'react'

export default function SummaryPreview({resumeInfo}) {
  return (
    
    <p className='text-xs'>
        {resumeInfo?.summary}
    </p>
  )
}
