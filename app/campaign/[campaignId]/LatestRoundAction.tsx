
import StopIcon from '@mui/icons-material/Pause';
import Start from '@mui/icons-material/PlayArrow';
import DoubleTickIcon from '@mui/icons-material/DoneAll';
import Link from "next/link";
import EditIcon from '@mui/icons-material/Edit';
import JudgeIcon from '@mui/icons-material/HowToVote';
import { RoundStatus } from "@/types/round/status";
import { Button, } from "@mui/material";
import { Add } from "@mui/icons-material";
import React from 'react';
import { Round } from '@/types/round';
import { Campaign } from '@/types';
import PublishIcon from '@mui/icons-material/Publish';
import SelectedRoundActionStatus from './SelectedActionStatus';
import ExportToCSVButton from './ExportButton';
import ChangeStatusButton from './ChangeStatusButton';
import DeleteButton from './DeleteButton';
import AddAsJuryButton from './AddAsJury';
import CategoryIcon from '@mui/icons-material/Category';
import { updateroundStatus } from './updateStatus';
import { useTranslation } from '@/i18n/client';

const CreateRoundButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        startIcon={<Add />}
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{ m: 1, px: 3, borderRadius: 3 }}
    >
        Create Round
    </Button>
)
const EditRoundButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        startIcon={<EditIcon />}
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{ m: 1, px: 3 }}
    >
        Edit Round
    </Button>
)

const MarkAsCompleteButton = ({ latestRound, setAction, refresh }: { latestRound: Round | null, setAction: (action: SelectedRoundActionStatus) => void, refresh: () => void }) => {
    if (!latestRound)
        return null
    if (![RoundStatus.ACTIVE, RoundStatus.PAUSED].includes(latestRound.status))
        return null

    if (latestRound.status === RoundStatus.PAUSED) // Return the mark as complete button directly
        return <ChangeStatusButton
            roundId={latestRound.roundId}
            color="success" description=""
            icon={<DoubleTickIcon />}
            label="Mark as complete"
            status={RoundStatus.COMPLETED}
            statusText="Completed"
            onClick={() => setAction(SelectedRoundActionStatus.finalizing)}
            refresh={refresh}
        />
    // otherwise, first pause the round, then mark as complete
    const markAsComplete = async (round: Round) => {
        setAction(SelectedRoundActionStatus.finalizing)
        await updateroundStatus(round.roundId, RoundStatus.COMPLETED)
        setAction(SelectedRoundActionStatus.finalizing)
        refresh()
    }
    return <ChangeStatusButton
        roundId={latestRound.roundId}
        color="success" description=""
        icon={<DoubleTickIcon />}
        label="Mark as complete"
        status={RoundStatus.PAUSED}
        statusText="paused then Completed"
        onClick={markAsComplete}
    />
}


const LatestRoundActions = ({ latestRound, setAction, isJury, judgableLink, refresh, isCoordinator, categorizerAvailable }: {
    latestRound: Round | null,
    campaign: Campaign,
    action: SelectedRoundActionStatus,
    setAction: (action: SelectedRoundActionStatus) => void, isJury: boolean, judgableLink: string,
    refresh: () => void,
    isCoordinator: boolean,
    categorizerAvailable?: boolean
}) => {
    const { t } = useTranslation();
    // if no round is avaliable, return a create round button
    const buttons: React.ReactNode[] = []
    // if (campaign.status !== RoundStatus.ACTIVE)
    //     return null
    if (latestRound && latestRound.status === RoundStatus.ACTIVE) {
        if (isJury)
            buttons.push(<Link href={judgableLink}>
                <Button
                    startIcon={<JudgeIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ m: 1, px: 3, borderRadius: 3 }}
                >
                    {t('round.evaluationArea')}
                </Button>
            </Link>)
        else if (latestRound.isPublicJury) {
            buttons.push(<AddAsJuryButton roundId={latestRound.roundId} refresh={refresh} />)
        }
        if (categorizerAvailable) {
            buttons.push(<Link href={`/campaign/${latestRound.campaignId}/categorizer`}>
                <Button
                    startIcon={<CategoryIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ m: 1, px: 3, borderRadius: 3 }}
                >
                    {t('round.categorizer')}
                </Button>
            </Link>)
        }
    }
    if (isCoordinator) {
        if (!latestRound) {
            buttons.push(<CreateRoundButton onClick={() => setAction(SelectedRoundActionStatus.creating)} />)
        } else {
            // Add mark as complete irrespective of the status being other than completed
            // status can be paused or active
            if (latestRound.status !== RoundStatus.COMPLETED && latestRound.totalSubmissions === latestRound.totalEvaluatedSubmissions) {
                buttons.push(<MarkAsCompleteButton latestRound={latestRound} setAction={setAction} refresh={refresh} />);
            }
            if (latestRound.status === RoundStatus.COMPLETED) {
                buttons.push(<ExportToCSVButton roundId={latestRound.roundId} />);
                buttons.push(<CreateRoundButton onClick={() => setAction(SelectedRoundActionStatus.creating)} />);
            } else if (latestRound.status === RoundStatus.ACTIVE) {
                buttons.push(<ChangeStatusButton
                    roundId={latestRound.roundId}
                    color="error"
                    description=""
                    icon={<StopIcon />}
                    label="Pause"
                    status={RoundStatus.PAUSED}
                    onClick={() => setAction(SelectedRoundActionStatus.finalizing)}
                    refresh={refresh}
                />);
            } else if (latestRound.status === RoundStatus.PAUSED) {
                buttons.push(<DeleteButton
                    roundId={latestRound.roundId}
                    refresh={refresh}
                />);
                if (latestRound.totalSubmissions == 0) {
                    buttons.push(
                        <Button
                            startIcon={<PublishIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => setAction(SelectedRoundActionStatus.importing)}
                            sx={{ m: 1, px: 3 }}
                        >
                            Import
                        </Button>
                    );
                }
                buttons.push(<EditRoundButton onClick={() => setAction(SelectedRoundActionStatus.editing)} />);

                buttons.push(<ChangeStatusButton
                    roundId={latestRound.roundId}
                    color="error"
                    description=""
                    icon={<Start />}
                    label="Start"
                    status={RoundStatus.ACTIVE}
                    onClick={() => setAction(SelectedRoundActionStatus.finalizing)}
                    refresh={refresh}
                />);
            }
        }
    }

    return (
        <div style={{ textAlign: 'right' }}>
            {buttons.map((button, i) => (
                <React.Fragment key={i}>
                    {button}
                </React.Fragment>
            ))}
        </div>
    )
}
export default LatestRoundActions