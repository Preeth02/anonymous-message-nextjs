import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {params}=useParams()
  return (
    <div>
      Welcome ,{params}
    </div>
  )
}

export default page
