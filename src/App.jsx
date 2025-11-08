import React, {useState, useEffect } from 'react'
import './App.css';
import '98.css'

function App() {
  const BASE_URL = "https://nano-gpt.com/api/v1";
  const API_KEY = process.env.REACT_APP_NANOGPT_API_KEY;
  const maxTasks = 99;
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('taskArray');
    return stored ? JSON.parse(stored) : [];
  });
  const [displayedTasks, setDisplayedTasks] = useState(tasks)
  const [searchText, setSearchText] = useState("")
  const [newTask, setNewTask] = useState("")
  const handleInputChange = (e) => {setNewTask(e.target.value);}
  const handleSearch = (e) => {setSearchText(e.target.value)}
  const handleSearchFilter = () => {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    setDisplayedTasks(tasks.filter(item => pattern.test(item.name)));
  }
  const updateTasks = (addedTask) => {
    setTasks([...tasks, addedTask]);
    console.log(JSON.stringify([...tasks, addedTask]))
  }
  const handleSortTasks = (sortMode) => {
    console.log(sortMode);
    let sortedTasks = [];
    switch (sortMode) {
    case "date":
      sortedTasks = [...tasks].sort((a, b) => new Date(a.machineDate) - new Date(b.machineDate));
      break;
    case "importance":
      sortedTasks = [...tasks].sort((a, b) => b.important - a.important);
      break;
    default:
      sortedTasks = [...tasks];
      break;
  }
  setDisplayedTasks(sortedTasks);
  console.log("sorted:", sortedTasks);
};

  useEffect(() => {
    setDisplayedTasks(tasks)
    localStorage.setItem('taskArray', JSON.stringify(tasks));
  }, [tasks])

  function handleToggle(index){
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, status: !task.status, important: task.important ? false : task.important, } : task );
    setTasks(updatedTasks);
    setDisplayedTasks(updatedTasks);
  }

  function killTask(index) {
    let killedTask = document.getElementById(`task${index}`);
    if (killedTask) {
      killedTask.style.translate = "-25px";
      killedTask.style.opacity = 0;
      setTimeout(() => {
        setTasks(prevTasks => {
          const newTasks = prevTasks.filter((_, i) => i !== index);
          console.log("Updated tasks:", newTasks);
          return newTasks;
        });
        killedTask.style.translate = "0px";
        killedTask.style.opacity = 1;
      }, 200);
    }
  } 

  async function callAI(task) {
    const now = new Date();
    const nowDate = now.toLocaleDateString()
    const nowTime = now.toLocaleTimeString()
    let day = weekday[now.getDay()];
    console.log(nowDate, nowTime)
    const content = 
      `
      You are a planner, you are input a prompt, and you output a task.
      Write back a json formatted for an API, the format should be like 
      {
        "name":"[Generate a name here! Keep it short, 4-5 words maximum.]",
        "desc":"[Generate a description here! Use correct grammar in the language of the user prompt. Make it concise, target 1 sentence.]",
        "date":"[Generate a date in 'Day, Month Date, Year' (i.e. Friday, November 14th, 2025) format.]",
        "time":"[Generate a time in HH:mm AM/PM format [01:30 PM, 05:55 AM, 07:40 PM], NO SECONDS.]",
        "status":[Boolean, always true, unless stated otherwise.],
        "important":[Boolean, determine from the text if this is urgent or not. Regular classes are NOT important, deadlines and tests ARE.]
      }
      ONLY OUTPUT A JSON. IT WILL BREAK IF YOU DON'T OUTPUT PURE JSON.
      If the type of event is not mentioned, always assume it's a class.
      ALWAYS ASSUME THE EVENT IS NON-RECURRING. If it is recurring, the user will tell you.
      The current date and time is: ${nowDate}, ${nowTime}. The current day is a ${day}.
      Use the date and time as context to the event, do NOT use it directly.
      `
      console.log(content)
    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'Mistral-Nemo-12B-Instruct-2407',
            messages: [
                { role: 'system', content: content },
                { role: 'user', content: task }
            ]
        })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error from API:', data);
    }
    console.log(data)
    console.log(data.choices[0].message.content)
    return(data.choices[0].message.content)
  }

  async function handleAddTask() {
    let textBox = document.getElementById("text20");
    let searchBox = document.getElementById("text17");
    const now = new Date();
    if ((tasks.length < maxTasks) && textBox.value) {
      const placeholderTask = {
        name : "Generating...",
        desc : "Generating...",
        date : "Generating...",
        time : "Generating...",
        status : false,
        important : false,
      };
      updateTasks(placeholderTask);
      let taskAI = await callAI(newTask)
      let taskStuff = await JSON.parse(taskAI)
      const addedTask = {
        name : taskStuff.name,
        desc : taskStuff.desc,
        date : taskStuff.date,
        time : taskStuff.time,
        status : taskStuff.status,
        important : taskStuff.important,
        machineTime : now,
      };
      updateTasks(addedTask);
    }
    textBox.value || alert("nah bruh");
    (textBox.value && ((tasks.length < maxTasks) || (alert(`max is ${maxTasks}`))));
    setNewTask("");
    textBox.value = "";
    searchBox.value = "";
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
      <main className='pl-2 pt-14 w-11/12'>
        <div className='flex flex-col'>
            {/* User Prompt */}
          <label htmlFor="text17">Search:</label>
          <input id="text17" type="text" onChange={handleSearch}></input>
          <button id="submit" className='w-[10%] mt-5 mb-10' onClick={() => handleSearchFilter()}>Search</button>
          <label htmlFor="text20">Enter your prompt:</label>
          <textarea id="text20" rows="4" className='w-[100%]' onChange={handleInputChange}/>
          <button id='submit' className='w-[10%] mt-5' onClick={() => handleAddTask()}>Submit</button><br/>
          <div id='sort' className="flex flex-row gap-6">
            <button id='submit' className='w-[10%] mt-5' onClick={() => handleSortTasks("importance")}>Sort by Importance</button>
            <button id='submit' className='w-[10%] mt-5' onClick={() => handleSortTasks("date")}>Sort by Date</button>
          </div>
        </div>
        {/* Spacing */}
        <div className='p-6'/>
        {/* To-Do List */}
        <div className='flex flex-col w-[100%] min-[1350px]:w-[1100px] min-[1650px]:w-[1450px] h-fit'>
          <div className='flex flex-col gap-y-2'>
            <strong className='mb-[-5px]'>Your To-Do List</strong>
            <hr/>
            <div id="taskList" className={`flex flex-col-reverse w-[100%] h-full flex-wrap lg:flex-row ${displayedTasks.length === 0 && "items-center content-center"}`}>
              {displayedTasks.map((currentTask, index) =>
              <div id={`task${index}`} className="window w-full lg:w-[350px] min-h-fit hover:-translate-y-2 transition-[opacity,translate,transform]" key={index}>
                <div className={`title-bar text-white grid grid-flow-col grid-rows-1 ${!currentTask.status && "inactive"}`}>
                  <div className="title-bar-text w-[80%]"><p className={`break-words break-all ${!currentTask.status && "line-through"}`}>{index+1}.&nbsp;{currentTask.name}</p></div>
                  <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Restore"></button>
                    <button onClick={() => killTask(index)} aria-label="Close"></button>
                  </div>
                </div>
              <span className="text-black ml-2 mt-2 mb-2 inline-block">
                  <b>{currentTask.desc}</b><br/><br/>
                  Date: {currentTask.date}<br/>
                  Time: {currentTask.time}<br/>
                  Status: {currentTask.status ? "Active" : "Done!"}<br/><br/>
                  <input type="checkbox" id={index} checked={!currentTask.status} onChange={() => handleToggle(index)}/>
                  <label htmlFor={index}>Finished?</label>
                </span>
              </div>
              )}
              {displayedTasks.length === 0 && <div className="pt-1"><strong>No tasks here!</strong></div>}
            </div>
          </div>
        </div>
        <div className="status-field-border w-[90%] mt-[400px]">
          <div className="p-2">
            <p>Made with love by Rafaadzan Danendra, with help from <a href="https://exerciseftui.com/">EXERCISE</a>.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App