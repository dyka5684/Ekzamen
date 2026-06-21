export async function loginRequest(nickname) {
    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nickname })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Auth failed");
    }

    return data.token;
}