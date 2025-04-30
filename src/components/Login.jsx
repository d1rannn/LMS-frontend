import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authActions";
import "../style/style.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: loginValue, password }),
            });

            if (res.ok) {
                const user = await res.json();
                dispatch(loginSuccess(user));
                console.log("Logging in, navigating to home...");
                navigate("/", { replace: true });
            } else {
                const err = await res.text();
                showToast(err || "Invalid credentials", "error");
                setPassword("");
            }
        } catch (err) {
            console.error("Login error:", err);
            showToast("Unexpected error occurred.", "error");
        }
    };

    return (
        <div className="form-container">
            <h1>Login</h1>

            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;