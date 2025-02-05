"use client"
import Loading from '@/components/ui/Loading';
import { useGetCoursesQuery } from '@/state/api';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Search() {
    const seachParams = useSearchParams();
    const id = seachParams.get("id");
    const {data: courses, isLoading, isError} = useGetCoursesQuery({});
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const router = useRouter();


    useEffect(() => {
        if(courses){
            if(id){
                const course = courses.find((c) => c.courseId === id);
                setSelectedCourse(course || courses[0]);
            }else{
                setSelectedCourse(courses[0])
            }
        }
    },[courses,id]);

    if(!isLoading) return <Loading/>

  return (
    <div>Search</div>
  )
}

export default Search