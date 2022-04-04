/**
 * Extends the Window object to include any ambient variables from iMIS.
 */
interface Window
{
    gWebRoot: string;
    gWebsiteKey: string;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement>
{
    changeElementType: (newType: string) => JQuery<TElement>;
}