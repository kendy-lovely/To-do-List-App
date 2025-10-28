import React, { useState } from 'react'
import './App.css';
import '98.css'

function App() {
  const maxTasks = 15;
  const [tasks, setTasks] = useState([
    {
      name : "Calculus Class",
      desc : "Attending the Calculus Class at K.207",
      date : "20 Oktober 2025",
      time : "8:00 AM",
      status : true,
    },
    {
      name : "Physics Class",
      desc : "Attending the Physics Class at K.102",
      date : "20 Oktober 2025",
      time : "1:00 PM",
      status : true,
    },
    {
      name : "Computational Thinking Class",
      desc : "Attending the Computational Thinking Class at GK.208",
      date : "21 Oktober 2025",
      time : "10:00 AM",
      status : true,
    },
    {
      name : "PDT Class",
      desc : "Attending the PDT Class at K.204",
      date : "23 Oktober 2025",
      time : "8:00 AM",
      status : true,
    },
  ])

  const [newTask, setNewTask] = useState("")

  const handleInputChange = (e) => {setNewTask(e.target.value);}

  const handleAddTask = () => {
    let textBox = document.getElementById("text20");
    const now = new Date();
    const addedTask = {
      name : newTask,
      desc : newTask,
      date : now.toLocaleDateString(),
      time : now.toLocaleTimeString(),
      status : true,
    };
    ((tasks.length < maxTasks) && textBox.value) && setTasks([...tasks, addedTask]);
    (textBox.value || alert("nah bruh"));
    (textBox.value && ((tasks.length < maxTasks) || (alert("max is 15"))));
    setNewTask("");
    textBox.value = "";
  }

  function handleToggle(index){
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, status: !task.status } : task );
    setTasks(updatedTasks);
  }

  function killTask(index) {
    let killedTask = document.getElementById(`task${index}`);
    if (killedTask) {
      killedTask.style.translate = "-25px";
      killedTask.style.opacity = 0;
      setTimeout(() => {
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
        killedTask.style.translate = "0px";
        killedTask.style.opacity = 1;
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
    <div className='window flex w-full min-h-screen'>
      <div className='title-bar absolute top-0 text-xl w-full'>
        <div className="title-bar-text text-sm">To-Do List App</div>
        <div className="title-bar-controls scale-125 -translate-x-3">
          <button aria-label="Minimize"></button>
          <button aria-label="Restore"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <main className='pl-2 pt-14 w-11/12 xs:w-[61vw]'>
        <div className='flex flex-col'>
            {/* User Prompt */}
          <label for="text20">Enter your prompt:</label>
          <textarea id="text20" rows="4" className='w-[100%]' onChange={handleInputChange}/>
          <button id='submit' className='w-[10%] mt-5' onClick={() => handleAddTask()}>Submit</button>
        </div>
        {/* Spacing */}
        <div className='p-6'/>
        {/* To-Do List */}
        <div className='flex flex-col'>
          <div className='w-[100%] flex flex-col gap-y-2'>
            <p className='mb-[-5px]'>Your To-Do List</p>
            <hr/>
            <div id="taskList" className={`flex flex-col h-fit ${tasks.length <= 12 ? "w-fit" : "w-fit min-[750px]:h-[1000px] min-[1100px]:h-[625px] min-[1450px]:h-[575px] min-[1800px]:h-[375px]" } gap-0 min-[750px]:flex-wrap min-[750px]:h-[400px]`}>
              {tasks.map((currentTask, index) =>
              <div id={`task${index}`} className="window min-w-fit min-h-fit w-[90vw] min-[750px]:w-[350px] min-[750px]:h-[125px] hover:-translate-y-2 transition-[opacity,translate,transform]" key={index}>
                <div className={`title-bar text-white grid grid-flow-col grid-rows-1 ${!currentTask.status && "inactive"}`}>
                  <div className="title-bar-text w-[80%]"><p className={`break-words break-all ${!currentTask.status && "line-through"}`}>{index+1}.&nbsp;{currentTask.name}</p></div>
                  <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Restore"></button>
                    <button onClick={() => killTask(index)} aria-label="Close"></button>
                  </div>
                </div>
              <span className="text-black ml-2 mt-2 mb-2 inline-block">
                  Description: {currentTask.desc}<br/>
                  Date: {currentTask.date}<br/>
                  Time: {currentTask.time}<br/>
                  Status: {currentTask.status ? "Active" : "Done!"}<br/>
                  <input type="checkbox" id={index} checked={!currentTask.status} onChange={() => handleToggle(index)}/>
                  <label for={index}>Finished?</label>
                </span>
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="status-field-border mb-4 mt-64 w-full">
          <div className="p-2">
            <p>Made with love by kendy.online, with help from <a href="https://exerciseftui.com/">EXERCISE</a>.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App