
import { isPlainObject } from './isPlainObject';

export const isEmptyObject = object => {
    return isPlainObject(object) && Object.getOwnPropertyNames(object).length === 0;
}
