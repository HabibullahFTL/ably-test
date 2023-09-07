
const cookies = require('cookies-next');
const getMaxAgeInDays = (maxAge) => maxAge * 24 * 60 * 60;

// Cookie setter
export const setCookie = (
    key,
    value,
    expires,
    serverReqRes
) => {
    // Converting Max Age in days
    const maxAge = getMaxAgeInDays(Number.isNaN(expires) ? 30 : expires);
    const finalReqRes = serverReqRes ? serverReqRes : {};

    cookies.setCookie(key, value, {
        ...finalReqRes,
        maxAge,
    });
};

// Cookie getter
export const getCookie = (key, serverReqRes) => {
    const finalReqRes = serverReqRes ? serverReqRes : {};
    return cookies.getCookie(key, { ...finalReqRes }) || '';
};

// Cookie delete
export const deleteCookie = (key, serverReqRes) => {
    const finalReqRes = serverReqRes ? serverReqRes : {};
    cookies.deleteCookie(key, { ...finalReqRes }) || '';
};


export const parseCookieString = (cookieString) => {
    if (cookieString && typeof cookieString === 'string') {
        const cookiesArray = cookieString?.split(';');

        // Create an object to store the parsed cookies
        const parsedCookies = {};

        // Iterate through each cookie and extract the key-value pairs
        for (const cookie of cookiesArray) {
            const [key, value] = cookie.trim().split('=');
            parsedCookies[key] = decodeURIComponent(value);
        }
        return parsedCookies;
    } else {
        return {};
    }
};