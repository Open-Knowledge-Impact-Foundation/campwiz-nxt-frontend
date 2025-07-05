import { initialCampaignCreate, type CampaignCreate } from "@/types/campaign/create";
import { Autocomplete, FormControlLabel, TextField, Typography, } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import { ActionDispatch } from "react";
import UserInput from "../user/UserInput";
import CheckBox from '@mui/material/Checkbox';
dayjs.extend(utc);
const CampaignEditForm = ({ dispatch, loading, disabled = false, disableOnPrivate = false, ...campaign }: CampaignCreate & { dispatch: ActionDispatch<[Partial<CampaignCreate>]>, loading: boolean, disabled?: boolean, disableOnPrivate?: boolean }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
                label="Name"
                variant="outlined"
                sx={{ mb: 2, width: '100%' }}
                onChange={(e) => dispatch({ name: e.target.value })}
                value={campaign.name}
                disabled={loading || disabled}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexFlow: 'wrap' }}>
                <Autocomplete
                    options={[
                        'commons'
                    ]}
                    renderInput={(params) => <TextField {...params} label="WikiProject" variant="outlined" />}
                    sx={{ width: { xs: '100%', sm: '40%' }, mb: 1 }}
                    value={campaign.language}
                    onChange={(e, value) => dispatch({ language: value as string })}
                    disabled={loading || disabled}

                />
                <DatePicker
                    onChange={(date) => dispatch({ startDate: date?.toISOString() })}
                    value={dayjs(campaign.startDate)}
                    sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
                    label="Campaign Start Date"
                    disabled={loading || disabled}
                    timezone="UTC"

                />
                <DatePicker
                    onChange={(date) => dispatch({ endDate: date?.toISOString() })}
                    value={dayjs(campaign.endDate)}
                    sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
                    label="Campaign End Date"
                    disabled={loading || disabled}
                    timezone="UTC"
                />
            </div>

            <UserInput
                value={campaign.coordinators}
                onChange={(coordinators) => dispatch({ coordinators })}
                label="Coordinators"
                disabled={loading || disabled}
                sx={{ mb: 2 }}

            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <TextField
                    label="Description"
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => dispatch({ description: e.target.value })}
                    value={campaign.description}
                    multiline
                    minRows={4}
                    disabled={loading || disabled}
                />
                <TextField
                    label="Rules"
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => dispatch({ rules: e.target.value })}
                    value={campaign.rules}
                    multiline
                    minRows={4}
                    disabled={loading || disabled}
                />
            </div>
            <FormControlLabel
                control={
                    <CheckBox
                        value={campaign.isPublic}
                        onChange={(e) => dispatch({ isPublic: e.target.checked })}
                        disabled={loading || disabled}
                    />
                }
                disabled={disableOnPrivate && !initialCampaignCreate.isPublic}
                sx={{ my: 2 }}
                label={
                    <Typography variant="body1" color="textSecondary">
                        This Campaign would shown to the public (people other than coordinators, jury, project leaders)
                    </Typography>
                }
            />
        </LocalizationProvider>
    );
}
export default CampaignEditForm;
