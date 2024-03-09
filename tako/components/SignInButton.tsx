"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const SignInButton = () => {
    const session = useSession();
    console.log(session);

    if (session.status === "authenticated") {
        return (
            <button onClick={() => signOut()}>
                Logged in as {session.data?.user?.email} Sign Out
            </button>
        );
    }

    return <button onClick={() => signIn("google")}>Sign In</button>;
};

export default SignInButton;
