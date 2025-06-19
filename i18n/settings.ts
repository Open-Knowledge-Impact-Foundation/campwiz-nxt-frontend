export const fallbackLng = 'en'
export const languages = [fallbackLng, 'bn', 'hi', 'ar', 'kn', 'fr', 'it', 'mk', 'pms', 'ps', 'ru', 'skr-arab']
export const defaultNS = 'translation'
export const cookieName = 'i18next'

export default function getOptions(lng = fallbackLng, ns = defaultNS) {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns
    }
}