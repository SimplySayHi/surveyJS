
export const isNodeList = nodeList => {
    return NodeList.prototype.isPrototypeOf( nodeList );
}
