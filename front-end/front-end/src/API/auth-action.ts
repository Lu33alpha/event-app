import type {LoginResponse, User} from "../utils/type";

export async function login(username: string, password: string): Promise<string> {

    const res = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    })
    const data = await res.json();
    const data2: LoginResponse = data;

    if (!res.ok) {
        let msg = "Cannot create user";
        try {

            if (data?.error) msg = data.error;
        } catch {

        }
        throw new Error(msg);
    }


    localStorage.setItem("token", data2.token);
    await validateToken();

    return data2.token;
}

export async function validateToken(): Promise<User> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("no token");
    }

    const res = await fetch("/api/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Invalid token");
    }

    const data = await res.json();

    // 🔥 STOCKAGE UTILISATEUR
    localStorage.setItem("userId", String(data.id));
    localStorage.setItem("username", data.username);

    return data;
}


export async function signUp(username: string, password: string): Promise<string> {

    const res = await fetch("/api/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    });


    if (!res.ok) {
        let msg = "Cannot create user";
        try {
            const data = await res.json();
            if (data?.error) msg = data.error;
        } catch {

        }
        throw new Error(msg);
    }

    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);
    await validateToken();

    return data.token;


}

