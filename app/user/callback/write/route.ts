import { loginCallbackAction } from "@/provider/session/action";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const scheme = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost';
    if (!host || !scheme) {
        throw new Error('Missing host or scheme')
    }
    const origin = `${scheme}://${host}`;
    if (!origin) {
        throw new Error('Missing origin')
    }
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    if (!code) {
        return NextResponse.redirect(new URL(`/user/callback/error?error=Missing code`, origin).toString());
    }
    const state = searchParams.get('state');
    if (!state) {
        return NextResponse.redirect(new URL(`/user/callback/error?error=Missing state`, origin).toString());
    }
    const res = await loginCallbackAction(code, state, '/user/callback/write');
    if ('detail' in res) {
        const qs = new URLSearchParams({
            error: res.detail,
            state
        }).toString();
        const response = NextResponse.redirect(new URL(`/user/callback/error?${qs}`, origin).toString());
        return response
    }
    const url = new URL(res.data.redirect, origin);
    const response = NextResponse.redirect(url.toString());
    return response
}