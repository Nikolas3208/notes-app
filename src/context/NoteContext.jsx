import { createContext, useContext, useState, useCallback } from "react";
import {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} from "../api/notesApi";

const NoteContext = createContext(null);

export function NoteProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotes();
            setNotes(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchNote = useCallback(async (id) => {
        setError(null);
        try {
            return await getNote(id);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const addNote = useCallback(async (title, text) => {
        setError(null);
        try {
            // POST /Note повертає лише Guid нової нотатки, а не повний об'єкт —
            // тому збираємо об'єкт для локального стейту самі.
            const id = await createNote(title, text);
            const newNote = { id, title, text, created: new Date().toISOString() };
            setNotes((prev) => [...prev, newNote]);
            return newNote;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const editNote = useCallback(async (id, title, text) => {
        setError(null);
        try {
            // PUT /Note/{id} теж повертає лише Guid, тому не підміняємо ним
            // локальний об'єкт нотатки, а мержимо нові title/text в існуючий.
            await updateNote(id, title, text);
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, title, text } : note
                )
            );
            return { id, title, text };
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const removeNote = useCallback(async (id) => {
        setError(null);
        try {
            await deleteNote(id);
            setNotes((prev) => prev.filter((note) => note.id !== id));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const value = {
        notes,
        loading,
        error,
        fetchNotes,
        fetchNote,
        addNote,
        editNote,
        removeNote
    };

    return (
        <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
    );
}

export function useNotes() {
    const ctx = useContext(NoteContext);
    if (!ctx) {
        throw new Error("useNotes повинен використовуватись всередині NoteProvider");
    }
    return ctx;
}
