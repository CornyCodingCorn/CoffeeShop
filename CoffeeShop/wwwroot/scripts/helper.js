/**
 * 
 * @param {Element} ref
 * @param {DotNet.DotNetObject} dotnetObj
 * @param {string} onVisibleFunc
 * @param {string} onInvisibleFunc
 * @returns {IntersectionObserver}
 */
export function addVisibleTriggers(ref, dotnetObj, onVisibleFunc, onInvisibleFunc) {
    let observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting === true) {
            if (onVisibleFunc !== "") 
                await dotnetObj.invokeMethodAsync(onVisibleFunc);
        } else {
            if (onInvisibleFunc !== "") 
                await dotnetObj.invokeMethodAsync(onInvisibleFunc);
        }
    }, {threshold: [0]})

    observer.observe(ref);
    return observer;
}

export function removeVisibleTriggers(observer) {
    observer.disconnect();
}

export function capturePointer(ref, id) {
    console.log("Logging from capture pointer");
    ref.setPointerCapture(id);
}

export function releasePointer(ref, id) {
    ref.releasePointerCapture(id);
}
