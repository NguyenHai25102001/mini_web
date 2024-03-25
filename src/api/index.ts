export const urldt="shopchipchip.appdrbaby.com"
export const baseUrl = `https://${urldt}/`;
const revo = "https://cms.temchonggia.com/backend/";
const API = {
    loginZalo: () => baseUrl + "api/login-zalo-miniapp",
    milestones: () => baseUrl + `api/milestones/list-month`, // danh sách các tháng của cột mốc
    listMilestone: (id: any) => baseUrl + `api/milestones/list-milestone/${id}`, // chi tiết của danh sách các tháng của cột mốc
    getMilestonesInMonth: () =>
        baseUrl + "api/milestones/get-milestones-in-month",
    checkIsDoneMilestoneMonth: () =>
        baseUrl + "api/milestones/check-done-voucher",
    checkSetupMilestones: () =>
        baseUrl + "api/milestones/add-user-all-milestones",
    userProfile: () => baseUrl + "api/userProfile",
    updateMilestones: () => baseUrl + "api/milestones/update-mileston",
    getTimeDoneMileston: () =>
        baseUrl + "api/milestones/check-time-done-milestones",
    lookupRevo: () => revo + "api/product/antiCounterFeiting",
    checkPoint: () => revo + "api/pointTotal/customerPoint",
    getListGift: () => revo + "api/CustomerGifts/r1getListCustomerGifts",
    addInfoCustomer: () => revo + "api/CustomerInfoes/nonDac",
    confirmGift: () => revo + "api/PointTotal/confirmGiftNew",
    saveBrandGift: () => baseUrl + "api/brand-gift/save-gift-user",
    getHealthIndex: () => baseUrl + "api/health-index/weight-height",
    updateWeight: () => baseUrl + "api/health-index/update-weight",
    updateHeight: () => baseUrl + "api/health-index/update-height",
    getDataWHO: () => baseUrl + "api/health-index/weight-height-who",
    getDataParameters: () =>
        baseUrl + "api/milestones/get-milestones-in-month-category",
    getBlogs: (age: any, category: any, page: any) =>
        baseUrl + `api/blogs?age=${age}&category=${category}&page=${page}`,
    getDetailBlog: (id: any) => baseUrl + `api/blogs/${id}`,
    addMilestonWithMonthBaby: (id: any) =>
        baseUrl + `api/milestones/add-milestones-by-month`,
};

export default API;

export const ID_OA = "164675594818273860";
export const ID_MES = "1385282494836083";
export const LinkZaloOA = `https://zalo.me/${ID_OA}`;
export const LinkMes = `https://m.me/${ID_MES}?ref=giaphubaby`;
export const NAME_MINI_WEB = "Gia Phú Baby";


