import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function NotesPage() {
  const { user, logout } = useAuth();

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(
        `notes_${user.email}`
    );

    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
        `notes_${user.email}`,
        JSON.stringify(notes)
    );
  }, [notes, user.email]);
  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Нова нотатка",
      content: "",
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setSelectedNoteId(newNote.id);
  };

  const updateNote = (field, value) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, [field]: value }
          : note
      )
    );
  };

  const deleteNote = () => {
    if (!selectedNote) return;

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== selectedNoteId
      )
    );

    setSelectedNoteId(null);
  };

  return (
    <div className="notes-page">

      <header className="notes-header">
        <div>
          <h1>Мої нотатки</h1>
          <p>Привіт, {user.name} 👋</p>
        </div>

        <div className="user-menu">
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>

          <button
            onClick={logout}
            className="logout-button"
          >
            Вийти
          </button>
        </div>
      </header>

      <main className="notes-content">

        <aside className="notes-sidebar">

          <button
            className="new-note-button"
            onClick={createNote}
          >
            + Нова нотатка
          </button>

          <div className="notes-list">

            {notes.length === 0 ? (
              <p className="empty-notes">
                У вас поки немає нотаток
              </p>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  className={`note-item ${
                    note.id === selectedNoteId
                      ? "note-item-active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedNoteId(note.id)
                  }
                >
                  <strong>
                    {note.title || "Без назви"}
                  </strong>

                  <span>
                    {note.content
                      ? note.content.substring(0, 45)
                      : "Порожня нотатка"}
                  </span>
                </button>
              ))
            )}

          </div>
        </aside>

        <section className="note-editor">

          {selectedNote ? (
            <div className="editor-container">

              <div className="editor-toolbar">
                <button
                  onClick={deleteNote}
                  className="delete-note-button"
                >
                  Видалити
                </button>
              </div>

              <input
                className="note-title-input"
                type="text"
                value={selectedNote.title}
                onChange={(event) =>
                  updateNote(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Назва нотатки"
              />

              <textarea
                className="note-content-input"
                value={selectedNote.content}
                onChange={(event) =>
                  updateNote(
                    "content",
                    event.target.value
                  )
                }
                placeholder="Почніть писати..."
              />

            </div>
          ) : (
            <div className="empty-editor">
              <h2>Оберіть нотатку</h2>

              <p>
                Або створіть нову, щоб почати
                записувати свої думки.
              </p>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default NotesPage;