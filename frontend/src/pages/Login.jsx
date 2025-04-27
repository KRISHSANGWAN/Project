import React, { use, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {backendurl, token, setToken} = useContext(AppContext);
  const navigate = useNavigate();

  const[state,setState] = useState('Sign up');
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[name,setName] = useState('');

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
    try {
      if(state === 'Sign up'){
        const {data} = await axios.post(backendurl+"/api/user/register",{name,password,email});
        if(data.success){
          localStorage.setItem('token',data.token);
          setToken(data.token);
        }
        else{
          toast.error(data.message);
        }
      }
      else{
        const {data} = await axios.post(backendurl+"/api/user/login",{password,email});
        if(data.success){
          localStorage.setItem('token',data.token);
          setToken(data.token);
        }
        else{
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/ ')
    }
  },[token])


  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl text-semibold'>{state === 'Sign up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign up' ? "Sign up" : "Login"} to book appointment</p>
        {
          state === 'Sign up' && <div className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" value={name} onChange={(e)=> setName(e.target.value)} required/>
        </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>
        </div>
        <button className=' bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === 'Sign up' ? "Create Account" : "Login"}</button>
        {
          (state === 'Sign up' ? <p>Already have an account? <span onClick={()=>setState('Login')} className='text-[#5f6FFF] underline cursor-pointer'>Login Here</span></p>
          : <p>Create a new account? <span onClick={()=>setState('Sign up')} className='text-[#5f6FFF] underline cursor-pointer'>click here</span></p>
          )
        }
        {console.log(state)}
      </div>
    </form>
  )
}

export default Login