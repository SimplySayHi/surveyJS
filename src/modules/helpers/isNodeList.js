/* eslint-disable no-prototype-builtins */

export const isNodeList = nodeList => {
    return NodeList.prototype.isPrototypeOf( nodeList );
}
