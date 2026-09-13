import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header/Header";
import NoteList from "../components/NoteList/NoteList";
import NoteEditor from "../components/NoteEditor/NoteEditor";

function NotesPage() {
  const { user, logout } = useAuth();

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(
      `notes_${user.email}`
    );

    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(
      `notes_${user.email}`,
      JSON.stringify(notes)
    );
  }, [notes, user.email]);

  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

  /* =========================
     СТВОРЕННЯ НОТАТКИ
     ========================= */

  const createNote = () => {
    const currentTime = new Date().toISOString();

    const newNote = {
      id: Date.now(),
      title: "Нова нотатка",
      content: "",
      lastModified: currentTime,
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setSelectedNoteId(newNote.id);
  };

  /* =========================
     РЕДАГУВАННЯ НОТАТКИ
     ========================= */

  const updateNote = (field, value) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              [field]: value,
              lastModified: new Date().toISOString(),
            }
          : note
      )
    );
  };

  /* =========================
     ВИДАЛЕННЯ НОТАТКИ
     ========================= */

  const deleteNote = () => {
    if (!selectedNote) return;

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== selectedNoteId
      )
    );

    setSelectedNoteId(null);
  };

  const confirmDeleteNote = () => {
    if (!deleteNoteId) return;

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== deleteNoteId
      )
    );

    if (selectedNoteId === deleteNoteId) {
      setSelectedNoteId(null);
    }

    setDeleteNoteId(null);
  };

  /* =========================
     ПОВЕРНЕННЯ ДО СПИСКУ
     ========================= */

  const closeNote = () => {
    setSelectedNoteId(null);
  };

  /* =========================
     ВІДОБРАЖЕННЯ
     ========================= */

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    const title = note.title || "";
    const content = note.content || "";

    return (
      title.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query)
    );
  });

  const hasNotes = notes.length > 0;
  const isNoteOpened = selectedNote !== undefined;

  return (
    <div className="notes-page">

      <Header
        user={user}
        onLogout={logout}
      />

      {/* =========================
          НЕМАЄ НОТАТОК
          ========================= */}

      {!hasNotes && (
        <main className="notes-empty-page">
          <button
            className="empty-new-note-button"
            onClick={createNote}
          >
            + Нова нотатка
          </button>
        </main>
      )}

      {/* =========================
          Є НОТАТКИ, АЛЕ ЖОДНА
          НЕ ВІДКРИТА
          ========================= */}

      {hasNotes && !isNoteOpened && (
        <main className="notes-grid-page">

          <div className="notes-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Пошук нотаток..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
            />

            {searchQuery && (
              <button
                className="clear-search-button"
                onClick={() => setSearchQuery("")}
                aria-label="Очистити пошук"
              >
                ×
              </button>
            )}
          </div>

          {filteredNotes.length > 0 ? (
            <div className="notes-grid">

              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`notes-grid-card ${
                    deleteNoteId === note.id
                      ? "delete-selected"
                      : ""
                  }`}
                  onClick={() => {
                    if (deleteNoteId !== note.id) {
                      setSelectedNoteId(note.id);
                    }
                  }}
                >

                  <h3>
                    {note.title || "Без назви"}
                  </h3>

                  <hr />

                  <p>
                    {note.content
                      ? note.content.substring(0, 100)
                      : "Порожня нотатка"}
                  </p>
                  
                  {note.lastModified && (
                    <span className="note-card-date">
                      {new Date(note.lastModified).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  )}

                  <button
                    className="note-card-delete-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteNoteId(note.id);
                    }}
                    aria-label="Видалити нотатку"
                  >
                    🗑
                  </button>

                  {deleteNoteId === note.id && (
                    <div
                      className="delete-confirmation"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <p>Точно видалити нотатку?</p>

                      <div className="delete-confirmation-buttons">

                        <button
                          onClick={() =>
                            setDeleteNoteId(null)
                          }
                        >
                          Ні
                        </button>

                        <button
                          onClick={confirmDeleteNote}
                        >
                          Так
                        </button>

                      </div>
                    </div>
                  )}

                </div>
              ))}

            </div>
          ) : (
            <div className="no-search-results">
              <p>Нічого не знайдено</p>
              <span>
                Спробуйте змінити пошуковий запит
              </span>
            </div>
          )}

          <button
            className="floating-new-note-button"
            onClick={createNote}
            aria-label="Створити нову нотатку"
          >
            +
          </button>

        </main>
      )}

      {/* =========================
          ВІДКРИТА НОТАТКА
          ========================= */}

      {hasNotes && isNoteOpened && (
        <main className="notes-content">

          <aside className="notes-sidebar">

            <button
              className="back-to-notes-button"
              onClick={closeNote}
            >
              ← Усі нотатки
            </button>

            <div className="notes-list-container">
              <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
              />
            </div>

            <button
              className="sidebar-new-note-button"
              onClick={createNote}
              aria-label="Створити нову нотатку"
            >
              +
            </button>

          </aside>

          <section className="note-editor">

            <NoteEditor
              note={selectedNote}
              onTitleChange={(value) =>
                updateNote("title", value)
              }
              onContentChange={(value) =>
                updateNote("content", value)
              }
              onDelete={deleteNote}
            />

          </section>

        </main>
      )}

    </div>
  );
}

export default NotesPage;