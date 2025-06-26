"use client"

import fetchAPIFromBackendSingleWithErrorHandling from "@/server"
import { Campaign } from "@/types"
import useSWR from "swr"
import SingleCampaignChip from "./SingleCampaignChip"
import { Box, Skeleton, Typography } from "@mui/material"
import PerCampaignBackground from "@/public/campaign5.svg"
import LoadMoreCampaignChip from "./LoadMoreCampaign"
import { useTranslation } from "@/i18n/client"

type AssignedCampaignProps = {
    limit: number
}
const AssignedCampaigns = ({ limit }: AssignedCampaignProps) => {
    const qs = new URLSearchParams({ limit: String(limit), isClosed: 'false', isHidden: 'true', sortOrder: 'desc' }).toString()
    const showAllQs = new URLSearchParams({ limit: String(20), isClosed: 'false', isHidden: 'true' }).toString()
    const { t } = useTranslation()
    const { data: assignedCampaignResponse, error, isLoading } = useSWR('/campaign/?' + qs.toString(), fetchAPIFromBackendSingleWithErrorHandling<Campaign[]>);
    if (isLoading) return <Skeleton variant="rectangular" width='100%' height={200} />
    if (error) return <p>Error : {error.message}</p>
    if (!assignedCampaignResponse)
        return null;
    if ('detail' in assignedCampaignResponse)
        return <p>Error : {error}</p>
    return <div className="" style={{
    }}>
        <Typography variant="h4" sx={{
            textAlign: 'center', m: 3,
            // backgroundImage: 'linear-gradient(to right, red 20%,  blue 80%)',
            // color: 'transparent',
            backgroundClip: 'text'
        }} color="error">
            {t('home.yourCampaigns')}
        </Typography>
        <Box sx={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', px: 2,
            backgroundImage: `url(${PerCampaignBackground.src})`,
            backgroundSize: 'contain',
        }} className="justify-self-auto">
            {assignedCampaignResponse ? <>
                {(assignedCampaignResponse.data || []).map((v, i) => (
                    <SingleCampaignChip campaign={v} key={i} />
                ))}
                <LoadMoreCampaignChip link={"/campaign?" + showAllQs.toString()} labelText={t('campaign.showAllCampaigns')} />
            </> : <div>
                <p>{t('error.noAssignedCampaigns')}</p>
            </div>}
        </Box>
    </div>
}
export default AssignedCampaigns