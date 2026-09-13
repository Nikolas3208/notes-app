import styles from "./NoteCard.module.css";

function NoteCard({ note, isActive, onClick }) {
  return (
    <button
      className={`${styles.noteCard} ${
        isActive ? styles.active : ""
      }`}
      onClick={onClick}
    >
      <h3>{note.title || "Без назви"}</h3>

      <hr />

      <p>
        {note.content
          ? note.content.substring(0, 45)
          : "Порожня нотатка"}
      </p>
    </button>
  );
}

export default NoteCard;