import NoteCard from "../NoteCard/NoteCard";
import styles from "./NoteList.module.css";

function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
}) {
  if (notes.length === 0) {
    return (
      <div className={styles.empty}>
        <p>У вас поки немає нотаток</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          isActive={note.id === selectedNoteId}
          onClick={() => onSelectNote(note.id)}
        />
      ))}
    </div>
  );
}

export default NoteList;