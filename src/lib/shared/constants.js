const { VITE_DEFAULT_SYSTEM_ID, VITE_DEFAULT_SYSTEM_POOL_ID, VITE_ADMIN_USER_MAIL, VITE_LOGIN_MSG } = import.meta.env;

export const KICD_DATABASE_ID = "kicd";
export const RULES_COLLECTION_ID = "rules";
export const SYSTEMS_COLLECTION_ID = "systems";
export const RISKS_COLLECTION_ID = "risks";
export const MODULES_COLLECTION_ID = "modules";
export const RISKPOOL_COLLECTION_ID = "riskpool";
export const RISKPOOL_SYSTEM_ID = 1000;

export const PROP_SYSTEMID = "systemId";
export const DEFAULT_SYSTEM_ID = parseInt( VITE_DEFAULT_SYSTEM_ID );
export const DEFAULT_SYSTEM_POOL_ID = parseInt( VITE_DEFAULT_SYSTEM_POOL_ID );
export const ADMIN_USER_MAIL = VITE_ADMIN_USER_MAIL;
export const LOGIN_MSG = VITE_LOGIN_MSG;

export const MODAL_PROPS = {
    modal: true,
    maximizable: true,
    style: {
        width: '65vw',
        height: '65vw',
    },
    breakpoints: {
        '960px': '85vw',
        '640px': '90vw'
    }
};

export const MODAL2_PROPS = {
    modal: true,
    maximizable: false,
    style: {
        width: '45vw',
        height: '45vw',
    },
    breakpoints: {
        '960px': '75vw',
        '640px': '80vw'
    }
};
