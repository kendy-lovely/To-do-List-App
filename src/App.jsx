import React, {useState, useEffect } from 'react'
import './App.css';
import '98.css'

function App() {
  // time arrays
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  // useStates
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('taskArray');
    return stored ? JSON.parse(stored) : [];
  });
  const [sortMode, setSortMode] = useState("importance")
  const maxTasks = 99;
  const [displayedTasks, setDisplayedTasks] = useState(tasks)
  const [taskInput, setTaskInput] = useState("")
  const [searchText, setSearchText] = useState("")

  //input handlers
  const handleInputChange = (e) => {setTaskInput(e.target.value);}
  const handleSearchInput = (e) => {setSearchText(e.target.value)}
  const handleToggle = (index) => {
    if (tasks[index].status) {
      const updatedTasks = tasks.map((task, i) => i === index ? { ...task, status: !task.status, important: task.important ? !task.important : task.important } : task );
      setTasks(updatedTasks);
    }
  }
  const handleImportance = (index) => {
    if (tasks[index].status) {
      const updatedTasks = tasks.map((task, i) => i === index ? { ...task, important: !task.important } : task );
      setTasks(updatedTasks);
    }
  }
  const handleEnter = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (type) {
        case "addTask":
          handleAddTask();
          break;
        case "handleSearch":
          handleSearchFilter();
          break;
        default:
          break;
      }
    }
  }

  //search handler
  const handleSearchFilter = () => {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    setDisplayedTasks(tasks.filter(item => pattern.test(item.name)));
  }

  //sort handler
  const handleSortTasks = () => {
    console.log(sortMode);
    let sortedTasks = [];
    switch (sortMode) {
    case "date":
      sortedTasks = [...tasks].sort((a, b) => new Date(a.machineDate) - new Date(b.machineDate));
      break;
    case "importance":
      sortedTasks = [...tasks].sort((a, b) => {
        if (a.important < b.important) return 1;
        if (a.important > b.important) return -1;
        if (a.status < b.status) return 1;
        if (a.status > b.status) return -1;
        else return 0
      });
      break;
    default:
      sortedTasks = tasks;
      break;
    }
  setDisplayedTasks(sortedTasks);
  console.log("sorted:", sortedTasks);
  };

  //sync displayedTasks to tasks
  useEffect(() => {
    handleSortTasks()
    localStorage.setItem('taskArray', JSON.stringify(tasks));
  }, [tasks, sortMode])

  //logic
  async function callAI(task) {
    const now = new Date();
    const nowDate = now.toLocaleDateString()
    const nowTime = now.toLocaleTimeString()
    let day = weekday[now.getDay()];
    let month = months[now.getMonth()];
    console.log(nowDate, nowTime)
    const msg = 
      `
      You are a planner, you are input a prompt, and you output a task.
      The current date and time is: ${month} ${now.getDate()}th, ${now.getFullYear()} and ${nowTime}. The current day is a ${day}. This is what is referred to as today.
      Use the date and time as context to the event, do NOT use it directly (unless told to).
      Write back a json formatted for an API, the format should be like 
      {
        "name":"[Generate a name here! Keep it short, 4-5 words maximum.]",
        "desc":"[Generate a description here! Use correct grammar in the language of the user prompt. Make it concise, target 1 sentence. Do NOT make ANY assumptions about the contents of the event that you do not know. Keep as general as possible.]",
        "date":"[Generate a date in 'Day, Month Date, Year' (i.e. Friday, November 14th, 2025) format, ensure that the date and the day is CORRECT.]",
        "time":"[Generate a time in HH:mm AM/PM format [01:30 PM, 05:55 AM, 07:40 PM], NO SECONDS.]",
        "status":[Boolean, always true, unless stated otherwise.],
        "important":[Boolean, determine from the name if this is urgent or important or not. Regular classes are NOT important. Deadlines, exams, tests ARE IMPORTANT.]
      }
      ONLY OUTPUT A JSON. IT WILL BREAK IF YOU DON'T OUTPUT PURE JSON. DO NOT USE JSON FORMATTING FOR A CHATBOT.
      If the type of event is not mentioned, always assume it's a class.
      ALWAYS ASSUME THE EVENT IS NON-RECURRING. If it is recurring, the user will tell you.
      `
    console.log(msg)
    const response = await fetch(`https://nano-gpt.com/api/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_NANOGPT_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: 'system', content: msg },
                { role: 'user', content: task }
            ]
        })
    });
    const data = await response.json();
    try {
      var content = data.choices[0].message.content
      if (content.startsWith("```")) {
        content = content.replace(/```json|```/g, "").trim();
      }
    } catch {
      console.error('Error in formatting:', data);
      return 400;
    }
    if (!response.ok) {
      console.error('Error from API:', data);
      return 400;
    }
    console.log('Response from AI:', content)
    return(JSON.parse(content))
  }

  async function handleAddTask() {
    let textBox = document.getElementById("text20");
    let searchBox = document.getElementById("text17");
    textBox.value || alert("nah bruh");
    (textBox.value && ((tasks.length < maxTasks) || (alert(`max is ${maxTasks}`))));
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
      addTask(placeholderTask);
      textBox.value = "";
      searchBox.value = "";
      let taskAI = await callAI(taskInput)
      if (taskAI === 400) {
        setTasks(tasks.pop());
      } else {
        const addedTask = {
          name : taskAI.name,
          desc : taskAI.desc,
          date : taskAI.date,
          time : taskAI.time,
          status : taskAI.status,
          important : taskAI.important,
          machineTime : now,
        };
        addTask(addedTask);
      }
    }
    setTaskInput("");
  }

  function addTask(addedTask) {
    setTasks([...tasks, addedTask]);
    console.log(JSON.stringify([...tasks, addedTask]))
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

  //html
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
          <input id="text17" type="text" onChange={handleSearchInput} onKeyDown={(e) => handleEnter(e, "handleSearch")}></input>
          <button id="submit" className='w-[10%] mt-5 mb-10' onClick={() => handleSearchFilter()}>Search</button>
          <label htmlFor="text20">Enter your prompt:</label>
          <textarea id="text20" rows="4" className='w-[100%]' onChange={handleInputChange} onKeyDown={(e) => handleEnter(e, "addTask")}/>
          <button id='submit' className='w-[10%] mt-5' onClick={() => handleAddTask()}>Submit</button><br/>
          <div id='sort' className="flex flex-row gap-6">
            <button id='submit' className='w-[10%] mt-5' onClick={() => setSortMode("importance") }>Sort by Importance</button>
            <button id='submit' className='w-[10%] mt-5' onClick={() => setSortMode("date") }>Sort by Date</button>
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
              <div id={`task${tasks.findIndex(task => task.name === currentTask.name)}`} className="window w-full lg:w-[350px] h-[180px] hover:-translate-y-2 transition-[opacity,translate,transform]" key={index}>
                <div className={`title-bar text-white grid grid-flow-col grid-rows-1 ${!currentTask.status && "inactive"}`}>
                  <div className="title-bar-text pl-1 w-[80%]"><p className={`break-words break-all ${!currentTask.status && "line-through"}`}>{currentTask.name}</p></div>
                  <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Restore"></button>
                    <button onClick={() => killTask(tasks.findIndex(task => task.name === currentTask.name))} aria-label="Close"></button>
                  </div>
                </div>
                <div className="flex text-black ml-2 mt-2 mb-2 flex-row">
                  <div className="inline-block flex-[5]">
                    <div className="h-[46px]"><b>{currentTask.desc}</b></div>
                    Date: {currentTask.date}<br/>
                    Time: {currentTask.time}<br/>
                    Status: {currentTask.status ? "Active" : "Done!"}<br/><br/>
                    <input type="checkbox" id={index} checked={!currentTask.status} onChange={() => handleToggle(tasks.findIndex(task => task.name === currentTask.name))}/>
                    <label htmlFor={index}>Finished?</label>
                  </div>
                  <div className='flex-[1.3] content-center'>
                    <div className='float-right w-[75%] aspect-square mr-4 cursor-pointer' onClick={() => handleImportance(tasks.findIndex(task => task.name === currentTask.name))}>
                    {currentTask.important ? <img className="w-full h-full object-contain" src="/msg_warning-0.png" alt="important"/> : <img className="w-full h-full object-contain" src="/msg_information-0.png" alt="not as important"/>}
                    </div>
                  </div>
                </div>
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