"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft } from "lucide-react";

const SignUpComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");
  const [selectedUserType, setSelectedUserType] = useState(""); 
  const [showIcon, setShowIcon] = useState(false);

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.unsafeMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/courses";
    }
    return "/user/courses";
  };





useEffect(() => {
  setShowIcon(false);
  if(selectedUserType){
    setTimeout(() => {  
      setShowIcon(true);
    },1000)
  }
},[selectedUserType])

  return (
   <>
   {
    selectedUserType ?

    <>
  <div
    onClick={() => setSelectedUserType("")}
    style={{
      position: "relative",
      bottom: "18.5em",
      left: "4em",
      zIndex: "99",
      cursor: "pointer",
      transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
      opacity: showIcon ? 1 : 0, 
      transform: showIcon ? "translateX(0)" : "translateX(-10px)", 
    }}
  >
    <ArrowLeft />
  </div>

      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: "flex justify-center items-center py-5",
            cardBox: "shadow-none",
            card: "bg-customgreys-secondarybg w-full shadow-none",
            footer: {
              background: "#25262F",
              padding: "0rem 2.5rem",
              "& > div > div:nth-child(1)": {
                background: "#25262F",
              },
            },
            formFieldLabel: "text-white-50 font-normal",
            formButtonPrimary:
              "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
            formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
            footerActionLink: "text-primary-750 hover:text-primary-600",
          },
        }}
        signInUrl={signInUrl}
        forceRedirectUrl={getRedirectUrl()} 
        routing="hash"
        afterSignOutUrl="/"
        unsafeMetadata={{ userType: selectedUserType }}
      />
    </>
    
  
    :   <div className="bg-customgreys-secondarybg w-full max-w-md p-8 rounded-lg shadow-lg border border-customgreys-primarybg">
    <h2 className="text-2xl font-bold text-white-50 mb-6 text-center">Sign Up As</h2>
    
    <div className="mb-6">
      <label htmlFor="userType" className="block text-white-50 font-medium mb-2">
        Select User Type
      </label>
      <Select value={selectedUserType} onValueChange={setSelectedUserType}>
        <SelectTrigger className="bg-customgreys-primarybg text-white-50 !shadow-none hover:bg-customgreys-primarybg/80 focus:ring-2 focus:ring-customgreys-secondarybg">
          <SelectValue placeholder="Select user type" />
        </SelectTrigger>
        <SelectContent className="bg-customgreys-primarybg text-white-50 border border-customgreys-primarybg">
          <SelectItem value="student" className="hover:bg-customgreys-secondarybg focus:bg-customgreys-secondarybg">
            Student
          </SelectItem>
          <SelectItem value="teacher" className="hover:bg-customgreys-secondarybg focus:bg-customgreys-secondarybg">
            Teacher
          </SelectItem>
        </SelectContent>
      </Select>
    </div>


   
    </div>
   }
   </>
  );
};

export default SignUpComponent;