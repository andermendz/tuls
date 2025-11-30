import ReactGA from "react-ga4";

// Access the environment variable safely
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
    } else {
        console.warn("GA_MEASUREMENT_ID is missing in .env file");
    }
};

export const logPageView = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
};

export const logEvent = (category: string, action: string, label?: string) => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.event({
            category,
            action,
            label,
        });
    }
};