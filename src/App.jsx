import React, { useState } from 'react'
import './App.css';

function App() {
  const task = [
    {
      name : "Calculus Class",
      desc : "Attending the Calculus Class at K.207",
      date : "20 Oktober 2025",
      time : "8:00 AM",
      status : "Active",
    },
    {
      name : "Physics Class",
      desc : "Attending the Physics Class at K.102",
      date : "20 Oktober 2025",
      time : "1:00 PM",
      status : "Active",
    },
    {
      name : "Computational Thinking Class",
      desc : "Attending the Computational Thinking Class at GK.208",
      date : "21 Oktober 2025",
      time : "10:00 AM",
      status : "Active",
    }
  ];
  
  const divArray = []
  
  for (let i = 0; i < task.length; i++) {
    let currentTask = task[i]
    divArray.push(
      <div className='bg-slate-700 p-4 rounded-2xl shadow-lg'>
        <span className='font-semibold text-2xl'>
          {currentTask.name}
        </span>
        <hr/><br/>
        <span className='text-base text-gray-200'>
          Description: {currentTask.desc}<br/>
          Date: {currentTask.date}<br/>
          Time: {currentTask.time}<br/>
          Status: {currentTask.status}<br/>
        </span>
        <input type='checkbox'/>
      </div>
    )
  }

  return (
    <div className='flex justify-center w-full min-h-screen bg-gray-800 text-white pb-[50vh]'>
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

            {task.map((currentTask, index) =>
            <div className='bg-slate-700 p-4 rounded-2xl shadow-lg' key={index}>
              <span className='font-semibold text-2xl mb-2 inline-block'>
                {currentTask.name}
              </span>
              <hr/>
              <span className='text-base text-gray-200 mt-4 inline-block'>
                Description: {currentTask.desc}<br/>
                Date: {currentTask.date}<br/>
                Time: {currentTask.time}<br/>
                Status: {currentTask.status}<br/>
                <input type='checkbox'/><br/>
              </span>
            </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

export default App