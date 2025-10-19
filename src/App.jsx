import React from 'react'
import './App.css';
import '98.css'

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
    },
    {
      name : "PDT Class",
      desc : "Attending the PDT Class at K.204",
      date : "23 Oktober 2025",
      time : "8:00 AM",
      status : "Active",
    },

  ];

  const killTask = (index) => {
    let killedTask = document.getElementById(`task${index}`);
    if (killedTask) {
      killedTask.style.translate = "-25px";
      killedTask.style.opacity = 0;
      setTimeout(() => {
        killedTask.remove();
        task.splice(index);
      }, 200);
    }
  }
  /* const divArray = []
  
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
  } */

  return (
    <div className='window flex w-full min-h-screen 2xl:translate-x-[16.5vw] 2xl:translate-y-[25vh] 2xl:scale-150 2xl:w-[66.5vw]'>
      <div className='title-bar absolute top-0 text-xl w-full'>
        <div className="title-bar-text text-sm">To-Do List App</div>
        <div className="title-bar-controls scale-125 -translate-x-3">
          <button aria-label="Minimize"></button>
          <button aria-label="Restore"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <main className='pl-2 pt-14 w-11/12 lg:w-[61vw] 2xl:w-[41vw]'>
        <div className='flex flex-col'>
            {/* User Prompt */}
          <label for="text20">Enter your prompt:</label>
          <textarea id="text20" rows="4" className='w-[100%]'/>
          <button id='submit' className='w-[10%] mt-5'>Submit</button>
        </div>
        {/* Spacing */}
        <div className='p-6'/>
        {/* To-Do List */}
        <div className='flex flex-col'>
          <div className='w-[100%] flex flex-col gap-y-2'>
            <p className='mb-[-5px]'>Your To-Do List</p>
            <hr/>
            <div className="grid gap-0 auto-cols-fr grid-rows-20 lg:grid-rows-3 grid-flow-row lg:grid-flow-col w-[98vw] lg:w-[60vw] 2xl:w-[40vw]">
              {task.map((currentTask, index) =>
              <div id={`task${index}`} className="window max-w-[90vw] lg:max-w-[30vw] 2xl:max-w-[20vw] hover:-translate-y-2 transition-[opacity,translate,transform]" key={index}>
                <div className='title-bar text-white grid grid-flow-col grid-rows-1'>
                  <div className="title-bar-text w-[80%]"><p className="break-words break-all">{currentTask.name}</p></div>
                  <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Restore"></button>
                    <button onClick={() => killTask(index)} aria-label="Close"></button>
                  </div>
                </div>
                <span className='text-black ml-2 mt-2 mb-2 inline-block'>
                  Description: {currentTask.desc}<br/>
                  Date: {currentTask.date}<br/>
                  Time: {currentTask.time}<br/>
                  Status: {currentTask.status}<br/>
                  <input type="checkbox" id={index}/>
                  <label for={index}>Finished?</label>
                </span>
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="status-field-border mb-4 mt-64">
          <div className="p-2">
            <p>Made with love by kendy.online, with help from <a href="https://exerciseftui.com/">EXERCISE</a>.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App