"use server";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import fetchAPIFromBackendSingleWithErrorHandling, { fetchAPIFromBackendListWithErrorHandling } from "@/server";
import { Campaign } from "@/types";
import { Submission } from "@/types/submission";
import { redirect } from "next/navigation";
import CategorizerPage from "./_page";
import { CampaignType } from "@/types/campaign/campaignType";

const redirectForLogin = (campaignId: string) => {
    const qs = new URLSearchParams({
        next: '/campaign/' + campaignId + '/categorizer',
        pathName: '/user/login/write'
    });
    return redirect(`/user/login?${qs.toString()}`);
}

const Categorizer = async ({ params }: { params: Promise<{ campaignId: string }> }) => {
    const { campaignId } = await params;
    const qs = new URLSearchParams();
    qs.append('includeRoles', 'true');
    qs.append('includeProject', 'true');
    qs.append('includeRounds', 'true');
    qs.append('includeRoundRoles', 'true');
    const campaignResponse = await fetchAPIFromBackendSingleWithErrorHandling<Campaign>(`/campaign/${campaignId}/?${qs.toString()}`);
    if (!campaignResponse) {
        return null;
    }
    if ('detail' in campaignResponse) {
        return <p>Error : {campaignResponse.detail}</p>;
    }
    const campaign = campaignResponse.data;
    if (campaign.campaignType !== CampaignType.Categorization) {
        return <p>This page is only for campaigns which has enabled categorization.</p>;
    }
    const submissionResponse = await fetchAPIFromBackendListWithErrorHandling<Submission>(`/category/uncategorized/${campaignId}`);
    if (!submissionResponse) {
        return <p>Error fetching uncategorized submissions.</p>;
    }
    if ('detail' in submissionResponse) {
        if (submissionResponse.detail.startsWith('noAuth-')) {
            return redirectForLogin(campaignId);
        }
        return <p>Error : {submissionResponse.detail}</p>;
    }
    const uncategorizedSubmissions = submissionResponse.data;
    if (uncategorizedSubmissions.length === 0) {
        return <p>No uncategorized submissions found for this campaign.</p>;
    }
    return (
        <div>
            <Header returnTo={`/campaign/${campaign.campaignId}`} />
            <CategorizerPage campaign={campaign} submissions={uncategorizedSubmissions} />
            <Footer />
        </div>
    );

}
export default Categorizer;