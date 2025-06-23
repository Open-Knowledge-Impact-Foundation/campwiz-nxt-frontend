await(async function () {
    const campaignID = 'c2gmo95m5p7nk'
    const url = 'https://campwiz-backend.toolforge.org/api/v2/campaign/' + campaignID + '?includeRounds=true&includeRoundRoles=true&includeRoles=true'
    const res = await fetch(url, {
        credentials: 'include',
    })
    const data = await res.json()
    const { data: { rounds } } = data
    const lastRound = rounds.pop()
    const { jury, roles } = lastRound
    var p = ''
    for (const v of roles.toSorted((a, b) => b.totalEvaluated - a.totalEvaluated)) {
        const { userId, totalEvaluated, totalAssigned } = v
        const username = jury[userId]
        p += `${username} - ${(100 * totalEvaluated / totalAssigned).toFixed(1)}% completed\n${totalEvaluated} out ${totalAssigned}, ${totalAssigned - totalEvaluated} remaining\n\n`
    }
    console.log(p)
})()