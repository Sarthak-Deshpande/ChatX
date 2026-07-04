import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Auth.css';

function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.error);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch(err){
            setError('Something went wrong. Please try again.');
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-logo">ChatX</h1>
                <p className="auth-subtitle">Create your account</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label>Username</label>
                        <input 
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Email</label>
                        <input 
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>

                    <p className="auth-switch">
                        Already have an account? <Link to='/login'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;