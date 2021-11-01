
import { mergeObjects } from './mergeObjects';

export const dispatchCustomEvent = ( elem, eventName, eventOptions ) => {
    eventOptions = mergeObjects({}, { bubbles: true }, eventOptions);
    const eventObj = new CustomEvent(eventName, eventOptions);
    elem.dispatchEvent( eventObj );
}
