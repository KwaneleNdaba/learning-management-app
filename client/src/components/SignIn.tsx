"use client"
import { SignIn, useUser } from '@clerk/nextjs'
import React from 'react'
import {dark} from "@clerk/themes"
import { useSearchParams } from 'next/navigation'

function SignInComponent() {

  const searchParams = useSearchParams();
  const {user}= useUser();
  const isCheckOutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signUpUrl = isCheckOutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : "/signup";

  const getRedirectUrl = () => {
    if(isCheckOutPage){
      return `/checkout?step=2&id=${courseId}&showSignUp=true`
    }
    const userType = user?.publicMetadata?.userType as string;
    if(userType === "teacher"){
      return "/teacher/courses"
    }else{
      return "/user/courses"
    }
  }

  return (
    <SignIn
    appearance={{
      baseTheme:dark,
      elements:{
        rootBox: "flex justify-content items-center",
        cardBox: "shadow-none",
        card: "bg-customgreys-secondarybg w-full !shadow-none",
        footer : {
          background:"#25262F",
          padding: "0rem 2.5rem",
          "& > div > div:nth-child(1)" : {
            background : "#25262F"
          }
        },
        formFieldLabel : "text-white-50 font-normal",
        formButtonPrimary: "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
        formFieldInput : "bg-customgreys-primarybg text-white-50 !shadow-none",
        footerActionLink: "text-primary-750 hover:text-primary-600"
      }
    }}
    signUpUrl={signUpUrl}
    forceRedirectUrl={getRedirectUrl()}
    routing='hash'
    afterSignOutUrl="/"
    />
  )
}

export default SignInComponent