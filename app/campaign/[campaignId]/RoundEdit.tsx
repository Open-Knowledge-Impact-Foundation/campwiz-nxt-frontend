"use client";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { updateRound } from "@/app/campaign/[campaignId]/round/new/action"
import React, { lazy, useCallback, useMemo, useReducer, useState } from "react";
import { roundCreateReducer } from "@/types/round/create";
import { Round } from "@/types/round";
import LoadingPopup from "@/components/LoadingPopup";
const RoundEditForm = lazy(() => import("@/components/round/RoundEditForm"));
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DistributionDialog from "./round/distribute/DistributionWidget";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown, typeof Slide>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
enum Stage {
    EDIT = 'edit',
    DISTRIBUTE = 'distribute',
    DISTRIBUTING = 'distributing',
    SUCCESS = 'success'
}
const EditDialog = ({ campaignId, onClose, existingRound, setUpdatedRound, setStage }: { campaignId: string, onClose: () => void, existingRound: Round, setUpdatedRound: (round: Round) => void, setStage: (stage: Stage) => void }) => {
    const [round, roundDispatch] = useReducer(roundCreateReducer, { ...existingRound, jury: Object.values(existingRound?.jury || {}), campaignId });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Detect whether the jury has changed
    // const needRedistribution = useMemo(() => {
    //     // public jury does not need redistribution
    //     if (round.isPublicJury) {
    //         return false;
    //     }
    //     if (existingRound.quorum !== round.quorum) {
    //         return true;
    //     }
    //     const existingJury = new Set(Object.values(existingRound.jury || {}))
    //     if (round.jury.length !== existingJury.size) {
    //         return true;
    //     }
    //     const newJury = new Set(round.jury || [])
    //     const intersection = existingJury.intersection(newJury);
    //     return intersection.size !== existingJury.size;
    // }, [existingRound.jury, existingRound.quorum, round.isPublicJury, round.jury, round.quorum]);
    // console.log('needRedistribution', needRedistribution)
    const updateRoundClient = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);
            const updatedRoundResponse = await updateRound(existingRound.roundId, round);
            if (!updatedRoundResponse) {
                throw new Error('Round creation failed');
            }
            if ('detail' in updatedRoundResponse) {
                throw new Error(updatedRoundResponse.detail);
            }
            const updatedRound = updatedRoundResponse.data as Round;
            setUpdatedRound(updatedRound);
        } catch (e) {
            console.error(e);
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [existingRound.roundId, round, setStage, setUpdatedRound]);
    return (<Dialog open={true}
        sx={{
            width: {
                xs: '100%',
                sm: '80%',
            },
            margin: 'auto',
            '& .MuiDialog-paper': {
                width: '100%',
                maxWidth: '100%',
            }
        }}


        slots={{
            transition: Transition
        }} onClose={onClose}>
        <DialogTitle sx={{ textAlign: 'center' }} component="h2" variant="h4">
            Update Round
        </DialogTitle>
        <DialogContent>
            {error && <Typography variant="h6" color="error" sx={{ m: 2, textAlign: 'center' }}>{error}</Typography>}
            {loading && <LoadingPopup src="/lottie/loading.lottie" />}
            <RoundEditForm {...round} loading={loading} dispatch={roundDispatch} hideAdvanced />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>
                Cancel
            </Button>
            <Button
                onClick={updateRoundClient}
                variant="contained"
                color="success"
                disabled={loading}
            >
                <CircularProgress size={24} color="inherit" sx={{ display: loading ? 'inline-block' : 'none', mr: 1 }} />
                Update Round
            </Button>
        </DialogActions>
    </Dialog>)
}
const EditRound = ({ campaignId, onClose, existingRound }: { campaignId: string, onAfterCreationSuccess: (round: Round) => void, onClose: () => void, existingRound: Round }) => {
    const [stage, setStage] = useState<Stage>(Stage.EDIT);

    const [updatedRound, setUpdatedRound] = useState<Round | null>(null);

    return (stage === Stage.EDIT ? <EditDialog
        campaignId={campaignId}
        onClose={onClose}
        existingRound={existingRound}
        setUpdatedRound={setUpdatedRound}
        setStage={setStage}
    /> : stage === Stage.DISTRIBUTE ? <DistributionDialog
        roundId={updatedRound?.roundId || ''}
        juries={Object.values(updatedRound?.jury || {})}
        afterDistribution={() => {
            // setTaskId(t.taskId);
            // setStage(Stage.DISTRIBUTING);
            setStage(Stage.SUCCESS);
        }}
        onClose={onClose}
    /> : stage === Stage.SUCCESS ? <Dialog open={true}
        sx={{
            width: {
                xs: '100%',
                sm: '80%',
            },
            margin: 'auto',
            '& .MuiDialog-paper': {
                width: '100%',
                maxWidth: '100%',
            }
        }}
        onClose={onClose}>
        <DialogTitle sx={{ textAlign: 'center' }} component="h2" variant="h4">
            Round Updated
        </DialogTitle>
        <DialogContent>
            <Typography variant="h6" sx={{ m: 2, textAlign: 'center' }}>Round has been successfully updated</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button onClick={onClose} variant="contained" color="success">
                Close
            </Button>
        </DialogActions>
    </Dialog>
        : null
    )
}

export default EditRound