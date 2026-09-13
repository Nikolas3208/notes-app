import styles from "./NoteEditor.module.css";

function NoteEditor({
  note,
  onTitleChange,
  onContentChange,
  onDelete,
}) {
  if (!note) {
    return (
      <div className={styles.empty}>
        <p>Оберіть нотатку або створіть нову</p>
      </div>
    );
  }

  const formattedDate = note.lastModified
    ? new Date(note.lastModified).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className={styles.editor}>

      <input
        className={styles.title}
        type="text"
        value={note.title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Заголовок"
      />

      {formattedDate && (
        <div className={styles.date}>
          Остання зміна: {formattedDate}
        </div>
      )}

      <hr />

      <textarea
        className={styles.content}
        value={note.content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Текст нотатки..."
      />

      <button
        className={styles.deleteButton}
        onClick={onDelete}
      >
        Видалити нотатку
      </button>

    </div>
  );
}

export default NoteEditor;