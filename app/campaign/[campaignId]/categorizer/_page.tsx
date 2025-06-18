"use client";

import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { Campaign } from "@/types";
import { Category, Submission, SubmissionWithCategories } from "@/types/submission";
import { Autocomplete, Button, Chip, LinearProgress, TextField } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import { updateSubmissionCategories } from "./k";
const getSummary = (categories: Category[]) => {
    let summary = 'Added via [[Commons:CampWiz|CampWiz]] categorizer:\n';
    if (categories.length === 0) {
        return "No categories selected.";
    }
    for (const category of categories) {
        if (category.fixed) {
            continue; // Skip fixed categories
        } else {
            summary += `+ ${category.name}\n`;
        }
    }
    return summary;
}
type SingleSubmissionProps = {
    submission: Submission;
    cursor: number;
    setCursor: (cursor: number) => void;
    totalSubmissions: number;
}
const SingleSubmission = ({ submission: initialSubmission, cursor, setCursor, totalSubmissions }: SingleSubmissionProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleSubmit = async (submissionId: string, categories: string[], summary: string) => {
        setLoading(true);
        try {
            const response = await updateSubmissionCategories(submissionId, categories, summary);
            if (!response || 'detail' in response) {
                console.error("Error updating submission categories:", response);
                return;
            }
            if (cursor >= totalSubmissions - 1) {
                document.location.reload(); // Reload the page if we are at the last submission
            } else {
                setCursor(Math.min(cursor + 1, totalSubmissions - 1)); // Move to next submission
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    // const [description, setDescription] = useState<string>(initialSubmission.description || '');
    const [categories, setCategories] = useState<Category[]>([]);
    const [submission, setSubmission] = useState<SubmissionWithCategories | Submission>(initialSubmission);
    const { isLoading, error } = useSWR(`/category/${initialSubmission.submissionId}`, fetchAPIFromBackendSingleWithErrorHandling<SubmissionWithCategories>, {
        onSuccess: (data) => {
            if (data && 'data' in data && data.data) {
                const submissionWithCategories = data.data as SubmissionWithCategories;
                // setDescription(submissionWithCategories.description || '');
                setCategories(submissionWithCategories.categories || []);
                setSubmission(submissionWithCategories);
            }
        },
        onError: (err) => {
            console.error("Error fetching submission categories:", err);
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
    })
    if (isLoading) {
        return <LinearProgress className="w-full" />;
    }
    if (error) {
        return <p>Error loading submission details: {error.message}</p>;
    }
    if (!('categories' in submission)) {
        return <p>Categories not loaded for this submission.</p>;
    }
    const fixedCategories = categories.filter(c => c.fixed); // Filter out fixed categories
    return (
        <div className="text-center w-full flex flex-row justify-around items-center flex-wrap">
            <div><p>Title: {submission.title}</p>
                <Image
                    src={submission.thumburl}
                    alt={submission.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    width={submission.thumbwidth}
                    height={submission.thumbheight}
                />
            </div>
            <div>
                <p>Description: {initialSubmission.description}</p>
                {/* <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        m: 1
                    }}
                /> */}
                <Autocomplete
                    multiple
                    id="campwiz-categories"
                    value={categories}
                    onChange={(event, newValue) => {
                        const nonFixedCategories = newValue.filter(c => !c.fixed);
                        const uniqueCategories = Array.from(new Set(nonFixedCategories.map(c => c.name)))
                            .map(name => nonFixedCategories.find(c => c.name === name) || { name, fixed: false });

                        newValue = [...fixedCategories, ...uniqueCategories].toSorted((a, b) => a.name.localeCompare(b.name));
                        setCategories(newValue);
                    }}
                    size="small"
                    options={submission.categories}
                    getOptionLabel={(option) => option.name}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option.name}
                                {...getTagProps({ index })}
                                disabled={option.fixed}
                                key={index}
                                size="small"
                            />
                        ))
                    }

                    className="max-w-fit"
                    renderInput={(params) => (
                        <TextField {...params} label="Categories" placeholder="Select categories" variant="outlined" />
                    )}
                />
                <div className="flex flex-row justify-between items-center">
                    <Button
                        onClick={() => setCursor(Math.max(cursor - 1, 0))}
                        loading={loading}
                        disabled={cursor === 0 || loading} variant="contained" color="primary">Previous</Button>
                    <Button
                        disabled={cursor >= totalSubmissions - 1 || loading}
                        loading={loading}
                        onClick={() => setCursor(Math.min(cursor + 1, totalSubmissions - 1))}
                        variant="contained" color="primary">Skip</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit(submission.submissionId, categories.map(c => c.name), getSummary(categories))}
                        sx={{ m: 1 }}
                        disabled={loading}
                        loading={loading}
                    >
                        Submit Categories
                    </Button>
                </div>
                <p>Submission {cursor + 1} of {totalSubmissions}</p>
            </div>
        </div>
    );
}

const CategorizerPage = ({ campaign, submissions }: { campaign: Campaign, submissions: Submission[] }) => {
    const [cursor, setCursor] = useState<number>(0);
    const currentSubmission = submissions?.[cursor] ?? null;
    if (!currentSubmission) {
        return <p>No submissions to categorize.</p>;
    }
    return (
        <div className="text-center">
            <h1>{campaign.name}</h1>
            <SingleSubmission
                submission={currentSubmission}
                cursor={cursor}
                setCursor={setCursor}
                totalSubmissions={submissions.length}
            />
        </div>
    );
}
export default CategorizerPage;