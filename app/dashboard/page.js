"use client";

import { use, useEffect, useState } from "react";    
import { useRouter } from "next/navigation";
import {auth, db} from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()){
            setUserData(userDocSnap.data());
        }else{
            setUserData({email: user.email, fullName: user.fullName});
        }
    }
        else {
        router.push('/login');
      }
        setLoading(false);
    });
    return () => unsubscribe();
    }, [router]);
    if (loading) {
        return <div><h1>Loading...</h1></div>;
    }   
    
    return (
    <div className="container">
        <h2>Hey, <strong>{user.fullName}</strong>! You’re successfully logged in</h2>
        <button onClick={async () => {
            await auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            router.replace('/login');
        }}>Logout</button>
        </div>
    );
}