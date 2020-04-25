export const organizeTrackerData = (trackerData, newResponse) => {
    if (newResponse.GameID === -1 || trackerData.rawData[newResponse.GameID] !== undefined) {
        return trackerData;
    }

    const newRawData = {
        ...trackerData.rawData,
        [newResponse.GameID]: newResponse.LocalPlayerWon
    }

    const recentToOldestGames = [...Object.values(newRawData)].reverse();

    return {
        wins: newResponse.LocalPlayerWon ? trackerData.wins + 1 : trackerData.wins,
        losses:  newResponse.LocalPlayerWon ? trackerData.losses : trackerData.losses + 1,
        winStreak: getConsecutive(recentToOldestGames, true),
        lossStreak: getConsecutive(recentToOldestGames, false),
        rawData: newRawData
    }
}

const getConsecutive = (arr, predicate) => {
    const streak = arr.reduce((acc, item) => {
        if(!acc.streakBroken) {
            if(item === predicate) {
                return { ...acc, count: acc.count + 1 }
            } else {
                return { ...acc, streakBroken: true }
            }
        } else {
            return acc
        }
    }, { count: 0, streakBroken: false })

    return streak.count || 0
}