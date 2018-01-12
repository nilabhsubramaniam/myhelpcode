/**
 * Created by Abhishek.goyan on 10/11/2016.
 */

var idToScheme = {
    "H02": "HDFC Equity Fund",
    "K46": "Kotak Gold Fund",
    "B321G": "Birla Sunlife Dynamic Bond Fund",
    "FTI273": "Franklin High Growth Companies Fund",
    "D349": "DSP Blackrock Focus 25 Fund",
    "RMFGDGPGR": "Reliance Gold Savings Fund",
    "G82": "IDFC Dynamic Bond Fund",
    "FTI304": "Franklin Asian Equity Fund",
    "P24": "ICICI Pru Short Term Fund",
    "P53PF": "ICICI Pru  Fund PF Option",
    "P1950": "ICICI Pru US Bluechip Fund",
    "PDFG": "ICICI Pru Value Discovery Fund",
    "RMFBFGPGR": "Reliance Banking Fund",
    "GMTG": "IDFC SSIF - Medium Term Fund",
    "B341G": "Birla Sunlife Short Term Opportunities Fund",
    "B92": "Birla Sunlife Frontline Equity Fund",
    "FTI038": "Franklin India Bluechip Fund",
    "D13": "DSP Blackrock TIGER Fund",
    "FTI400": "Franklin India Low Duration Fund",
    "FTI012": "Franklin India Income Builder Fund",
    "RMFLPIGGR": "Reliance Money Manager Fund",
    "D98": "DSP Blackrock Money Manager Fund",
    "G209": "IDFC Arbitarage Fund",
    "PEDIRG": "ICICI Pru Arbitarage Fund",
    "FTI034": "Franklin India Taxshield",
    "128TSGPGGR": "Axis Long Term Equity Fund",
    "RMFTSGPGR": "Reliance Tax Saver (ELSS) Fund",
    "B02G": "Birla Sunlife Tax Relief'96 Fund",
    "RMFESGPGR": "Reliance Equity Savings Fund",
    "D539": "DSP Blackrock Dynamic Asset Allocation Fund",
    "L24G": "SBI Magnum Balanced Fund",
    "HMILTG": "HDFC MIP - Long Term Plan"
};

function IsAdmin() {
    if (window.localStorage.getItem("role") == "admin") {
        return true;
    } else {
        return false;
    }
}

function IsGuest() {
    if (window.localStorage.getItem("role") == "guest") {
        return true;
    } else {
        return false;
    }
}

function getUserId() {
    if (IsAdmin()) {
        if (window.currentUesrId) {
            return window.currentUesrId;
        } else {
            return window.localStorage.getItem("userid");
        }
    } else {
        return window.localStorage.getItem("userid");
    }
}

function getFullUserName() {
    if (window.currentUserFullName) {
        return window.currentUserFullName;
    } else {
        return window.localStorage.getItem("firstname") + " " + window.localStorage.getItem("lastname");
    }
}

function validateAmount(lumpsum, sip, type) {
    var validate = true;
    if ((lumpsum == 0 && sip == 0) ||
        (sip >= 1000 && lumpsum > 0 && lumpsum < 5000) ||
        (lumpsum >= 5000 && sip > 0 && sip < 1000) ||
        (sip < 1000 && lumpsum < 5000)) {
        validate = false;
    }
    return validate;
}

function validateInvestmentCategory(lumpsum, sip) {
    var validateInvest = true;
    if (lumpsum && sip) {
        if (!((lumpsum >= 5000 && lumpsum < 10000) && (sip >= 1000 && sip < 2000) ||
            (lumpsum >= 10000 && lumpsum < 25000) && (sip >= 2000 && sip < 5000) ||
            (lumpsum >= 25000 && lumpsum < 100000) && (sip >= 5000 && sip < 20000) ||
            (lumpsum >= 100000 && lumpsum < 300000) && (sip >= 20000 && sip < 60000) ||
            (lumpsum >= 300000 && lumpsum <= 1000000) && (sip >= 60000 && sip <= 150000) )) {
            validateinvest = false;
        }
    }
    return validateInvest;
}
/*return year as 2017-18*/
function currentFinancialYear() {
    var today = new Date();
    var curMonth = today.getMonth();
    var curFiscalYr = "";
    if (curMonth > 2) {
        var nextYr1 = (today.getFullYear() + 1).toString();
        curFiscalYr = today.getFullYear().toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
    } else {
        var nextYr2 = today.getFullYear().toString();
        curFiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
    }
    return curFiscalYr;
}

/*return year as 2016-17*/
function prevFinancialYear() {
    var today = new Date();
    var curMonth = today.getMonth();
    var prevFiscalYr = "";
    var prevYear;
    if (curMonth > 2) {
        prevYear = today.getFullYear().toString();
        prevFiscalYr = (today.getFullYear() - 1).toString() + "-" + prevYear.charAt(2) + prevYear.charAt(3);
    } else {
        prevYear = (today.getFullYear() - 1).toString();
        prevFiscalYr = (today.getFullYear() - 2).toString() + "-" + prevYear.charAt(2) + prevYear.charAt(3);
    }
    return prevFiscalYr;
}

function getSchemeName(id) {
    return idToScheme[id];
}

/*return moment date which can be further formatted or converted to js date*/
function startFiscalYear() {
    var today = moment();
    /*month starts from 0, so 2 is March*/
    if (today.month() <= 2) today.subtract(1, 'years');
    /*01-Apr-YYYY*/
    return today.month(3).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
}
/*returns 01-Apr-YYYY(-1) in moment*/
function startPrevFiscalYear() {
    /*01-Apr-YYYY -1 */
    if(moment().month() > 2){
        return moment().subtract(1,'year').month('Apr').date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    } else {
        return moment().subtract(2,'year').month('Apr').date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    }
}
/*return moment date which can be further formatted or converted to js date*/
function endFiscalYear() {
    var today = moment();
    if (today.month() > 2) today.add(1, 'years');
    /*31-Mar-YYYY*/
    return today.month(2).date(31).hours(23).minutes(59).seconds(59).milliseconds(0);
}
/*returns 01-Apr-YYYY(-1) in moment*/
function endPrevFiscalYear() {
    /*31-Mar-YYYY*/
    if(moment().month() > 2){
        return moment().month('Mar').date(31).hours(23).minutes(59).seconds(59).milliseconds(0);
    } else {
        return moment().subtract(1,'year').month('Mar').date(31).hours(23).minutes(59).seconds(59).milliseconds(0);
    }
}


var getSIPStartDates = function (val,achStatus) {
    var startDate = {};
    var sipCycleStart;
    if (val === '1-10') {
        sipCycleStart = moment().date(1);
    } else if (val === '11-20') {
        sipCycleStart = moment().date(11);
    } else if (val === '21-30') {
        sipCycleStart = moment().date(21);
    }
    var diff = sipCycleStart.diff(moment(), 'days',true);
    if (achStatus) {
        if (diff >= 7) {
            startDate.firstPref = sipCycleStart;
        } else {
            startDate.firstPref = sipCycleStart.add(1,'M');
        }
    }else {
        if (diff <= 0) {
            startDate.firstPref = sipCycleStart.add(2, 'M');
        } else {
            startDate.firstPref = sipCycleStart.add(1, 'M');
        }
    }
    startDate.secondPref = moment(startDate.firstPref).add(1, 'M');
    return startDate;
};