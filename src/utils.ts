class Utils
{
    /** Determines if the current page is an IMIS page or not. This is used to determine if the extension should be enabled or not. */
    public static isImisPage($: JQueryStatic): boolean
    {
        // Most iMIS pages have a "gWebRoot" variable, a body called "MainBody", and a form called "aspnetForm".
        return $('script').toArray().some((script) => script.innerHTML.includes('gWebRoot'))
            && $('body').get(0)?.id === 'MainBody'
            && $('form').get(0)?.id === 'aspnetForm';
    }
}