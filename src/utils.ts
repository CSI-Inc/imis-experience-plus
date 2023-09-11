class Utils
{
    public static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";

    /** Determines if the current page is an IMIS page or not. This is used to determine if the extension should be enabled or not. */
    public static isImisPage($: JQueryStatic): boolean
    {
        // Most iMIS pages have a "gWebRoot" variable, a body called "MainBody", and a form called "aspnetForm".
        return $('script').toArray().some((script) => script.innerHTML.includes('gWebRoot'))
            && $('body').get(0)?.id === 'MainBody'
            && $('form').get(0)?.id === 'aspnetForm';
    }
}

class Debouncer
{
    private id: number | undefined;
    
    /** Starts a debounce operation with args */
    public start(callback: (...args: any[]) => void, delay: number, ...args: any[]): void
    {
        console.log('Started debounce operation');
        this.stop();
        this.id = window.setTimeout(callback, delay, ...args);
    }

    /** Gets if the current debounce operation is running */
    public get isRunning(): boolean
    {
        return this.id !== undefined;
    }

    /** Stops the current debounce operation */
    public stop(): void
    {
        if (this.id)
        {
            console.log('Stopped debounce operation');
            window.clearTimeout(this.id);
        }
        else
        {
            console.log('No debounce operation to stop');
        }
    }
}