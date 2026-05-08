import React, { useState } from "react";

interface AuthProps {
    onLogin: (token: string, username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const body = isLogin ? { email, password } : { username, email, password };

        try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Something went wrong");

        if (isLogin) {
            onLogin(data.token, data.username);
        } else {
            setIsLogin(true); //? Switch to login after successful registration
            alert("Registered! Now sizzle in. 🔥");
        }
        } catch (err: any) {
        setError(err.message);
        }
    };

    return (
        <div
        className="auth-container"
        style={{ maxWidth: "400px", margin: "100px auto", color: "white" }}
        >
        <h2 style={{ color: "#ff4b2b" }}>
            {isLogin ? "Sizzle In" : "Join the Kitchen"}
        </h2>
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
            {!isLogin && (
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            )}
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button
            type="submit"
            style={{
                backgroundColor: "#ff4b2b",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
            }}
            >
            {isLogin ? "Login" : "Sign Up"}
            </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: "pointer", marginTop: "10px", fontSize: "0.9rem" }}
        >
            {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </p>
        </div>
    );
};

export default Auth;
