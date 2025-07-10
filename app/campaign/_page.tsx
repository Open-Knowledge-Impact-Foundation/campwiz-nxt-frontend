"use client"
import { Campaign } from "@/types";
import { Box, MenuItem, Paper, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CList from "./campaignList";
import { RoundStatus } from "@/types/round/status";
import { useTranslation } from "@/i18n/client";
// import { useRouter } from "next/router";
type CampaignListProps = {
    initialCampaigns: Campaign[]
}

const CampaignList = ({ }: CampaignListProps) => {
    // const router = useRouter();
    // const pathname = usePathname();
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const [isClosed, setIsClosed] = useState<boolean | undefined>(searchParams.get('isClosed') === null ? undefined : searchParams.get('isClosed') == 'true');
    const [isHidden, setIsHidden] = useState<boolean | undefined>(searchParams.get('isHidden') === null ? undefined : searchParams.get('isHidden') == 'true');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
    const [limit, setLimit] = useState(searchParams.get('limit') ? parseInt(searchParams.get('limit') || '0') : 20);
    return <Paper sx={{ my: 1, p: 1, textAlign: 'center' }} elevation={0}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
            <TextField
                label={t('limit')}
                type="number"
                value={limit}
                onChange={(e) => {
                    const newLimit = e.target.value;
                    setLimit(parseInt(newLimit));
                }}
                variant="outlined"
                select
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </TextField>
            <TextField
                label="Sort Order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
                select
            >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
            </TextField>
            <TextField
                label="Status"
                value={isClosed === undefined ? 'All' : isClosed ? RoundStatus.ARCHIVED : RoundStatus.ACTIVE}
                onChange={(e) => setIsClosed(e.target.value == 'All' ? undefined : e.target.value == RoundStatus.ARCHIVED)}
                variant="outlined"
                select
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value={RoundStatus.ACTIVE}>Active</MenuItem>
                <MenuItem value={RoundStatus.ARCHIVED}>Archived</MenuItem>
            </TextField>
            <TextField
                label="Visibility"
                value={isHidden === undefined ? 'All' : isHidden ? 'private' : 'public'}
                onChange={(e) => setIsHidden(e.target.value == 'All' ? undefined : e.target.value == 'private')}
                variant="outlined"
                select
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
            </TextField>
        </Box>
        <CList campaigns={[]} isClosed={isClosed} isHidden={isHidden} limit={limit} sortOrder={sortOrder} />

    </Paper>
}
export default CampaignList;