import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const AdminLogin = ({ setIsAdminAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    
        try {
            const response = await axios.post("http://localhost:5000/api/admin/login", {
                email,
                password,
            });
    
            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                localStorage.setItem("adminEmail", email);  // Add this line
                localStorage.setItem("isAdminLoggedIn", "true");  // Add this line
                setIsAdminAuthenticated(true);
                navigate("/admin/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-portal-container">
            <div className="admin-header">
                <h1>Admin Portal</h1>
                <div className="secure-login-badge">
                    <span className="lock-icon">🔒</span> Secure Login
                </div>
            </div>

            <form onSubmit={handleLogin} className="login-form">
                <div className="input-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input email-input"
                    />
                </div>

                <div className="input-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input password-input"
                        placeholder="••••••••"
                    />
                </div>

                <div className="divider"></div>

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "Access Dashboard"}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-footer">
                <a href="/admin/reset" className="forgot-password">
                    Forgot password? Reset here
                </a>
                <p className="security-note">
                    Ensure you're on a secure network before logging in
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;