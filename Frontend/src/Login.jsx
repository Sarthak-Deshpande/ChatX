import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login(){

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
                <p className="auth-subtile">Welcome back</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to='/register'>Register</Link>
                </p>
            </div>

        </div>
    );
}

export default Login;
