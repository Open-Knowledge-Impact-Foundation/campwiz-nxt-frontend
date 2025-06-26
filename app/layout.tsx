import type { Metadata } from "next";
import * as Sentry from "@sentry/nextjs";
import "./globals.css";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { CssBaseline, Paper } from "@mui/material";
import { Roboto, } from 'next/font/google';
import { uTranslation } from "@/i18n";

// import rtlPlugin from '@mui/stylis-plugin-rtl';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});
export function generateMetadata(): Metadata {
  return {
    title: "CampWiz nxt",
    description: "A powerful tool for organizing campaigns on Wikimedia projects",
    applicationName: "CampWiz",
    icons: {
      icon: "/favicon.ico",
    },
    authors: [
      {
        name: "Nokib Sarkar",
        url: "https://github.com/nokibsarkar",
      },
      {
        name: "Mst. Rukaiya Islam Tonni",
        url: "https://github.com/Tonni28",
      },
      {
        name: "Tiven Gonsalves",
        url: "https://github.com/Tiven2240",

      }
    ],
    other: {
      ...Sentry.getTraceData(),
    },
  };
}
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { i18n } = await uTranslation();
  const language = i18n.language;
  return (
    <html suppressHydrationWarning dir={i18n.dir(language)}>
      <AppRouterCacheProvider
        options={{ key: 'css', }}
      >
        <ThemeProvider theme={theme} defaultMode="light">
          <CssBaseline />
          <Paper component='body' className={`h-full w-full p-0 m-0 overflow-auto ${roboto.className}`} sx={{ m: 0, p: 0, height: '100%', width: '100%', position: 'absolute' }} elevation={0}>
            <InitColorSchemeScript attribute="class" />
            {children}
          </Paper>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
