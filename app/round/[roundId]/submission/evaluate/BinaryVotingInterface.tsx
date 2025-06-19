import React, { createRef, useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import CrossIcon from '@/public/cross.svg';
import CrossOutlinedICON from '@/public/cross-outlined.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from "next/image";
import Button from '@mui/material/Button'
import type { VotingInterfaceProps } from './VotingInterface';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from '@/i18n/client';
const BinaryVotingInterface = ({ goNext, goPrevious, submitScore, onSkip, saving, evaluation, noPrevious = false, noNext = false, assignmnetCount, evaluationCount, showProgress }: VotingInterfaceProps) => {
    const [currentScore, setCurrentScore] = React.useState<number | null>(evaluation.score)
    useEffect(() => {
        setCurrentScore(evaluation.score)
    }, [evaluation]);
    const skipButton = createRef<HTMLButtonElement>();
    const LikeButton = createRef<HTMLButtonElement>();
    const DislikeButton = createRef<HTMLButtonElement>();
    const previousButton = createRef<HTMLButtonElement>();
    const OkIcon = currentScore === 100 ? CheckCircleIcon : CheckCircleOutlineIcon;
    const { t } = useTranslation()
    return (
        <>
            {/* <Typography variant="h4" sx={{ fontFamily: 'Lora, serif', color: 'primary.main', textAlign: 'left', m: 1, display: 'block', width: '100%', fontSize: { xs: 24, }, fontWeight: 'bold' }}>
                Vote
            </Typography> */}
            <div className="flex justify-around items-center " onKeyUp={(e) => {
                if (e.key === 'ArrowUp') {
                    LikeButton.current?.click()
                } else if (e.key === 'ArrowDown') {
                    DislikeButton.current?.click()
                } else if (e.key === 'ArrowLeft') {
                    previousButton.current?.click()
                } else if (e.key === 'ArrowRight') {
                    skipButton.current?.click()
                }
            }}
                tabIndex={0}
            >

                <IconButton color="primary" size="large" onClick={goPrevious} disabled={saving || noPrevious} loading={saving} sx={{ fontSize: 5 }} title={t('previous')}
                    ref={previousButton}>
                    <SkipPreviousIcon fontSize='large' sx={{ fontSize: 50 }} />
                </IconButton>
                <IconButton color="primary" size="large" onClick={() => { setCurrentScore(0); submitScore(0); }} disabled={saving} loading={saving} sx={{ fontSize: 5 }} title={t('evaluation.no')}
                    ref={DislikeButton}>
                    <Image src={currentScore === 0 ? CrossIcon.src : CrossOutlinedICON.src} alt="no" width={50} height={50} />
                </IconButton>
                <IconButton color="primary" size="large" onClick={() => { setCurrentScore(100); submitScore(100); }} disabled={saving} loading={saving} sx={{ fontSize: 5 }} title={t('evaluation.yes')}
                    ref={LikeButton}>
                    <OkIcon sx={{ fontSize: 45, color: 'green' }} />
                </IconButton>
                <Button
                    color="primary"
                    size="large"
                    variant='outlined'
                    onClick={() => {
                        if (onSkip) {
                            onSkip();
                        }
                        goNext()

                    }} disabled={saving || noNext}
                    ref={skipButton}
                    loading={saving} sx={{ fontSize: 20, px: 2, mx: 1, borderRadius: 4 }}
                    title={t('evaluation.skip')}

                    endIcon={null}>
                    {t('evaluation.skip')}
                    <SkipNextIcon fontSize='large' sx={{ fontSize: 40 }} />
                </Button>
            </div>
            {showProgress &&
                <Typography variant="subtitle1" sx={{ fontFamily: 'Lora, serif', textAlign: 'right', m: 1, display: 'block', width: '100%', px: 2 }}>
                    {evaluationCount} out of {assignmnetCount} completed
                    <br />
                    <Link href={`/round/${evaluation.roundId}/submission/evaluated`} className='text-blue-500 hover:underline'>
                        {t('evaluation.edit')}
                    </Link>
                </Typography>
            }
        </>
    )
}
export default BinaryVotingInterface