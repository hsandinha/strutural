"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface ProtectedRouteProps {
  allowedProfiles: string[]; // perfis permitidos, ex: ["admin", "corretor"]
  children: ReactNode;
  fallbackPath?: string; // caminho para redirecionar se não autorizado (default "/login")
}

export default function ProtectedRoute({
  allowedProfiles,
  children,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace(fallbackPath);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        router.replace(fallbackPath);
        return;
      }

      const perfil = userDoc.data().perfil;
      if (!allowedProfiles.includes(perfil)) {
        router.replace(fallbackPath);
        return;
      }

      setAuthorized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedProfiles, fallbackPath, router]);

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!authorized) {
    return null; // ou um fallback visual
  }

  return <>{children}</>;
}
