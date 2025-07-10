'use client';
import Button from "@mui/material/Button"
import loginInitiateActionClient from "@/provider/session/action";
import { CircularProgress, Paper, Typography, useMediaQuery } from "@mui/material";
import { useSearchParams } from "next/navigation";
import ArrowForward from '@mui/icons-material/ArrowForward';
import LoginBackground from '@/public/login5.gif';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import SuccessImage from '@/public/success.lottie';

import Link from "next/link";
import LottieWrapper from "@/components/LottieWrapper";
import Image from "next/image";
import { useState } from "react";
import WikipediaIcon from "@/components/WikipediaIcon";
import { translationLink, useTranslation } from "@/i18n/client";
import { Trans } from "react-i18next";

const LoginComponent = ({ isMobile }: { isMobile: boolean }) => {
    const searchParams = useSearchParams()
    const next = searchParams.get('next');
    const baseURI = typeof window !== 'undefined' ? location.origin : '';
    const pathName = searchParams.get('pathName') || '/user/login';
    const [clicked, setClicked] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { t } = useTranslation()
    return (
        <Paper sx={{
            padding: 2,
            ml: 'auto',
            mr: 0,
            textAlign: 'center',
            height: '100%',
            position: 'fixed',
            right: 0,
            backgroundColor: (theme) => {
                const mode = theme.palette.mode;
                if (mode === 'dark') {
                    return isMobile ? 'rgba(0,0,0, 0.95)' : 'rgba(0,0,0, 0.9)';
                } else if (mode === 'light') {
                    return isMobile ? 'rgba(255,255,255, 0.95)' : 'rgba(255,255,255, 0.9)';
                }
            },
            width: {
                xs: '100%',
                sm: '70%',
                md: '50%',
                lg: '40%',
                xl: '40%'
            }
            // top: '50%', left: '50%',
            // transform: 'translate(-50%, -50%)'
        }}>
            <Image src='/logo.svg' alt="Logo" width={100} height={100} style={{ margin: 'auto' }} />
            <LottieWrapper src='/lottie/login-required.lottie' loop={true} />
            <Typography variant="h5" sx={{ mb: 2 }}>
                {t('login.title')}
            </Typography>
            {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{t(error.message)}</Typography>}
            <Typography variant="body1" sx={{ mb: 2 }}>
                <Trans
                    i18nKey={'settings.helpTranslation'}
                    t={t}
                    components={[<Link
                        key="1"
                        href={translationLink}
                        style={{ textDecoration: 'none', color: 'blue' }}
                        className="translation-link"
                        target="_blank"
                        rel="noopener noreferrer">{t('setting.translatewiki')}</Link>]}
                />
            </Typography>
            <Button
                onClick={() => {
                    setError(null);
                    loginInitiateActionClient(baseURI, next, pathName).catch((e) => {
                        console.error(e);
                        setClicked(false);
                        setError(e);
                    });
                    setClicked(true)
                }}
                variant="contained"
                color="primary"
                sx={{
                    mt: 2,
                    borderRadius: 10,
                    p: 1,
                    px: 2,
                    mb: 3
                }}
                disabled={clicked}
                startIcon={<WikipediaIcon />}
                endIcon={!clicked && <ArrowForward />}
            >
                {t('login.loginWithWikimedia')}
                {clicked && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>
            <Typography variant="body1" sx={{ mt: 2 }}>
                <Trans
                    i18nKey={'login.loginDisclaimer'}
                    t={t}
                    components={[
                        <Link key="terms" style={{ color: 'blue' }} href="/policy/terms">Terms of Service</Link>,
                        <Link key="privacy" style={{ color: 'blue' }} href="/policy/privacy">Privacy Policy</Link>
                    ]}
                />
            </Typography>
            {next && <><Typography variant="body2" sx={{ mt: 2 }}>
                {t('login.afterLoginRedirect')}
            </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {next}
                </Typography>
            </>}
        </Paper>
    )
}
const LoginPage = ({ }) => {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (<Paper sx={{
        backgroundImage: `url(${LoginBackground.src})`,
        backgroundSize: {
            xs: '100% auto',
            sm: '60% auto',
        },
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: 'center',
        // backgroundSize: 'cover',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        p: 0,
        m: 0,
        border: 0,
    }}>
        <LoginComponent isMobile={isMobile} />
    </Paper>
    )
}
export default LoginPage