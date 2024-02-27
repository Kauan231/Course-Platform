
import { object, string } from 'yup';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Header from '../components/Header'

function Card ({Course}) {
    return (
        <>
        <a href={`/courses/${Course.id}/lessons`}>
            <div className='bg-slate-600 w-full mt-5 p-2 rounded-2xl'>
                <h1 className='text-lg font-medium text-white'>
                    {Course.title}
                </h1>
                <h1 className='text-lg font-light text-white pt-2'>
                    Current Lesson
                </h1>
            </div>
        </a>
        </>
    )
}

function EnrolledCourses ({courses})  {
    const arrayOfCourses = courses.map( (course) => {
        return <Card Course={course} key={course.id} />
    })

    return arrayOfCourses;
}

const Courses = () => {
    const [courses, SetCourses] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3000/courses`).then((res) => {
            let data = Object.values(res.data.data);
            console.log(res.data);
            SetCourses(data);
        }).catch((err) => {
            console.log(err);
        });
    }, [])

   if(courses.length < 1) {
        return (
            <>
            <h1>Loading</h1> 
            </>
        )
   }
   else {
        return (
            <>
                <Header/>
                <div className='h-screen w-auto bg-slate-200'>
                    <div className='w-full grid grid-cols-1 p-20'>
                        <div className="w-full h-auto p-5">
                            <h1 className='text-2xl font-bold text-slate-500'>
                                All Courses
                            </h1>
                            <EnrolledCourses courses={courses} />
                        </div>
                    </div>
                </div>
            </>
        )
   }
    
}

export default Courses;