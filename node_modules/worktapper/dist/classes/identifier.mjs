/**
 *
 * @param prefix
 */
export default function idGen(prefix = '') {
    return `${prefix}-${Math.random().toString(36).substring(0, 15)}`;
}
//# sourceMappingURL=identifier.mjs.map