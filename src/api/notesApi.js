import { apiRequest } from "./api";

export async function getNotes() {
    return apiRequest("/Note");
}

export async function getNote(id) {
    return apiRequest(`/Note/${id}`);
}

export async function createNote(title, text) {
    return apiRequest("/Note", {
        method: "POST",
        body: JSON.stringify({
            title,
            text
        })
    });
}

export async function updateNote(id, title, text) {
    return apiRequest(`/Note/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            title,
            text
        })
    });
}

export async function deleteNote(id) {
    return apiRequest(`/Note/${id}`, {
        method: "DELETE"
    });
}