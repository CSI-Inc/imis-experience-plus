/**
 * Extends the jQuery object with additional methods.
 */
interface JQuery<TElement = HTMLElement> extends Iterable<TElement>
{
    changeElementType: (newType: string) => JQuery<TElement>;
}