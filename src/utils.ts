class Utils
{
    /** Change this to true to enable console output for debugging */
    private static readonly ENABLE_CONSOLE_OUTPUT = false;

    public static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.3 %c ";

    /** Determines if the current page is an IMIS page or not. This is used to determine if the extension should be enabled or not. */
    public static isImisPage($: JQueryStatic): boolean
    {
        // Most iMIS pages have a "gWebRoot" variable, a body called "MainBody", and a form called "aspnetForm".
        return $('script').toArray().some((script) => script.innerHTML.includes('gWebRoot'))
            && $('body').get(0)?.id === 'MainBody'
            && $('form').get(0)?.id === 'aspnetForm';
    }

    /** Logs to the console if console output is enabled */
    public static log(...args: any[]): void
    {
        if (this.ENABLE_CONSOLE_OUTPUT) Utils.log(...args);
    }
}

class Debouncer
{
    private id: number | undefined;

    /** Starts a debounce operation with args */
    public start(callback: (...args: any[]) => void, delay: number, ...args: any[]): void
    {
        Utils.log('Started debounce operation');
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
            Utils.log('Stopped debounce operation');
            window.clearTimeout(this.id);
        }
        else
        {
            Utils.log('No debounce operation to stop');
        }
    }
}