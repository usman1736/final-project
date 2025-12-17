"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Pencil, Trash2, Plus } from "lucide-react";

import { db, auth } from "../lib/firebase";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/sign-in");
        return;
      }

      setUser(firebaseUser);
      setAuthLoading(false);

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserName(snap.data().name);
      }
    });

    return unsubscribe;
  }, [router]);

  const { data: tasks } = useFirestoreCollection(user?.uid, "users");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      title: task,
      completed: false,
      createdAt: serverTimestamp(),
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    if (editingId) {
      await updateDoc(doc(db, "users", user.uid, "tasks", editingId), taskData);
    } else {
      await addDoc(collection(db, "users", user.uid, "tasks"), taskData);
    }

    setTask("");
    setDueDate("");
    setEditingId(null);
    setShowModal(false);
  };

  const toggleComplete = async (item) => {
    await updateDoc(doc(db, "users", user.uid, "tasks", item.id), {
      completed: !item.completed,
    });
  };

  const handleEdit = (item) => {
    setTask(item.title);
    setDueDate(
      item.dueDate
        ? new Date(item.dueDate.toDate()).toISOString().slice(0, 16)
        : ""
    );
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  const handleSignout = async () => {
    await signOut(auth);
    router.replace("/sign-in");
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-black dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-gray-300 dark:bg-black min-h-screen w-screen flex flex-col items-center p-10">
      <h1 className="text-black dark:text-white text-5xl font-extrabold mb-10">
        TaskFlow
      </h1>

      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <p className="text-xl font-medium text-black dark:text-white">
          Welcome {userName}
        </p>

        <button
          onClick={() => {
            setTask("");
            setDueDate("");
            setEditingId(null);
            setShowModal(true);
          }}
          className="text-black dark:text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <Plus size={26} />
        </button>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        {tasks.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-6 py-5 rounded-xl shadow"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item)}
                className="w-5 h-5"
              />

              <div>
                <div
                  className={`font-semibold text-black dark:text-white ${
                    item.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {item.title}
                </div>
                {item.dueDate && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Due: {item.dueDate.toDate().toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="bg-black dark:bg-white text-white dark:text-black w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="bg-black dark:bg-white text-white dark:text-black w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-gray-100 dark:bg-gray-900 p-12 rounded-xl w-full max-w-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-8 text-center text-black dark:text-white">
              {editingId ? "Edit Task" : "Add Task"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="px-4 py-3 rounded-md border border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                required
              />

              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-3 rounded-md border border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
              />

              <div className="flex justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white dark:bg-gray-700 text-black dark:text-white px-6 py-2 rounded-md shadow"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-white dark:bg-gray-700 text-black dark:text-white px-6 py-2 rounded-md shadow"
                >
                  {editingId ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={handleSignout}
        className="fixed bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-lg"
      >
        Sign Out
      </button>
    </main>
  );
}
