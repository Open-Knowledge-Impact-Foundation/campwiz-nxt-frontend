"use client";
import { Button, CircularProgress, Typography } from "@mui/material"
import createCampaign from "@/app/project/[projectId]/new/action"
import { lazy, useReducer, useState } from "react";
import { campaignReducer, initialCampaignCreate } from "@/types/campaign/create";
import CampaignEditForm from "@/components/campaign/CampaignEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Campaign } from "@/types";
import useSWRMutation from "swr/mutation";
import LoadingPopup from "@/components/LoadingPopup";
import AddIcon from '@mui/icons-material/Add';
import LoginBackground from "@/public/snowy-hill.svg";
import Logo from "@/components/Logo";
import { useTranslation } from "@/i18n/client";
const CampaignCreationSuccess = lazy(() => import('@/app/project/[projectId]/new/success'));

const CreateCampaign_ = ({ projectLeads, projectId }: { projectLeads: string[], projectId: string }) => {
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, { ...initialCampaignCreate, coordinators: projectLeads, projectId });
    const { data: createdCampaign = null, trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>('/api/campaign', createCampaign.bind(null, campaign), {
        onError: setError,
    });
    const { t } = useTranslation()
    return (
        <div style={{
            // position: 'absolute', 
            display: 'flex',
            width: '100%', height: '100%',
            justifyContent: 'center', alignItems: 'center',
            backgroundImage: `url(${LoginBackground.src})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: 'cover',
        }}>
            <div
                style={{
                    // position: 'absolute', 
                    width: '100%', display: 'flex', height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {createdCampaign ? <CampaignCreationSuccess {...createdCampaign} /> :
                    <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[rgba(248,246,246,0.8)] dark:bg-[#2c2c2c] m-auto">
                        <Logo />
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                            {t('campaign.createCampaign')}
                        </Typography>
                        {loading && <LoadingPopup src="/lottie/creating.lottie" />}
                        <CampaignEditForm {...campaign} loading={loading} dispatch={campaignDispatch} t={t} />
                        {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{t(error.message)}</Typography>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <ReturnButton disabled={loading} sx={{ m: 0, borderRadius: 10, px: 2 }} />
                            <Button
                                onClick={() => trigger().catch(setError)}
                                variant="contained"
                                color="success"
                                disabled={loading}
                                sx={{ borderRadius: 10 }}
                                startIcon={<AddIcon />}
                            >
                                <CircularProgress size={24} color="inherit" sx={{ display: loading ? 'inline-block' : 'none', mr: 1 }} />
                                {t('campaign.createCampaign')}
                            </Button>
                        </div>
                    </div>}
            </div>
        </div>
    )
}
export default CreateCampaign_