"use client";

import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useFirestoreCollection(uid, collectionName = "users") {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName, uid, "tasks"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setIsDataLoading(false);
        setDataError(null);
      },
      (error) => {
        setDataError(error.message);
        setIsDataLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, uid]);
  return { data, isDataLoading, dataError };
}
