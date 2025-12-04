import {
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const addUser = async (name, email, uid) => {
  try {
    await setDoc(doc(db, "users", uid), {
      name: name,
      email: email,
    });
  } catch (error) {
    console.error(`Error creating a new doc for the user: ${uid}`, error);
  }
};

export const getUser = async (uid) => {
  try {
    const userInfo = await getDoc(doc(db, "users", uid));
    return userInfo.data();
  } catch (error) {
    console.error("Error getting user", error);
  }
};

export const addItem = async (uid, itemName) => {
  try {
    await addDoc(collection(db, "users", uid, "tasks"), {
      name: itemName,
    });
  } catch (error) {
    console.error(`Error adding ${itemName} to Collection tasks`);
  }
};

export const updateItem = async (uid, id, newName) => {
  try {
    const itemDoc = doc(db, "users", uid, "tasks", id);
    await updateDoc(itemDoc, { name: newName });
  } catch (error) {
    console.error(`Error Updating: ${id} ${newName}`, error);
  }
};

export const deleteItem = async (uid, id) => {
  try {
    const itemDoc = doc(db, "users", uid, "tasks", id);
    await deleteDoc(itemDoc);
  } catch (error) {
    console.error(`Error deleting ${id}`);
  }
};
