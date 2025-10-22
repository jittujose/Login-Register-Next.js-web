"use client";

import Link from "next/link";
import { validateField } from "../utilities/validators";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function Login() {

    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        });
        setError({
            ...error,
            [name]: validateField(name, value)
        });
        if (successMessage) setSuccessMessage('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        Object.entries(formData).forEach(([name, value]) => {
            const errorMessage = validateField(name, value);
            if (errorMessage) {
                validationErrors[name] = errorMessage;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            setSuccessMessage('');
        }
        
        else{
            try{
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            setError({});
            setGeneralError('');
            setSuccessMessage("Login successful!");
            router.push('/dashboard');
        }catch(error){
            console.error("Login error:", error.code);
            if (error.code === 'auth/user-not-found') setGeneralError("User not found");
            else if (error.code === 'auth/invalid-credential') setGeneralError("Incorrect email or password");
            else setGeneralError("An error occurred during login. Please try again.");
            setSuccessMessage('');
        }
    }
        
    };
    return (
        <div className="container">
            {generalError && <p className="error-message">{generalError}</p>}

            <h1 style={{ marginBottom: "1.5rem", color: "#111" }}>Login to your account</h1>

            <form method="post" onSubmit={handleSubmit} noValidate>

                <label htmlFor="email">Email Address</label>
                <input type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={error.email ? "error-input" : ""}
                    required />
                {error.email && <span className="error">{error.email}</span>}

                <label htmlFor="password">Password</label>
                <input type="password"
                    id="password"
                    name="password"
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={error.password ? "error-input" : ""}
                    required />
                {error.password && <span className="error">{error.password}</span>}

                <button type="submit">Login</button>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>

            <p style={{ marginTop: "1.5rem" }}>
                Not registerd yet?{" "}
                <Link href="/register" style={{ color: "#0070f3", fontWeight: "500" }}>
                    Register here
                </Link>
            </p>
        </div>
    );
}
