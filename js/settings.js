var UrlList = {
    user_register: "/users/register",
    user_login: "/users/login",
    password_forgot: "/users/forgot",
    password_reset:"/users/reset",
    verify_otp: "/users/verifyOTP",
    resend_otp: "/users/resendOTP",
    basics: "/basics",
    personal: "/personals",
    ifsc: '/masters/ifsc',
    bank: "/banks",
    billdeskbank: "/masters/bdbanks",
    nominee: "/nominees",
    riskProfileQuestion: "/riskprofqs",
    riskProfileAnswer: "/riskprofs",
    finHealthQuestion: "/finhealthqs",
    finHealthAnswer: "/finhealths",
    create_goal: "/goals",
    create_goal_admin: "/admin/goals",
    kycFatca: "/kyc_fatca",
    engagement: "/engagements",
    riskProfileResult: "/riskprofs",
    healthProfileResult: "/finhealths",
    file_upload: "/file_upload",
    docs: "/docs",
    users: "/users",
    reverseFeed:"/reverse_feed",
    finalForm: "/finalForm",
    serviceRequest:"/serviceReqs",
    deleteProfile:"/admin/users",
    pg:"/payments",
    service:"/services",
    userQuery:"/userquerys",
    fintaxopt:"/fintaxopts",
    portfolio:"/portfolios",
    goalStatus:"/admin/goalstatus",
    fundStatus:"/admin/fundstatus",
    goalFunds:"/admin/goalfunds",
    fintaxfiling:"/fintaxfilings",
    fintaxbank:"/fintaxbanks",
    fintaxpersonal:"/fintaxpersonals",
    fintaxbasic:"/fintaxbasics",
    report:"/reversefeed/report",
    camsTrxn:"/reversefeed/camsTrxn",
    karvyTrxn:"/reversefeed/karvyTrxn",
    franklinTrxn:"/reversefeed/franklinTrxn",
    finGps:"/fingps"
};

window.link = {};

for (key in UrlList) {
    window.link[key] = BASE_URL + UrlList[key];
}

var StorageList = {
    occupation: "/storage/occupation.json",
    tax_status: "/storage/tax-status.json",
    account_type: "/storage/account-type.json",
    income: "/storage/income.json",
    pep: "/storage/pep.json",
    wealth_src: "/storage/sourceOfWealth.json",
    tax_payer_identityno: "/storage/identificationType.json",
    countries: "/storage/countries.json",
    fundnamelist:"/storage/schemeallocation.json",
    userstatus:"/storage/user-status.json",
    fincarts:"/storage/fincart.json",
    finhealth:"/storage/finhealth.json",
    goalType:"/storage/goalType.json",
    incomeInfo:"/storage/incomeInfo.json",
    otherIncomeSource:"/storage/otherIncomeSource.json",
    investmentType:"/storage/investmentType.json",
    instruments:"/storage/instruments.json",
    employmentBenefit:"/storage/employmentBenefits.json",
    loanType:"/storage/loanType.json",
    policyType:"/storage/policyType.json"
};

window.StorageURL = {};

for (key in StorageList) {
    window.StorageURL[key] = FRONTEND_URL + StorageList[key];
}