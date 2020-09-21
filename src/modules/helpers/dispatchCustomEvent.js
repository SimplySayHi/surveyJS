
import { mergeObjects } from './mergeObjects';

export const dispatchCustomEvent = ( elem, eventName, data = {}, eventOptions = {} ) => {
    eventOptions = mergeObjects({}, { bubbles: true }, eventOptions);
    const eventObj = new Event(eventName, eventOptions);
    eventObj.data = data;
    elem.dispatchEvent( eventObj );
}
