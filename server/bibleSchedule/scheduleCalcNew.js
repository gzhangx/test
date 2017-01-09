'use strict';


function schedule() {
    const schedule = require('./schedule.json');
    this.schedule = schedule;
    const startDate = new Date(schedule.startDate.y, schedule.startDate.m, schedule.startDate.d);
    this.initialStartDate = startDate;
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HALFDAY = _MS_PER_DAY / 2;
    //a and b are date object
    function dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 + _MS_PER_HALFDAY - utc1) / _MS_PER_DAY);
    }

    function dateDiffInDays728(a, b) {
        // Discard the time and time-zone information.
        let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return ((utc2 - utc1) / _MS_PER_DAY) % 728;
    }

    function yyyyMMdd(dt) {
        let yyyy = dt.getFullYear().toString();
        let mm = (dt.getMonth() + 1).toString(); // getMonth() is zero-based
        let dd = dt.getDate().toString();
        return yyyy + '/' + (mm[1] ? mm : '0' + mm[0]) + '/' + (dd[1] ? dd : '0' + dd[0]); // padding
    }

    function getDay(a, days) {
        let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        let dt = new Date(utc1 + (days * _MS_PER_DAY) + _MS_PER_HALFDAY);
        return yyyyMMdd(dt);
    }

    function getDateInt(d) {
        if (typeof d === 'string') d = new Date(d);
        return (d.getFullYear() * 100) + (d.getMonth() * 10) + d.getDate();
    }

    function getScheduleInfo(curDate, which = 0) {
        const daysMax = dateDiffInDays(startDate, curDate);
        const days = daysMax % 728;
        const maxStart = Math.floor(daysMax / 7 / 13) * 13;
        const start = Math.floor(days / 7 / 13) * 13;

        const curDay = (daysMax % 728) - (start * 7);

        const desc = getDay(startDate, (maxStart * 7) + (which * 7 * 13)) + ' - ' + getDay(startDate, (maxStart * 7) + ((which + 1) * 7 * 13));
        return {
            Desc: desc,
            ScheduleStartDay: (start * 7) + (which * 7 * 13),
            CurDate: curDate,
            CurDay: curDay,
            CurWeek: Math.floor(curDay / 7)
        };
    }

    function getSchedule(selSch) {
        const start = Math.floor(selSch.ScheduleStartDay / 7 / 13) * 13;
        const curScheduleBlk = schedule.schedule.slice(start + 1, start + 1 + 13).map(a=>a.slice(1));
        const curDay = selSch.CurDay %7;
        const curWeek = selSch.CurWeek;
        return {
            schedule : curScheduleBlk,
            curWeek,
            curDay,
            curWeekView: curScheduleBlk[curWeek].map((verse,idx)=>({ verse, date: getDay(selSch.CurDate, idx - curDay), isToday: curDay == idx }))
        };
    }

    this.getScheduleInfo = getScheduleInfo;
    this.getSchedule = getSchedule;
    this.getScheduleByOffset = (curDate,which)=> getSchedule(getScheduleInfo(curDate, which));
}


module.exports= {
    schedule : new schedule()
};