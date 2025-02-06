import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

function TeacherProfilePage() {
  return (
    <>
    <Header
    title='Profile'
    subtitle='View your profile'    
    />
    <UserProfile
    path="/teacher/profile"
    routing='path'
    appearance={{
        baseTheme:dark,
        elements:{
            scrollBoxbg:"bg-customgrey-darkGrey",
            navbar: {
                "& > div:nth-child(1)":{
                    background: "none",
                }
            }
        }
    }}
    />
    </>
  )
}

export default TeacherProfilePage