'use strict';

const schedule = require('./schedule.json');
const simpleRes = tag=> ({
    get : function get(inp, cb) {
        return new Promise((cb, reject) => {
            if (tag == 'schedule.json') {
                cb(schedule);
            } else {
                cb(null);
            }
        });
    }
});
//$resource needs a get function
function scheuleCalc($resource) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HALFDAY = _MS_PER_DAY / 2;

    // a and b are javascript Date objects
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

    let res = {
        fullSchedule: null,
        scheduleStartDate: null,
        scheduleStarts: [],
        selectedSchedule: null,
        verses: [],
        curSchedule: [],
        CurWeek: {},
        CurDay: null,
        VersesInSchedule: {},
        recordedHash: {},
        allStats: {},
        readersByDate: [],
        signReqs: [],
        selectedUserId: null,
        qryDct: $resource('versesQry/:email', {email: '@email'}, {}),
        qryAll: $resource('versesQryAll', {}, {}),
        scheduleDct: $resource('schedule.json', {}, {}),
        //signListFunc : function(dta){return $http.post('/sign/list', dta);},
        AddDaysToYmd: getDay,
        dateDiffInDays728: dateDiffInDays728,
        getDateOnly: function (d) {
            if (typeof d === 'string') d = new Date(d);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
    };

    res.createScheduleStarts = function (curDate) {
        let startDate = res.scheduleStartDate;
        let daysMax = dateDiffInDays(startDate, curDate);
        let curDay = dateDiffInDays(startDate, new Date());
        let isCurrentSch = curDay < ((Math.floor(daysMax / 7 / 13) + 1) * 7 * 13);
        let days = daysMax % 728;
        let maxStart = Math.floor(daysMax / 7 / 13) * 13;
        let start = Math.floor(days / 7 / 13) * 13;

        curDay = (curDay % 728) - (start * 7);

        let scheduleStarts = [];
        for (let i = 0; i >= -1; i--) {
            let desc = getDay(startDate, (maxStart * 7) + (i * 7 * 13)) + ' - ' + getDay(startDate, (maxStart * 7) + ((i + 1) * 7 * 13));
            scheduleStarts.push({
                Desc: desc,
                ScheduleStartDay: (start * 7) + (i * 7 * 13),
                DaysPassed: (isCurrentSch && i === 0) ? (days - (start * 7) + 1) : (7 * 13),
                isCurrentSch: isCurrentSch,
                CurDay: curDay,
                CurWeek: Math.floor(curDay / 7)
            });
        }
        res.scheduleStarts = scheduleStarts;

        if (scheduleStarts.length > 0) {
            res.selectedSchedule = scheduleStarts[0];
            //res.setCurSchedule(res.selectedSchedule.ScheduleStartDay);
        }
    };

    res.setEmail = function (email, done) {
        res.getUserVerses(email, function (res) {
            res.setSchedule(res.selectedSchedule, done);
        });
    };
    res.setSchedule = function (schedule, done) {
        function doDone(xx) {
            res.signReqs = xx;
            if (schedule) res.statsByUserId(res.selectedSchedule.DaysPassed);
            if (done) done(null, res);
        }

        if (schedule !== null) {
            res.selectedSchedule = schedule;
            res.setCurSchedule(res.selectedSchedule.ScheduleStartDay);
            //res.signListFunc({ScheduleStartDay: schedule.ScheduleStartDay}).success(doDone).error(function(err){
            //    console.log(err);
            //    done(err);
            //});
            doDone();
            return;
        }

        doDone();
    };

    res.scheduleDctf = function (email, done) {
        if (res.fullSchedule === null) {
            res.scheduleDct.get().then((sch) => {
                let startDate = new Date(sch.startDate.y, sch.startDate.m, sch.startDate.d);
                res.fullSchedule = sch;
                res.scheduleStartDate = startDate;
                res.createScheduleStarts(new Date());
                res.setEmail(email, done);
            }).catch(err => {
                res.err = err;
            });
        } else {
            res.createScheduleStarts(new Date());
            res.setEmail(email, done);
        }
    };

    res.getUserVerses = function (email, done) {
        let eml = email || null;
        if (eml === null || eml.trim() === '') {
            eml = '*';
        }
        let qry = res.qryDct;
        if (eml === '*') qry = res.qryAll;
        qry.get({email: eml}).then(data => {
            res.verses = data;
            if (done) done(res);
        });
    };

    //set recordedHash (of reads and lates), allStats (for all users), and
    res.statsByUserId = function (totalVersToDate) {
        let allStats = {};
        let statsAry = [];
        let svers = res.verses;
        if (!svers) return;
        let i = 0;
        let stat = null;
        let readersByDate = {};
        let recordedHash = {};
        for (i = 0; i < svers.length; i++) {
            let v = svers[i];
            if (!v.user) v.user = {}; //stub bad data
            let vpos = res.VersesInSchedule[v.title] || null;
            if (vpos === null) {
                recordedHash[v.title] = {};
                recordedHash[v.title][v.user._id] = {valid: false, cls: '', tip: null};
                continue;
            }
            v.vpos = vpos;
            let diffDays = dateDiffInDays728(res.scheduleStartDate, new Date(v.dateRead));
            let dayOnly = getDateInt(v.dateRead);
            let rbd = readersByDate[dayOnly] || {date: res.getDateOnly(v.dateRead), vcount: 0, pcount: 0, uids: {}};
            rbd.vcount++;
            if ((rbd.uids[v.user._id] || null) === null) {
                rbd.uids[v.user._id] = 1;
                rbd.pcount++;
            } else
                rbd.uids[v.user._id] = rbd.uids[v.user._id] + 1;
            readersByDate[dayOnly] = rbd;
            v.vpos.readPos = diffDays;
            v.vpos.diff = diffDays - vpos.pos;
            stat = allStats[v.user._id] || null;
            if (stat === null) {
                stat = {
                    userId: v.user._id,
                    displayName: v.user.displayName || null,
                    email: v.user.email,
                    read: 1,
                    totalToDate: totalVersToDate,
                    lates: 0,
                    latesByDay: {},
                    dups: {}
                };
                stat.dups[v.title] = 1;
                if (stat.displayName === null || stat.displayName.trim() === '') {
                    stat.displayName = stat.email || '*********';
                }
                allStats[v.user._id] = stat;
                statsAry.push(stat);
            } else if (!stat.dups[v.title]) {
                stat.dups[v.title] = 1;
                stat.read++;
            }
            if ((recordedHash[v.title] || null) === null) recordedHash[v.title] = {};
            let dayDsp = res.AddDaysToYmd(new Date(v.dateRead), 0);
            if (v.vpos.diff > 0) {
                stat.latesByDay[v.vpos.diff] = (stat.latesByDay[v.vpos.diff] || 0) + 1;
                stat.lates++;
                recordedHash[v.title][v.user._id] = {
                    valid: true,
                    late: v.vpos.diff,
                    cls: 'late',
                    tip: 'late for ' + v.vpos.diff + ' days',
                    dateRead: dayDsp
                };
            } else
                recordedHash[v.title][v.user._id] = {
                    valid: true,
                    late: 0,
                    cls: 'green',
                    tip: 'Completed on ' + v.dateRead,
                    dateRead: dayDsp
                };
        }

        res.recordedHash = recordedHash;
        statsAry.sort(function (a, b) {
            return b.read - a.read;
        });
        let signMap = {};
        if (res.signReqs) {
            for (i = 0; i < res.signReqs.length; i++) {
                let sReqI = res.signReqs[i];
                if (sReqI.user) signMap[sReqI.user._id] = sReqI;
            }
        }
        for (i = 0; i < statsAry.length; i++) {
            stat = statsAry[i];
            if (stat.totalToDate !== 0)
                stat.completePct = Math.round(stat.read * 100 / stat.totalToDate);
            let signReq = signMap[stat.userId];
            if (signReq) {
                stat.signStatus = 'Requested';
                if (signReq.SignedBy) {
                    stat.signStatus = 'Signed';
                    let whoSigned = signReq.SignedBy.displayName || signReq.SignedBy.email;
                    if (whoSigned) stat.signStatus = 'Signed by ' + whoSigned;
                }
            }
        }
        res.allStats = statsAry;
        if (statsAry.length > 0) {
            res.selectedUserId = statsAry[0].userId;
        }
        let readersByDateAry = [];
        for (let rday in readersByDate) readersByDateAry.push(readersByDate[rday]);
        readersByDateAry.sort(function (a, b) {
            return a.date > b.date;
        });
        res.readersByDate = readersByDateAry;
    };

    res.setCurSchedule = function (scheduleStartDay) {
        let start = Math.floor(scheduleStartDay / 7 / 13) * 13;
        let VersesInSchedule = {};
        let curSchedule = [];
        let selSch = res.selectedSchedule;
        let sch = res.fullSchedule.schedule;
        let today = new Date();
        for (let i = 0; i < 13; i++) {
            let schLine = sch[start + i];
            let isCurWeek = selSch.isCurrentSch && (selSch.CurWeek === i);
            if (isCurWeek) {
                res.CurWeekMap = {};
                res.CurWeekAry = schLine.slice(1);
            }
            for (let j = 1; j < schLine.length; j++) {
                let title = schLine[j];
                if (isCurWeek) res.CurWeekMap[title] = getDay(today, j - (selSch.CurDay % 7) - 1);
                if (isCurWeek && (j === (selSch.CurDay % 7) + 1)) res.CurDay = title;
                VersesInSchedule[title] = res.fullSchedule.verses[title];
            }
            curSchedule.push(schLine);
        }
        res.curSchedule = curSchedule;
        res.VersesInSchedule = VersesInSchedule;
    };
    return res;
}


module.exports= {
    simpleRes,
    scheuleCalc,
    res: scheuleCalc(simpleRes)
};