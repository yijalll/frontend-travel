import { GetServerSidePropsContext } from "next"

export type Guard = (boolean | any)[]

export const guard = (context: GetServerSidePropsContext): Guard => {
    const token: string | undefined = context.req.cookies.token;
    if (!token) return [false, null]
    return [true, token]
}