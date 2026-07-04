import './App.css';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]); // All prev chats
  const [loading, setLoading] = useState(false);
  const [allThreads, setAllThreads] = useState([]);
  const [newChat, setNewChat] = useState(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    threadId, setThreadId,
    messages, setMessages,
    loading, setLoading,
    allThreads, setAllThreads,
    newChat, setNewChat,
  };

  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={
        <ProtectedRoute>
          <MyContext.Provider value={providerValues}>
            <div className='main'>
              <Sidebar/>
              <ChatWindow/>
            </div>
          </MyContext.Provider>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
