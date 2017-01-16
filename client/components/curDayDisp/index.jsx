import React from 'react';
function verseCell(i, j, schedule) {
    const scheduleData = schedule.schedule[i][j];
    if (i == schedule.curWeek && j == schedule.curDay) {
        return <span style={{'fontWeight':'bold'}}>{scheduleData}</span>;
    }
    return <span>{scheduleData}</span>;
}

module.exports = verseCell;