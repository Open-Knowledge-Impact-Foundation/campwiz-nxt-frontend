"use server";

import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { redirect } from "next/navigation";

type RedirectResponse = {
    redirect: string
}
export const loginInitiateAction = async (base: string, callback: string | null, pathName: string = '/user/login') => {
    const qs = `?next=${callback || '/'}`
    const res = await fetchAPIFromBackendSingleWithErrorHandling<RedirectResponse>(pathName + qs, {
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'manual',
    });
    if ('detail' in res) {
        throw new Error(res.detail)
    }
    const location = res.data.redirect
    if (!location) {
        throw new Error('Location header missing')
    }
    return redirect(location)
}
export const loginCallbackAction = async (code: string, state: string, pathName: string = '/user/callback') => {
    const qs = `?code=${code}&state=${state}&next=${pathName}`
    const res = await fetchAPIFromBackendSingleWithErrorHandling<RedirectResponse>(pathName + qs, {
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'manual',
    });
    return res
}
export default loginInitiateAction