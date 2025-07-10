"use server";
import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import fetchSession from "@/server/session";
import { Campaign, WikimediaUsername } from "@/types";
import { Chip, Paper, Typography } from "@mui/material";
import RoundTimeline from "./roundTimeline";
import DateRangeIcon from '@mui/icons-material/DateRange'
import RuleIcon from '@mui/icons-material/Rule';
import EditButton from "./EditButton";
import Description from "@/components/round/Description";
import Header from "@/components/home/Header";
import ArchiveUnArchiveButton from "./ArchiveUnArchiveButton";
import Footer from "@/components/home/Footer";
import { uTranslation } from "@/i18n";
import { TFunction } from "i18next";

type CampaignViewPageProps = {
    params: Promise<{
        campaignId: string
    }>
};
const CampaignViewPage = async ({ params }: CampaignViewPageProps) => {
    const session = await fetchSession();
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
    const { t } = await uTranslation();
    if ('detail' in campaignResponse) {
        return <p>{t(campaignResponse.detail)}</p>
    }
    const campaign = campaignResponse.data;
    const isArchived = campaign.archivedAt !== null;
    const canAccessOtherProject = session && (session.permission & session.permissionMap.PermissionOtherProjectAccess) === session.permissionMap.PermissionOtherProjectAccess;
    const canUpdate = canAccessOtherProject || session?.projectId === campaign.projectId
    const canArchive = session?.projectId === campaign.projectId;
    return (
        <>
            <Header returnTo="/" />
            <Paper sx={{
                p: {
                    xs: 1,
                    sm: 2
                },
                m: 1,
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant="h4" sx={{
                        overflowWrap: 'anywhere',
                    }}>
                        {campaign.name}
                        <Typography variant="subtitle1" color="textDisabled" component='b' sx={{ display: 'inline' }}>({campaign.campaignId})</Typography>
                    </Typography>
                    <div>
                        {canArchive && <ArchiveUnArchiveButton
                            campaignId={campaign.campaignId}
                            isArchived={isArchived}
                            campaignName={campaign.name}
                        />}
                        {!isArchived && canUpdate && (
                            <EditButton campaignId={campaign.campaignId} />
                        )}

                    </div>
                </div>
                <br />
                <Description
                    description={`${new Date(campaign.startDate).toDateString()} - ${new Date(campaign.endDate).toDateString()}`}
                    label={t('campaign.duration')} Icon={DateRangeIcon}
                />
                <Description description={campaign.description} label={t('campaign.description')} />
                <Description description={campaign.rules} label={t('campaign.rules')} Icon={RuleIcon} />
                <CoordinatorList coordinators={campaign.coordinators} t={t} />
                <br />
                {/* {campaign.campaignType === CampaignType.Commons && */}
                <RoundTimeline rounds={campaign.rounds} campaign={campaign} session={session}
                    isCoordinator={campaign.coordinators?.includes(session?.username || '') === true}
                    isArchived={isArchived}
                />
                {/* } */}
            </Paper >
            <Footer />
        </>
    );
};
const CoordinatorList = ({ coordinators, t }: { coordinators: WikimediaUsername[] | null, t: TFunction }) => {
    if (!coordinators) return <Typography variant="h4">{t('error.noCoordinators')}</Typography>
    return (
        <Typography variant="h6">
            {t('campaign.coordinators')}: &nbsp;
            {coordinators.map((c, i) => (
                <Chip key={i} label={c} sx={{ m: 0.5 }} />
            ))}
        </Typography>
    )
}
export default CampaignViewPage;