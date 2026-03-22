var NtvConverter = (function () {
  'use strict';

  var JDATE_REF_1968 = 2439856.5;
  var JDATE_REF_LS0_MY12 = 2442765.667;
  var MY_REF = 12;
  var EARTH_DAY = 86400;
  var MARS_SOL = 88775.245;
  var MARS_YEAR_SOLS = 668.6;
  var E_ELLIP = 0.09340;
  var PERI_DAY = 485.35;
  var TIMEPERI = 1.90258341759902;
  var NTV_OFFSET = 54;
  var REF_MARSYEAR_26 = 26;
  var REF_JDATE_MY26 = 2452383.23;
  var EDAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var NTV_MONTHS = [
    { month: 1,  nameUa: 'Близнюки', nameEn: 'Gemini',      sols: 61, startSol: 1   },
    { month: 2,  nameUa: 'Рак',      nameEn: 'Cancer',       sols: 65, startSol: 62  },
    { month: 3,  nameUa: 'Лев',      nameEn: 'Leo',          sols: 66, startSol: 127 },
    { month: 4,  nameUa: 'Діва',     nameEn: 'Virgo',        sols: 65, startSol: 193 },
    { month: 5,  nameUa: 'Терези',   nameEn: 'Libra',        sols: 60, startSol: 258 },
    { month: 6,  nameUa: 'Скорпіон', nameEn: 'Scorpio',      sols: 54, startSol: 318 },
    { month: 7,  nameUa: 'Стрілець', nameEn: 'Sagittarius',  sols: 50, startSol: 372 },
    { month: 8,  nameUa: 'Козеріг',  nameEn: 'Capricorn',    sols: 47, startSol: 422 },
    { month: 9,  nameUa: 'Водолій',  nameEn: 'Aquarius',     sols: 46, startSol: 469 },
    { month: 10, nameUa: 'Риби',     nameEn: 'Pisces',       sols: 48, startSol: 515 },
    { month: 11, nameUa: 'Овен',     nameEn: 'Aries',        sols: 51, startSol: 563 },
    { month: 12, nameUa: 'Телець',   nameEn: 'Taurus',       sols: 55, startSol: 614 }
  ];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function gregorianToJulian(year, month, day) {
    var refYear = 1968;
    var days = (year - refYear) * 365;

    if (year >= refYear) {
      for (var y = refYear; y < year; y++) {
        if (isLeapYear(y)) days++;
      }
    } else {
      for (var y = year; y < refYear; y++) {
        if (isLeapYear(y)) days--;
      }
    }

    days += EDAYS[month - 1];

    if (month >= 3 && isLeapYear(year)) days++;

    days += day - 1;

    return JDATE_REF_1968 + days;
  }

  function julianToSolAndMY(jdate) {
    var sol = (jdate - JDATE_REF_LS0_MY12) * EARTH_DAY / MARS_SOL;
    var martianYear = MY_REF;

    while (sol >= MARS_YEAR_SOLS) {
      sol -= MARS_YEAR_SOLS;
      martianYear++;
    }
    while (sol < 0) {
      sol += MARS_YEAR_SOLS;
      martianYear--;
    }

    return {
      sol: Math.floor(sol) + 1,
      fractionalSol: sol,
      martianYear: martianYear
    };
  }

  function sol2Ls(sol) {
    var yearDay = 668.6;
    var periDay = PERI_DAY;
    var eEllip = E_ELLIP;
    var timeperi = TIMEPERI;
    var rad2deg = 180 / Math.PI;

    var zz = (sol - periDay) / yearDay;
    var zarone = 2 * Math.PI * (zz - Math.round(zz));
    var zdx = zarone;

    for (var i = 0; i < 20; i++) {
      var ztmp = zdx - eEllip * Math.sin(zdx) - zarone;
      zdx = zdx - ztmp / (1 - eEllip * Math.cos(zdx));
      if (Math.abs(ztmp) < 1e-7) break;
    }

    var zteta = 2 * Math.atan(Math.sqrt((1 + eEllip) / (1 - eEllip)) * Math.tan(zdx / 2));
    var ls = zteta - timeperi;

    if (ls < 0) ls += 2 * Math.PI;
    if (ls > 2 * Math.PI) ls -= 2 * Math.PI;

    return ls * rad2deg;
  }

  function ls2Sol(ls) {
    var yearDay = 668.6;
    var periDay = PERI_DAY;
    var eEllip = E_ELLIP;
    var timeperi = TIMEPERI;
    var rad2deg = 180 / Math.PI;

    var zteta = ls / rad2deg + timeperi;
    var zx0 = 2 * Math.atan(Math.tan(zteta / 2) * Math.sqrt((1 - eEllip) / (1 + eEllip)));
    var xref = zx0 - eEllip * Math.sin(zx0);

    var sol = xref / (2 * Math.PI) * yearDay + periDay;

    if (sol < 0) sol += yearDay;
    if (sol >= yearDay) sol -= yearDay;

    return sol;
  }

  function marsYearLsToJulian(marsYear, ls) {
    var solsInYear = MARS_YEAR_SOLS;
    var solLength = MARS_SOL;
    var dayLength = EARTH_DAY;

    var jdate = (marsYear - REF_MARSYEAR_26) * (solsInYear * solLength / dayLength) + REF_JDATE_MY26;

    var sol = ls2Sol(ls);

    if (sol >= solsInYear - 0.01) {
      sol += 0.01;
      sol -= solsInYear;
    }

    jdate += sol * (solLength / dayLength);

    return jdate;
  }

  function julian2Gregorian(jdate) {
    var z = Math.floor(jdate + 0.5);

    var a;
    if (z < 2299161) {
      a = z;
    } else {
      var alpha = Math.floor((z - 1867216.25) / 36524.25);
      a = z + 1 + alpha - Math.floor(alpha / 4);
    }

    var b = a + 1524;
    var c = Math.floor((b - 122.1) / 365.25);
    var d = Math.floor(365.25 * c);
    var e = Math.floor((b - d) / 30.6001);

    var day = b - d - Math.floor(30.6001 * e);
    var month = (e < 14) ? e - 1 : e - 13;
    var year = (month > 2) ? c - 4716 : c - 4715;

    return { year: year, month: month, day: day };
  }

  function solToNtvMonth(sol) {
    if (sol > 668) sol = 668;
    if (sol < 1) sol = 1;

    for (var i = NTV_MONTHS.length - 1; i >= 0; i--) {
      if (sol >= NTV_MONTHS[i].startSol) {
        var day = sol - NTV_MONTHS[i].startSol + 1;
        if (i === 11 && day > NTV_MONTHS[i].sols) day = NTV_MONTHS[i].sols;
        return {
          month: NTV_MONTHS[i].month,
          day: day,
          monthData: NTV_MONTHS[i]
        };
      }
    }

    return { month: 1, day: 1, monthData: NTV_MONTHS[0] };
  }

  function ntvMonthToSol(monthNumber, day) {
    return NTV_MONTHS[monthNumber - 1].startSol + day - 1;
  }

  function earthToNtv(year, month, day) {
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return { error: true, messageKey: 'not_numbers' };
    }
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return { error: true, messageKey: 'not_integers' };
    }
    if (year < 1583) {
      return { error: true, messageKey: 'year_too_early' };
    }
    if (month < 1 || month > 12) {
      return { error: true, messageKey: 'month_out_of_range' };
    }
    var maxDay = DAYS_IN_MONTH[month - 1];
    if (month === 2 && isLeapYear(year)) maxDay = 29;
    if (day < 1 || day > maxDay) {
      return { error: true, messageKey: 'earth_day_out_of_range', params: { max: maxDay, month: month } };
    }

    var jdate = gregorianToJulian(year, month, day);
    var result = julianToSolAndMY(jdate);
    var ntvMonth = solToNtvMonth(result.sol);
    var ntvYear = result.martianYear - NTV_OFFSET;

    var warning = null;
    if (ntvYear < 0) {
      warning = 'pre_epoch';
    }

    return {
      error: false,
      ntvYear: ntvYear,
      month: ntvMonth.month,
      monthNameUa: ntvMonth.monthData.nameUa,
      monthNameEn: ntvMonth.monthData.nameEn,
      day: ntvMonth.day,
      sol: result.sol,
      warning: warning
    };
  }

  function ntvToEarth(ntvYear, monthNumber, day) {
    if (typeof ntvYear !== 'number' || typeof monthNumber !== 'number' || typeof day !== 'number') {
      return { error: true, messageKey: 'not_numbers' };
    }
    if (!Number.isInteger(ntvYear) || !Number.isInteger(monthNumber) || !Number.isInteger(day)) {
      return { error: true, messageKey: 'not_integers' };
    }
    if (monthNumber < 1 || monthNumber > 12) {
      return { error: true, messageKey: 'month_out_of_range' };
    }
    var maxDay = NTV_MONTHS[monthNumber - 1].sols;
    if (day < 1 || day > maxDay) {
      return { error: true, messageKey: 'ntv_day_out_of_range', params: { max: maxDay, month: monthNumber, monthData: NTV_MONTHS[monthNumber - 1] } };
    }

    var clancyMY = ntvYear + NTV_OFFSET;
    var absSol = ntvMonthToSol(monthNumber, day);
    var ls = sol2Ls(absSol - 1 + 0.5);
    var jdate = marsYearLsToJulian(clancyMY, ls);
    jdate = Math.round(jdate - 0.5) + 0.5;
    var greg = julian2Gregorian(jdate);

    var warning = null;
    if (greg.year < 1583) {
      warning = 'pre_epoch';
    }

    return {
      error: false,
      year: greg.year,
      month: greg.month,
      day: greg.day,
      warning: warning
    };
  }

  return { earthToNtv: earthToNtv, ntvToEarth: ntvToEarth, getMonths: function () { return NTV_MONTHS; } };
})();
