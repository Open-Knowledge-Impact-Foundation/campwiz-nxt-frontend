"use client";
import { Button, Typography } from "@mui/material"
import { lazy, useReducer, useState } from "react";
import { campaignReducer, CampaignUpdate } from "@/types/campaign/create";
import CampaignEditForm from "@/components/campaign/CampaignEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Campaign } from "@/types";
import useSWRMutation from "swr/mutation";
import LoadingPopup from "@/components/LoadingPopup2";
import LoginBackground from "@/public/snowy-hill.svg";
import Logo from "@/components/Logo";
import SaveIcon from '@mui/icons-material/Save';
import updateCampaign from "./action";
import { useTranslation } from "@/i18n/client";
const CampaignCreationSuccess = lazy(() => import('@/app/project/[projectId]/new/success'));
const EditCampaign = ({ initialCampaign }: { initialCampaign: CampaignUpdate }) => {
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, initialCampaign);
    const { data: updatedCampaign = null, trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>(`/api/campaign/${initialCampaign.campaignId}`, updateCampaign.bind(null, campaign as CampaignUpdate), {
        onError: setError,
    });
    const { t } = useTranslation();
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
                {
                    updatedCampaign ? <CampaignCreationSuccess {...updatedCampaign} /> :
                        <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto">
                            <Logo />
                            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                                Update Campaign
                            </Typography>
                            {loading && <LoadingPopup />}
                            <CampaignEditForm {...campaign} loading={loading} dispatch={campaignDispatch} disableOnPrivate t={t} />
                            {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{error.message}</Typography>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <ReturnButton disabled={loading} sx={{ m: 0, borderRadius: 10, px: 2 }} />
                                <Button
                                    onClick={() => trigger().catch(setError)}
                                    variant="contained"
                                    color="success"
                                    disabled={loading}
                                    sx={{ borderRadius: 10 }}
                                    startIcon={<SaveIcon />}
                                    loading={loading}
                                >
                                    Update Campaign
                                </Button>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
export default EditCampaign