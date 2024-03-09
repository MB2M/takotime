import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export const apiHandler =
    (
        handler: (
            req: Request
        ) => Promise<
            | Response
            | { success?: boolean; status?: number; data?: object }
            | undefined
            | void
        >
    ) =>
    async (request: Request) => {
        try {
            const handlerReturn = await handler(request);

            if (handlerReturn instanceof Response) {
                return handlerReturn;
            }

            let {
                success = true,
                status = 200,
                data = {},
            } = handlerReturn || {};

            return new Response(
                JSON.stringify({ success, data: { ...data } }),
                {
                    status,
                }
            );
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof z.ZodError) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: fromZodError(error).message,
                    }),
                    {
                        status: 400,
                    }
                );
            }
            if (error instanceof SyntaxError) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "The input was not valid JSON",
                    }),
                    { status: 400 }
                );
            }
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "An unhandled error occurred",
                }),
                { status: 500 }
            );
        }
    };
