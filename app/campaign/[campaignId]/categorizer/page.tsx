import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { Campaign } from "@/types";

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

    return (
        <div>
            <Header returnTo={`/campaign/${campaign.campaignId}`} />
            {/* <CategorizerPage campaign={campaign} /> */}
            <Footer />
        </div>
    );

}
export default Categorizer;