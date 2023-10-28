import "";

/**
 * @param {Element} ref
 * @param {DotnetObject}
 */
export function AddVisibleTriggers(ref, dotnetObj, onVisibleFunc, onInvisibleFunc) {
    let observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting === true) {
            if (onVisibleFunc !== "")
                dotnetObj.invokeMethodAsync();
            
        } else {
            if (onInvisibleFunc !== "")
                onInvisible();
        }
    }, {threshold: [0]})
    
    observer.observe(ref);
    return observer;
}

/**
 * @param {IntersectionObserver} observer
 */
export function RemoveVisibleTriggers(observer) {
    observer.disconnect();
}

/**
 * @param {Element} ref
 * @param {number} id
 */
export function capturePointer(ref, id) {
    ref.setPointerCapture(id);
}

/**
* @param {Element} ref
* @param {number} id
*/
export function releasePointer(ref, id) {
    ref.releasePointerCapture(id);
}
