"use client";

import { use, useEffect, useState } from "react";    
import { useRouter } from "next/navigation";
import {auth} from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
});
  }, [router]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

  