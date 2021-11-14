export function some(array: Array<any>, predicate: Function): boolean {
    let index = -1;
    const length =  array?.length ?? 0;

    while (++index < length) {
        if (predicate(array[index], index, array)) {
            return true;
        }
    }
    return false;
}
