"use client";
// import { getRawAPIPath } from "@/server";
import { Button } from "@mui/material";
import React from "react";
import DownloadIcon from '@mui/icons-material/Download';
const ExportToCSVButton = ({ roundId }: { roundId: string }) => {
    "use client"
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const exportToCSV = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/round/${roundId}/results/csv`, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Accept': 'text/csv',
                    'Access-Control-Allow-Origin': '*',
                },
                method: 'GET',
                credentials: 'include',

            })
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.download = `round - ${roundId}.csv`
            a.href = url
            a.click()
            window.URL.revokeObjectURL(url)
            if (res.ok) {
                console.log('Exported')
            } else {
                console.error('Failed to export')
            }
        } catch (e) {
            console.error(e)
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }
    return <Button
        startIcon={<DownloadIcon />}
        variant={error ? 'outlined' : 'contained'}
        color={error ? 'error' : 'success'}
        onClick={exportToCSV}
        sx={{ m: 1, px: 3 }}
        loading={loading}
        disabled={loading}

    >
        Download Results as CSV
    </Button>

}
export default ExportToCSVButton