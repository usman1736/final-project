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
import { onAuthStateChanged } from "firebase/auth";

import Button from "@/components/Button";
import { Pencil, Trash2, Plus } from "lucide-react";

import { db, auth } from "../lib/firebase";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { signOut } from "firebase/auth";


export default function HomePage() {
  const router = useRouter();

  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  //user-info
  const [userName, setUserName] = useState("");

  //task
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    const removeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/sign-in");
        return;
      }

      setUser(firebaseUser);
      setAuthLoading(false);

      // Fetch userinfo
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserName(snap.data().name);
      }
    });

    return removeAuth;
  }, [router]);

  
  const { data: tasks } = useFirestoreCollection(user?.uid, "users");

  // add or edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, "tasks", editingId), {
        title: task,
        dueDate: new Date(dueDate),
      });
    } else {
      await addDoc(collection(db, "tasks"), {
        title: task,
        completed: false,
        dueDate: new Date(dueDate),
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    setTask("");
    setDueDate("");
    setEditingId(null);
    setShowModal(false);
  };

  // check box toggle
  const toggleComplete = async (item) => {
    await updateDoc(doc(db, "tasks", item.id), {
      completed: !item.completed,
    });
  };

  // edit
  const handleEdit = (item) => {
    setTask(item.title);
    setDueDate(new Date(item.dueDate.toDate()).toISOString().slice(0, 16));
    setEditingId(item.id);
    setShowModal(true);
  };

  // delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };
  // signout
const handleSignout = async () => {
  await signOut(auth);
  router.replace("/sign-in");
};



  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-gray-300 min-h-screen w-screen flex flex-col items-center p-10">
      <h1 className="text-black text-5xl font-extrabold mb-10">TaskFlow</h1>

      {/* header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <p className="text-xl font-medium text-black">Welcome {userName}</p>

        <button
          onClick={() => {
            setTask("");
            setDueDate("");
            setEditingId(null);
            setShowModal(true);
          }}
          className=" text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
          aria-label="Add Task"
        >
          <Plus size={26} />
      
        </button>
      </div>

      {/* task lis */}
      <div className="w-full max-w-3xl space-y-6">
        {tasks.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-100 px-6 py-5 rounded-xl shadow"
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
                  className={`font-semibold ${
                    item.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {item.title}
                </div>
                {item.dueDate && (
                  <div className="text-sm text-gray-700">
                    Due: {item.dueDate.toDate().toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Edit & delete icons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-gray-100 p-12 rounded-xl w-full max-w-xl shadow-xl">
            <h2 className="text-2xl text to-black font-bold mb-8 text-center">
              {editingId ? "Edit Task" : "Add Task"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Task name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="px-4 py-3 rounded-md"
                required
              />

              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-3 rounded-md"
                required
              />

              <div className="flex justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-black px-6 py-2 rounded-md shadow hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 rounded-md shadow hover:bg-gray-200 transition"
                >
                  {editingId ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* signout button */}
<button
  onClick={handleSignout}
  className="
    fixed bottom-6 right-6
    bg-black text-white
    px-6 py-3
    rounded-full
    shadow-lg
    hover:bg-gray-800
    transition
  "
>
  Sign Out
</button>

    </main>
  );
}
