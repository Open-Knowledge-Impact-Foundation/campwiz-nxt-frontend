"use client";

import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { Campaign } from "@/types";
import { Category, Submission, SubmissionWithCategories } from "@/types/submission";
import { Autocomplete, Button, Chip, LinearProgress, TextField } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackwardIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { updateSubmissionCategories } from "./k";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { useTranslation } from "@/i18n/client";
import { TFunction } from "i18next";
import { CampaignType } from "@/types/campaign/campaignType";
const getSummary = (t: TFunction, categories: Category[]) => {
    let summary = 'Added via [[Commons:CampWiz|CampWiz]] categorizer:\n';
    if (categories.length === 0) {
        return t('submission.noCategoriesSelected');
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
    t: TFunction
}

const getHeightWidth = (currentHeight: number, currentWidth: number, maxHeight: number, maxWidth: number) => {
    if (currentHeight > maxHeight || currentWidth > maxWidth) {
        const heightRatio = currentHeight / maxHeight;
        const widthRatio = currentWidth / maxWidth;
        const ratio = Math.max(heightRatio, widthRatio);
        currentHeight = currentHeight / ratio;
        currentWidth = currentWidth / ratio;
    }
    if (currentHeight < 100) {
        currentHeight = 100; // Minimum height
    }
    if (currentWidth < 100) {
        currentWidth = 100; // Minimum width
    }
    if (currentHeight > maxHeight) {
        currentHeight = maxHeight; // Cap height
    }
    if (currentWidth > maxWidth) {
        currentWidth = maxWidth; // Cap width
    }
    // Round to two decimal places
    return [currentHeight, currentWidth].map(r => Math.round(r * 100) / 100);
}
const SingleSubmission = ({ submission: initialSubmission, cursor, setCursor, totalSubmissions, t }: SingleSubmissionProps) => {
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
        return <p>{t('error.loadingSubmissionDetails', { error: error.message })}</p>;
    }
    if (!('categories' in submission)) {
        return <p>{t('error.categoriesNotLoaded')}</p>;
    }
    const fixedCategories = categories.filter(c => c.fixed); // Filter out fixed categories
    const [thumbheight, thumbwidth] = getHeightWidth(
        submission.thumbheight,
        submission.thumbwidth,
        500, // Max height
        Math.min(window.innerWidth, 500) // Max width
    );
    return (
        <div className="text-center w-full flex flex-col justify-around items-center flex-wrap">
            {loading && <LinearProgress className="w-full" />}
            <p className="mb-3 p-2 block wrap-normal">
                <b className="font-bold">{t('submission.title')}: </b>
                <MuiLink
                    href={`https://commons.wikimedia.org/wiki/File:${submission.title}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    component={Link}
                    title={t('submission.viewOnCommons')}

                >
                    {submission.title.replaceAll("_", " ")} ⇱
                </MuiLink>
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <Image
                    src={submission.thumburl}
                    alt={submission.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    width={thumbwidth}
                    height={thumbheight}
                />
                <div className="max-full md:max-w-96 flex flex-col justify-between items-start">
                    <p className="mb-3 p-2">
                        <b className="font-bold">{t('submission.description')}: </b> {initialSubmission.description}
                    </p>
                    <div>
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
                                <TextField {...params} label={t('submission.categories')} placeholder={t('submission.selectCategories')} variant="outlined" />
                            )}
                        />
                        <div className="flex flex-row justify-between items-center p-2">
                            <Button
                                onClick={() => setCursor(Math.max(cursor - 1, 0))}
                                loading={loading}
                                startIcon={<ArrowBackwardIcon />}
                                disabled={cursor === 0 || loading} variant="contained" color="primary">{t('submission.previous')}</Button>
                            <Button
                                disabled={cursor >= totalSubmissions - 1 || loading}
                                loading={loading}
                                startIcon={<ArrowForwardIcon />}
                                onClick={() => setCursor(Math.min(cursor + 1, totalSubmissions - 1))}
                                variant="contained" color="primary">{t('submission.skip')}</Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleSubmit(submission.submissionId, categories.map(c => c.name), getSummary(t, categories))}
                                sx={{ m: 1 }}
                                disabled={loading}
                                loading={loading}
                                startIcon={<SaveIcon />}
                            >
                                {t('submission.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

const CategorizerPage = ({ campaign, submissions }: { campaign: Campaign, submissions: Submission[] }) => {
    const [cursor, setCursor] = useState<number>(0);
    const currentSubmission = submissions?.[cursor] ?? null;
    const { t } = useTranslation();
    if (!campaign) {
        return <p>{t('error.campaignNotFound')}</p>;
    }
    if (!submissions || submissions.length === 0) {
        return <p>{t('error.noSubmissionAvailableForCategorization')}</p>;
    }
    if (campaign.campaignType != CampaignType.Categorization) {
        return <p>{t('error.campaignCategoriesNotSupported')}</p>;
    }
    if (!currentSubmission) {
        return <p>{t('error.noSubmissions')}</p>;
    }
    return (
        <div className="text-center">
            <SingleSubmission
                submission={currentSubmission}
                cursor={cursor}
                setCursor={setCursor}
                totalSubmissions={submissions.length}
                t={t}
            />
        </div>
    );
}
export default CategorizerPage;