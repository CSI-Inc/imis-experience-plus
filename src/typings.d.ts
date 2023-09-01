/**
 * Extends the jQuery object with additional methods.
 */
interface JQuery<TElement = HTMLElement> extends Iterable<TElement>
{
    changeElementType: (newType: string) => JQuery<TElement>;
    bindFirst<TType extends string>(
        events: TType,
        handler: JQuery.TypeEventHandler<TElement, undefined, TElement, TElement, TType> | false
    ): this;
    _data: any;
}

interface Window
{
    gWebRoot: string;
    WebKitMutationObserver: MutationObserver;
    chrome: any;
}

declare var Fuse: any;