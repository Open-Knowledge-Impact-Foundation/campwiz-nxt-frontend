"use server";

import { fetchAPIFromBackendListWithErrorHandling } from "@/server";
import { Submission, SubmissionWithCategories } from "@/types/submission";

const doThings = async (campaignId: string) => {
    const submissionResponse = await fetchAPIFromBackendListWithErrorHandling<Submission>(`/category/uncategorized/${campaignId}`);
    return submissionResponse;
}
export const getCategories = async (submissionId: string) => {
    const submissionResponse = await fetchAPIFromBackendListWithErrorHandling<SubmissionWithCategories>(`/category/${submissionId}`);
    return submissionResponse;
}
export const updateSubmissionCategories = async (submissionId: string, categories: string[], summary: string) => {
    const response = await fetchAPIFromBackendListWithErrorHandling<SubmissionWithCategories>(`/category/${submissionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            categories,
            summary,
        }),
    });
    if ('detail' in response) {
        throw new Error(response.detail);
    }
    return response;
}
export default doThings;