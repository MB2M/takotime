// "use server";
import { auth } from "@/auth";
import { Session, User } from "next-auth";
import { PermissionError } from "@/lib/errors/PermissionError";

// export type WithSession = <T extends (session: Session, ...args: any) => any>(
//     cb: T
// ) => (...args: OmitFirst<Parameters<T>>) => Promise<ReturnType<T>>;
// export const withSession: WithSession =
//     (cb) =>
//     async (...args) => {
//         const user = await auth();
//         if (!user?.user) {
//             throw new PermissionError("Please connect first");
//         }
//
//         return await cb(user, ...args);
//     };
//

export type WithSessionUser = <T extends (session: User, ...args: any) => any>(
    cb: T
) => Promise<ReturnType<T>>;
export const withSessionUser: WithSessionUser = async (cb) => {
    const user = await auth();
    if (!user?.user) {
        throw new PermissionError("Please connect first");
    }

    return cb(user.user);
};
