import './Sidebar.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import { v4 as uuidv4 } from 'uuid';

function Sidebar() {

    const { allThreads, setAllThreads, threadId, setThreadId, loading, setLoading, setPrompt, setReply, setMessages } = useContext(MyContext);

    const getAllThreads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await res.json();
            setAllThreads(data.threads || []);
        } catch (err) {
            console.error("Failed to fetch threads", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllThreads();
    }, [threadId]); // gets threads when new one is added

    const onNewChat = () => {
        setThreadId(null);     // reset to null, not a new uuid
        setPrompt("");
        setReply(null);
        setMessages([]);
    }

    const onThreadSelect = async (newThreadId) => {
        setThreadId(newThreadId);
        setMessages([]);  // clear current messages while loading

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await res.json(); 
            setMessages(data);             // load messages into ChatWindow
        } catch (err) {
            console.error("Failed to load thread", err);
        }
    }

    const handleDelete = async (e, deletedThreadId) => {
        e.stopPropagation(); // prevent thread from being selected on delete click
        try{
            await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${deletedThreadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });

            setAllThreads(prev => prev.filter(t => t.threadId !== deletedThreadId));

            if(threadId === deletedThreadId){
                onNewChat();
            }
        } catch(err){
            console.log("Failed to delete thread", err);
        }
    }

    return ( 
        <div className='sidebar'>
            {/* Header */}
            <div className="sidebar-header">
                <h2 className="sidebar-logo">ChatX</h2>
                <button className="new-chat-btn" onClick={onNewChat}>
                    + New Chat
                </button>
            </div>
            
            <div className="sidebar-threads">
            {allThreads.map(thread => (
                <div className='thread-item' key={thread.threadId}>
                    <span className="thread-title" onClick={() => onThreadSelect(thread.threadId)}>
                        {thread.title}
                    </span>
                    <button
                        className="thread-delete-btn"
                        onClick={(e) => handleDelete(e, thread.threadId)}
                    >
                        🗑️
                    </button>
                </div>
            ))}
            </div>
        </div>
    );
}

export default Sidebar;