import './ChatWindow.css';
import { MyContext } from './MyContext.jsx';
import { useContext, useEffect, useRef, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';  
import { BeatLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

function ChatWindow() {
    const { messages, loading, threadId } = useContext(MyContext);

    return (
        <div className='chat-window'>
            {/* Navbar */}
             <Navbar />
             {/* Empty state — show when no active thread */}
             {!threadId && messages.length === 0 ? (
                <div className='chat-empty'>
                    <div className='chat-logo-wrap'>
                        <h1 className='chat-logo'>ChatX</h1>
                        <p className='chat-tagline'>Ask anything. Get answers instantly.</p>
                    </div>
                    <div className='chat-suggestions'>
                        <div className='suggestion-card'>💡 Explain quantum computing simply</div>
                        <div className='suggestion-card'>🧠 Help me prepare for a MERN interview</div>
                        <div className='suggestion-card'>✍️ Write a cold email to a recruiter</div>
                    </div>
                </div>
            ) : (
                // Messages feed
                <div className='chat-messages'>
                    {messages.map((msg, index) => (
                    <MessageBubble
                        key={index}
                        role={msg.role}
                        content={msg.content}
                    />
                    ))}
                    {loading && (
                    <div className='message assistant'>
                        <div className='spinner-wrap'>
                            <BeatLoader
                                color="#7c3aed"
                                size={24}
                            />
                        </div>
                    </div>  
                    )}
                </div>
            )}
            <ChatInput/>
        </div>
    );
}

function MessageBubble({ role, content }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }, [content]);

    // parse content — split by code blocks
    const renderContent = (text) => {
        const parts = text.split(/(```[\s\S]*?```)/g);
        return parts.map((part, i) => {
            if (part.startsWith('```')) {
                // extract language and code
                const lines = part.slice(3, -3).split('\n');
                const lang = lines[0].trim();
                const code = lines.slice(1).join('\n');
                return (
                    <pre key={i} className='code-block'>
                        {lang && <span className='code-lang'>{lang}</span>}
                        <code className={lang ? `language-${lang}` : ''}>
                            {code}
                        </code>
                    </pre>
                );
            }
            return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
        });
    };

    return (
        <div className={`message ${role}`}>
            <div className='message-bubble' ref={ref}>
                {renderContent(content)}
            </div>
        </div>
    );
}

function Navbar() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className='navbar'>
            {/* Logo */}
            <h2 className='navbar-logo'>ChatX</h2>

            {/* Right side */}
            <div className='navbar-right'>
                {!isLoggedIn ? (
                    // show login/register if not logged in
                    <div className='navbar-auth'>
                        <button className='navbar-btn outline' onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className='navbar-btn filled' onClick={() => navigate('/register')}>
                            Register
                        </button>
                    </div>
                ) : (
                    // show user avatar + dropdown if logged in
                    <div className='navbar-user' onClick={() => setDropdownOpen(prev => !prev)}>
                        <div className='navbar-avatar'>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className='navbar-username'>{user?.username}</span>
                        <span className='navbar-chevron'>{dropdownOpen ? '▲' : '▼'}</span>

                        {dropdownOpen && (
                            <div className='navbar-dropdown'>
                                <div className='dropdown-info'>
                                    <p className='dropdown-name'>{user?.username}</p>
                                    <p className='dropdown-email'>{user?.email}</p>
                                </div>
                                <hr className='dropdown-divider' />
                                <button className='dropdown-logout' onClick={handleLogout}>
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ChatInput() {
    const { prompt, setPrompt, setReply, threadId, setThreadId, setMessages, setLoading } = useContext(MyContext);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        // generate threadId if new chat
        const currentThreadId = threadId || uuidv4();

        // optimistically add user message to UI
        const userMessage = { role: "user", content: prompt };
        setMessages(prev => [...prev, userMessage]);
        setPrompt("");
        setLoading(true);
         if (!threadId) setThreadId(currentThreadId);

        try {
            const res = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    threadId: currentThreadId,
                    message: prompt
                })
            });

            const data = await res.json();

            if (!res.ok || !data.reply) { 
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "Something went wrong. Please try again."
                }]);
                return;
            }

            const assistantMessage = { role: "assistant", content: data.reply };
            setMessages(prev => [...prev, assistantMessage]);
            setReply(data.reply);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Something went wrong. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='chat-input-wrap'>
            <div className='chat-input-box'>
                <textarea
                    className='chat-textarea'
                    placeholder='Message ChatX...'
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                <button
                    className={`send-btn ${prompt.trim() ? 'active' : ''}`}
                    onClick={handleSend}
                    disabled={!prompt.trim()}
                >
                    ↑
                </button>
            </div>
            <p className='chat-disclaimer'>ChatX can make mistakes. Verify important info.</p>
        </div>
    );
}

export default ChatWindow;
