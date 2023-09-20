interface ClientContext
{
    baseUrl: string;
    isAnonymous: boolean;
    loggedInPartyId: number;
    selectedPartyId: number;
    websiteRoot: string;
    virtualDir: string;
    appTimeZoneOffset: number;
    cookieConsent: number;
}