import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NoteContext";

import Header from "../components/Header/Header";
import NoteList from "../components/NoteList/NoteList";
import NoteEditor from "../components/NoteEditor/NoteEditor";

const SAVE_DEBOUNCE_MS = 600;

function NotesPage() {
  const { user, logout } = useAuth();
  const { notes, loading, fetchNotes, addNote, editNote, removeNote } =
    useNotes();

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Локальний чернетковий стан для нотатки, що редагується —
  // щоб не бити запит на сервер на кожне натискання клавіші.
  const [draft, setDraft] = useState({ title: "", content: "" });
  const saveTimerRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    if (selectedNote) {
      setDraft({
        title: selectedNote.title ?? "",
        content: selectedNote.text ?? selectedNote.content ?? ""
      });
    }
  }, [selectedNoteId]); // eslint-disable-line react-hooks/exhaustive-deps

  const flushPendingSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  };

  const scheduleSave = (nextDraft) => {
    flushPendingSave();
    saveTimerRef.current = setTimeout(() => {
      if (!selectedNoteId) return;
      editNote(selectedNoteId, nextDraft.title, nextDraft.content).catch(
        (err) => console.error("Не вдалося зберегти нотатку", err)
      );
    }, SAVE_DEBOUNCE_MS);
  };

  /* =========================
     СТВОРЕННЯ НОТАТКИ
     ========================= */

  const createNote = async () => {
    try {
      const newNote = await addNote("Нова нотатка", "");
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Не вдалося створити нотатку", err);
    }
  };

  /* =========================
     РЕДАГУВАННЯ НОТАТКИ
     ========================= */

  const updateTitle = (value) => {
    const next = { ...draft, title: value };
    setDraft(next);
    scheduleSave(next);
  };

  const updateContent = (value) => {
    const next = { ...draft, content: value };
    setDraft(next);
    scheduleSave(next);
  };

  /* =========================
     ВИДАЛЕННЯ НОТАТКИ
     ========================= */

  const deleteNote = async () => {
    if (!selectedNote) return;
    flushPendingSave();
    try {
      await removeNote(selectedNoteId);
      setSelectedNoteId(null);
    } catch (err) {
      console.error("Не вдалося видалити нотатку", err);
    }
  };

  const confirmDeleteNote = async () => {
    if (!deleteNoteId) return;
    try {
      await removeNote(deleteNoteId);
      if (selectedNoteId === deleteNoteId) {
        flushPendingSave();
        setSelectedNoteId(null);
      }
    } catch (err) {
      console.error("Не вдалося видалити нотатку", err);
    } finally {
      setDeleteNoteId(null);
    }
  };

  /* =========================
     ПОВЕРНЕННЯ ДО СПИСКУ
     ========================= */

  const closeNote = () => {
    flushPendingSave();
    if (selectedNoteId) {
      // синхронно "доганяємо" останні незбережені зміни перед виходом
      editNote(selectedNoteId, draft.title, draft.content).catch((err) =>
        console.error("Не вдалося зберегти нотатку", err)
      );
    }
    setSelectedNoteId(null);
  };

  /* =========================
     ВІДОБРАЖЕННЯ
     ========================= */

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const title = note.title || "";
    const content = note.text || note.content || "";

    return (
      title.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query)
    );
  });

  const hasNotes = notes.length > 0;
  const isNoteOpened = selectedNote !== undefined;

  return (
    <div className="notes-page">
      <Header user={user} onLogout={logout} />

      {loading && notes.length === 0 && (
        <main className="notes-loading">
          <p>Завантаження нотаток...</p>
        </main>
      )}

      {/* =========================
          НЕМАЄ НОТАТОК
          ========================= */}

      {!loading && !hasNotes && (
        <main className="notes-empty-page">
          <button className="empty-new-note-button" onClick={createNote}>
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
              onChange={(event) => setSearchQuery(event.target.value)}
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
                    deleteNoteId === note.id ? "delete-selected" : ""
                  }`}
                  onClick={() => {
                    if (deleteNoteId !== note.id) {
                      setSelectedNoteId(note.id);
                    }
                  }}
                >
                  <h3>{note.title || "Без назви"}</h3>

                  <hr />

                  <p>
                    {note.text || note.content
                      ? (note.text || note.content).substring(0, 100)
                      : "Порожня нотатка"}
                  </p>

                  {(note.lastModified || note.updatedAt) && (
                    <span className="note-card-date">
                      {new Date(
                        note.lastModified || note.updatedAt
                      ).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
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
                      onClick={(event) => event.stopPropagation()}
                    >
                      <p>Точно видалити нотатку?</p>

                      <div className="delete-confirmation-buttons">
                        <button onClick={() => setDeleteNoteId(null)}>
                          Ні
                        </button>

                        <button onClick={confirmDeleteNote}>Так</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-search-results">
              <p>Нічого не знайдено</p>
              <span>Спробуйте змінити пошуковий запит</span>
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
            <button className="back-to-notes-button" onClick={closeNote}>
              ← Усі нотатки
            </button>

            <div className="notes-list-container">
              <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={(id) => {
                  flushPendingSave();
                  if (selectedNoteId) {
                    editNote(selectedNoteId, draft.title, draft.content).catch(
                      (err) => console.error("Не вдалося зберегти нотатку", err)
                    );
                  }
                  setSelectedNoteId(id);
                }}
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
              note={selectedNote ? { ...selectedNote, content: draft.content, title: draft.title } : null}
              onTitleChange={updateTitle}
              onContentChange={updateContent}
              onDelete={deleteNote}
            />
          </section>
        </main>
      )}
    </div>
  );
}

export default NotesPage;
