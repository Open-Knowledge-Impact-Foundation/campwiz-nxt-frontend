import Typography from '@mui/material/Typography'
import { useMemo } from "react"
import DateRangeIcon from '@mui/icons-material/DateRange'
import { TFunction } from 'i18next'

const MILLISECONDS_IN_A_SECOND = 1000
const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * 60
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * 24
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * 7
const MILLISECONDS_IN_A_MONTH = MILLISECONDS_IN_A_DAY * 30
const Deadline = ({ deadline, t }: { deadline: string, t: TFunction }) => {
    const [d, time] = useMemo(() => {
        const d = new Date(deadline)
        const now = new Date()
        const diff = d.getTime() - now.getTime()
        if (diff < 0) return [d, t('round.deadLinePassed')]
        const months = Math.floor(diff / MILLISECONDS_IN_A_MONTH)
        if (months > 0) return [d, t('round.deadLineInMonths', { count: months })]
        const weeks = Math.floor(diff / MILLISECONDS_IN_A_WEEK)
        if (weeks > 0) return [d, t('round.deadLineInWeeks', { count: weeks })]
        const days = Math.floor(diff / MILLISECONDS_IN_A_DAY)
        if (days > 0) return [d, t('round.deadLineInDays', { count: days })]
        const hours = Math.floor(diff / MILLISECONDS_IN_AN_HOUR)
        if (hours > 0) return [d, t('round.deadLineInHours', { count: hours })]
        const minutes = Math.floor(diff / MILLISECONDS_IN_A_MINUTE)
        if (minutes > 0) return [d, t('round.deadLineInMinutes', { count: minutes })]
        const seconds = Math.floor(diff / MILLISECONDS_IN_A_SECOND)
        return [d, t('round.deadLineInSeconds', { count: seconds })]
    }, [deadline, t])
    return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left' }}>
        <DateRangeIcon sx={{ display: 'inline-block', mr: 1, }} fontSize="large" />
        <div style={{ display: 'inline-block', }}>
            <Typography variant="h6" sx={{ mb: 0 }} component='div'>
                {t('round.deadline')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, mt: -0.5, }} component='div'>
                {d.toDateString()} <Typography variant="body1" color="textSecondary" sx={{ display: 'inline' }}>({time})</Typography>
            </Typography>
        </div>
    </div>
}
export default Deadline