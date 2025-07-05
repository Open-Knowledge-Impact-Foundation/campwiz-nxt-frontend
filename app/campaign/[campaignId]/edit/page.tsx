import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { Campaign } from "@/types";
import EditCampaign from "./_page";
import fetchSession from "@/server/session";
import { CampaignUpdate } from "@/types/campaign/create";

const UpdateCampaign = async ({ params }: { params: Promise<{ campaignId: string }> }) => {
    const session = await fetchSession();
    if (!session) {
        return <div>Not logged in</div>
    }
    const { permissionMap: { PermissionOtherProjectAccess, }, projectId, permission } = session;
    const { campaignId } = await params;
    const isAdmin = (PermissionOtherProjectAccess & permission) === PermissionOtherProjectAccess;
    const campaignResponse = await fetchAPIFromBackendSingleWithErrorHandling<Campaign>(`/campaign/${campaignId}?includeRoles=true`);
    if ('detail' in campaignResponse) {
        return <div>{campaignResponse.detail}</div>
    }
    const campaign = campaignResponse.data;
    const hasCampaignEditAccess = campaign.projectId === projectId //&& (PermissionUpdateCampaignDetails & permission) === PermissionUpdateCampaignDetails;
    if (!isAdmin && !hasCampaignEditAccess) {
        return <div>Either Admin or Project Lead can edit this campaign</div>
    }
    const initialCampaign: CampaignUpdate = {
        ...campaign,
        coordinators: campaign.coordinators || []
    }
    return (
        <>
            <EditCampaign initialCampaign={initialCampaign} />
        </>
    )
}
export default UpdateCampaign