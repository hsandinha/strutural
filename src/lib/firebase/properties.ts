// src/lib/firebase/properties.ts
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { Imovel } from "@/types";

export async function getProperties(): Promise<Imovel[]> {
  try {
    const propertiesCollection = collection(db, "imoveis");
    const q = query(propertiesCollection, limit(20)); // Busca até 20 imóveis

    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Imovel[];

    return properties;
  } catch (error) {
    console.error("Erro ao buscar imóveis do Firestore:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}
