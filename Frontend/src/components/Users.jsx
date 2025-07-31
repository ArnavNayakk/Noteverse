import React, { useEffect, useState } from 'react';
import axios from 'axios';
import deleteIcon from '../assets/delete.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getAuthToken = () =>
    localStorage.getItem('token') || sessionStorage.getItem('token');

 useEffect(() => {
  const userDataString = localStorage.getItem('hd_user') || sessionStorage.getItem('hd_user');
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    setUser({ name: userData.name ?? '', email: userData.email ?? '' });
  }
  fetchNotes();
}, []);


const fetchNotes = async () => {
  try {
    const token = getAuthToken();
    const { data } = await axios.get(`${BACKEND_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(data.reverse().map(note => ({ ...note, isSaved: true })));
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('hd_user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('hd_user');
      window.location.href = '/login';
      return;
    }
    console.error('Error fetching notes:', error);
    toast.error('Failed to load notes');
  }
};

  const handleCreateNote = async () => {
  try {
    const token = getAuthToken();
    console.log('Token:', token);

    if (!token) {
      toast.error('Token missing. Please log in again.');
      return;
    }

    const { data } = await axios.post(
      `${BACKEND_URL}/api/notes`,
      { text: 'Write your note here....' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotes([{ ...data, isSaved: false }, ...notes]);
    setExpandedNoteIndex(0);
  } catch (error) {
    console.error('Error creating note:', error?.response?.data || error);
    toast.error('Failed to create note');
  }
};


  const handleNoteChange = (index, value) => {
    const updated = [...notes];
    updated[index].text = value;
    setNotes(updated);
  };

  const handleSaveNote = async (index) => {
    try {
      const token = getAuthToken();
      const noteToUpdate = notes[index];

      await axios.put(
        `${BACKEND_URL}/api/notes/${noteToUpdate._id}`,
        { text: noteToUpdate.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = [...notes];
      updated[index].isSaved = true;
      setNotes(updated);
      toast.success('Note saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDeleteNote = async (index) => {
    try {
      const token = getAuthToken();
      const noteToDelete = notes[index];

      await axios.delete(`${BACKEND_URL}/api/notes/${noteToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = notes.filter((_, i) => i !== index);
      setNotes(updated);
      toast.success('Note deleted!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleEditNote = (index) => {
    const updated = [...notes];
    updated[index].isSaved = false;
    setNotes(updated);
    setExpandedNoteIndex(index);
    toast.info('Edit mode enabled');
  };

  const toggleExpandNote = (index) => {
    setExpandedNoteIndex(expandedNoteIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-0">
      <ToastContainer />

      <div className="w-full max-w-2xl px-8 py-12 mt-15 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-300 bg-white">
        <div className="flex flex-col justify-center items-center">
          <p className="text-3xl font-bold text-center w-full">
            Welcome, {user.name}!
          </p>
          <p className="text-gray-500 text-center w-full mt-2">
            Email: {user.email}
          </p>
        </div>
      </div>

      <button
        className="w-full max-w-2xl bg-blue-500 text-white text-lg py-3 rounded-xl mt-6 shadow-md hover:bg-blue-600"
        onClick={handleCreateNote}
      >
        Create Note
      </button>

      <div className="w-full max-w-4xl mt-8 space-y-4 px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold">Notes</h2>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            No notes yet. Create your first note now!
          </p>
        ) : (
          notes.map((note, index) => (
            <div
              key={note._id || index}
              className="flex items-start justify-between bg-white px-4 py-3 rounded-lg shadow-md border border-gray-300"
            >
              <div className="flex-1">
                {expandedNoteIndex === index && !note.isSaved ? (
                 <textarea
                    className="w-full border-none outline-none text-gray-800 text-base overflow-hidden resize-none whitespace-pre-wrap break-all"
                    placeholder="Write your note..."
                    value={note.text}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    ref={(el) => {
                      if (el) {
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                  />

                ) : (
                  <p
                    className={`text-gray-800 text-base cursor-pointer whitespace-pre-wrap break-all ${
                      expandedNoteIndex === index ? 'max-h-[300px] overflow-auto' : 'line-clamp-3'
                    }`}
                    onClick={() => toggleExpandNote(index)}
                   >
                    {note.text}
                  </p>


                )}
              </div>

              <div className="ml-4 flex flex-col items-end">
                {note.isSaved ? (
                  <>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="w-5 h-5 cursor-pointer mb-1"
                      onClick={() => handleDeleteNote(index)}
                    />
                    <button
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() => handleEditNote(index)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleSaveNote(index)}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Users;
