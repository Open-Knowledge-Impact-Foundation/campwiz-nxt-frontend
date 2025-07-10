"use client";
import EditIcon from '@mui/icons-material/Edit';
import NokiberButton from "@/components/NokiberButton";
import { useTranslation } from '@/i18n/client';


const EditButton = ({ campaignId }: { campaignId: string }) => {
    const { t } = useTranslation();
    return (
        <NokiberButton
            label={t('campaign.edit')}
            link={`/campaign/${campaignId}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
        />
    );
}
export default EditButton;