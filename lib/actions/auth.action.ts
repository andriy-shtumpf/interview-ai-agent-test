"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const SESSION_COOKIE_EXP = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists",
            };
        }

        await db.collection("users").doc(uid).set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });

        return { success: true, message: "User created successfully" };
    } catch (error: any) {
        console.error("Error creating user:", error);

        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "Email already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create user",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userCredential = await auth.getUserByEmail(email);

        if (!userCredential) {
            return {
                success: false,
                message: "User does not exist. Create an account first.",
            };
        }

        await setSessionCookie(idToken);
    } catch (error: any) {
        console.error("Error signing in:", error);

        if (error.code === "auth/user-not-found") {
            return {
                success: false,
                message: "User not found",
            };
        }

        if (error.code === "auth/wrong-password") {
            return {
                success: false,
                message: "Incorrect password",
            };
        }

        return {
            success: false,
            message: "Failed to sign in",
        };
    }
}

export async function setSessionCookie(token: string) {
    const storeCookies = await cookies();

    const sessionCookie = await auth.createSessionCookie(token, {
        expiresIn: SESSION_COOKIE_EXP * 1000,
    });

    storeCookies.set("session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_COOKIE_EXP,
        path: "/",
        sameSite: "lax",
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const storeCookies = await cookies();
    const sessionCookie = storeCookies.get("session")?.value || "";

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(
            sessionCookie,
            true
        );
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) {
            return null;
        }

        return { ...userRecord.data(), id: userRecord.id } as User;
    } catch (error: any) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}
