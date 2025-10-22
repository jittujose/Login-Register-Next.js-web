"use client";

import { useState} from "react";
import Link from "next/link";
import { validateField } from "../utilities/validators";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const[formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState({});
    const [generalError, setGeneralError] = useState('');
    const[successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError({
            ...error,
            [name]: validateField(name, value)
        });

        if(successMessage) setSuccessMessage('');
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
        }else {
            try{
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                const user = userCredential.user;

                await updateProfile(user, {
                    displayName: formData.fullName
                });
                await setDoc(doc(db, "users", user.uid), {
                    fullName: formData.fullName,
                    email: formData.email,
                    createdAt: new Date()
                });
            
            setError({});
            setSuccessMessage("Registration successful!");
            setFormData({
                fullName: '',
                email: '',
                password: ''
            });
            alert("Registration successful!");
            router.push('/');
        }catch (error) {
        console.error("Error during registration:", error);
        if (error.code === "auth/email-already-in-use") {
            setGeneralError("Email is already in use" );
        } else {
            setGeneralError("An error occurred during registration. Please try again.");
        }
    };
        }
    }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem", color: "#111" }}>Create an Account</h1>
      {generalError && <p className="error-message">{generalError}</p>}

      <form method="post" onSubmit={handleSubmit} noValidate>
        <label htmlFor="fullName">Full Name</label>
        <input type="text" 
        className={error.fullName ? "error-input" : ""}
        id="fullName" 
        name="fullName" 
        placeholder="Enter your full name"
        value={formData.fullName} 
        onChange={handleChange} 
        required />
        {error.fullName && <span className="error">{error.fullName}</span>}

        <label htmlFor="email">Email Address</label>
        <input type="email" 
        className={error.email ? "error-input" : ""}
        id="email" 
        name="email" 
        placeholder="you@example.com" 
        value={formData.email} 
        onChange={handleChange}
        required />
        {error.email && <span className="error">{error.email}</span>}

        <label htmlFor="password">Password</label>
        <input type="password" 
        className={error.password ? "error-input" : ""}
        id="password" 
        name="password" 
        placeholder="Enter a strong password" 
        value={formData.password} 
        onChange={handleChange}
        required />
        {error.password && <span className="error">{error.password}</span>}
        <button type="submit">Register</button>
        {successMessage && <span className="success">{successMessage}</span>}
      </form>

      <p style={{ marginTop: "1.5rem" }}>
        Already have an account?{" "}
        <Link href="/" style={{ color: "#0070f3", fontWeight: "500" }}>
          Go back to Home
        </Link>
      </p>
    </div>
  );
}
