import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const {docId} = useParams();
  const {doctors,backendurl, token, getDoctorsData  } = useContext(AppContext);
  const daysOfWeek = ['SUN','MON','TUE','WED','THR','FRI','SAT'];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots,setDocSlots] = useState([]);
  const [slotIndex,setSlotIndex] = useState(0);
  const [slotTime,setSlotTime] = useState("");

  const fetchDocInfo = async ()=>{
    const docInfo = doctors.find(doc => doc._id == docId);
    setDocInfo(docInfo)
  }

  const getAvailableSlot = async () =>{
    setDocSlots([])
    // getting curr date

    let today = new Date();
    let n = 7;
    for(let i=0;i<n;i++){
      // getting date with index
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate()+i);
      endTime.setHours(21,0,0,0);
      let flag = true;

      // setting hours
      if(today.getDate()===currDate.getDate() && currDate.getHours()>=20 && flag){
        n = 8;
      }
      else if(today.getDate()===currDate.getDate()){
        currDate.setHours(currDate.getHours() >= 10 ? currDate.getHours()+1: 10);
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0);
        flag = false;
      }
      else{
        currDate.setHours(10);
        currDate.setMinutes(0);
      }

      let timeSlot = [];

      while(currDate < endTime){
        let formattedTime = currDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

        let day = currDate.getDate();
        let month = currDate.getMonth()+1;
        let year = currDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slot_books[slotDate] && docInfo.slot_books[slotDate].includes(slotTime) ? false : true;
         
        if(isSlotAvailable){
          // Adding slots to the array
          timeSlot.push({
            dateTime : new Date(currDate),
            time : formattedTime
          })
        }

        // Increment current time by 30 minutes
        currDate.setMinutes(currDate.getMinutes()+30);
      }

      setDocSlots(prev=>([...prev,timeSlot]))
    }
  }

  const bookAppointment = async ()=> {
    if(!token){
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {

      const date = docSlots[slotIndex][0].dateTime;

      let day = date.getDate();
      let month = date.getMonth()+1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const {data} = await axios.post(backendurl+"/api/user/book-appointment",{docId,slotDate,slotTime},{headers:{token}});

      if(data.success){
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments")
      }
      else{
        toast.error(data.message);
      }

      
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchDocInfo();
  },[docId,doctors])

  useEffect(()=>{
    if(docInfo){
      getAvailableSlot();
    }
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots);
  },[docSlots])


  return docInfo &&  (
    <div>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 '>
          {/* Doctor Info */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* Doctor About */}
          <div>
            <p className='flex items-center text-gray-900 gap-1 text-sm font-medium mt-3'>
              About <img src={assets.info_icon } alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              {docInfo.about}
            </p>
          </div> 
          <p className='text-gray-500 font-medium mt-4 '>
             Appointment Fee:<span className='text-gray-600' >${docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items.center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>(setSlotIndex(index))} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#5f6FFF] text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#5f6FFF] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase( )}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors docId = {docId} speciality = {docInfo.speciality}/>

    </div>
  )
}

export default Appointment