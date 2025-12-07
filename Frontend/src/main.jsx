import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createContext } from 'react'
import './index.css'
import App from './App.jsx'
import ClickSpark from '../reactBitsComponents/ClickSpark/ClickSpark.jsx'
import axios from 'axios'


export const Context = createContext();

const AppWrapper = () => {

  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null);



  const getBoards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://assignment-1-sup2.onrender.com/boards");
      const boardList = res.data.data;

      
      const boardsWithTasks = await Promise.all(
        boardList.map(async (board) => {
          const tasksRes = await axios.get(`https://assignment-1-sup2.onrender.com/boards/${board._id}/tasks`);
          return {
            ...board,
            tasks: tasksRes.data.data, 
          };
        })
      );

      // console.log("Boards with tasks:", boardsWithTasks);
      setBoards(boardsWithTasks); 

    } catch (err) {
      console.log("Error fetching boards:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBoards();
  }, []);



  return (
    <Context.Provider value={{
      boards, setBoards, loading, setLoading, getBoards
    }}>
      <ClickSpark sparkColor='#565656ff'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}>
        <App />
      </ClickSpark>
    </Context.Provider>
  )
}






createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </StrictMode>,
)
