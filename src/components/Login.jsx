import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing the password
import '../style/style.css';

function Login() {
    const { login } = useContext(AuthContext);
    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        let response = await fetch(`http://localhost:3001/users?email=${loginValue}`);

        if (response.ok) {
            let data = await response.json();

            if (data.length > 0) {
                const user = data[0];

                const passwordMatches = await bcrypt.compare(password, user.password); // bcrypt.compare checks hashed passwords

                if (passwordMatches) {
                    login(user);
                    navigate("/");
                } else {
                    alert("You've entered an invalid email or password. Please try again.");
                    setPassword("");
                }
            }
        }

        // If no user was found by email, try searching by username
        response = await fetch(`http://localhost:3001/users?username=${loginValue}`);

        if (response.ok) {
            const data = await response.json();

            if (data.length > 0) {
                const user = data[0];

                const passwordMatches = await bcrypt.compare(password, user.password);

                if (passwordMatches) {
                    login(user);
                    navigate("/");
                } else {
                    alert("You've entered an invalid username or password. Please try again.");
                    setPassword("");
                }
            }
        } else {
            alert("You've entered an invalid email or username. Please try again.");
            setPassword("");
        }
    }

    return (
        <div className="form-container">
            <h1>Login</h1>
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