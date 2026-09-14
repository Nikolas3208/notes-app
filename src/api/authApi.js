import { apiRequest } from "./api";

export async function login(email, password) {
    return apiRequest("/User/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function register(firstName, email, password) {
    return apiRequest("/User/register", {
        method: "POST",
        body: JSON.stringify({
            firstName,
            email,
            password
        })
    });
}

// Окремого /User/me немає, тому валідність куки перевіряємо
// звернувшись до будь-якого захищеного ендпоінта.
// 200 -> кука валідна, 401 -> ні (apiRequest кине помилку).
export async function checkSession() {
    return apiRequest("/Note", { method: "GET" });
}