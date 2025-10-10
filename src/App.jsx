import React from 'react'
import './App.css';

function App() {
  return (
    <div className='flex justify-center w-full min-h-screen bg-gray-800 text-white'>
      <header className='absolute top-0 text-xl p-5 bg-gray-600 w-full text-center rounded-large'>
      <p>To-Do List App</p>
      </header>
      <main className='pt-36 w-3/4'>
        <div className='flex justify-center'>
            {/* User Prompt */}
          <input className='bg-slate-700 p-4 rounded-2xl w-3/4 shadow-md' placeholder='Type your prompts...'>
          </input>
          <button className='pl-2 h-12 pt-2'>
            <img src='logo192.png' alt="enter" className='w-full h-full'/>
          </button>
        </div>
        {/* Spacing */}
        <div className='p-6'/>
        {/* To-Do List */}
        <div className='flex justify-center'>
          <div className='w-[85%] flex flex-col gap-y-4'>
            <p className='font-semibold text-xl'>Your To-Do List</p>
            <hr/>
            <div className='bg-slate-700 p-4 rounded-2xl shadow-lg'>
            <span classNmae='font-semibold text-2xl'>
              Judul
            </span>
            <br/>
            <br/>
            <span className='text-base'>
              Why did the chicken cross the road?<br/>
              Date: <br/>
              Time: <br/>
              Status: To get to the other side! <br/>
            </span>
            <input type='checkbox'/>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App