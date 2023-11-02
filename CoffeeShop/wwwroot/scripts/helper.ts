// @ts-ignore
const DotNet = (await import("@microsoft/dotnet-js-interop").catch(_ => {}))?.DotNet;
// @ts-ignore
type DotNetObject = DotNet.DotNetObject

export function addVisibleTriggers(ref: Element, dotnetObj: DotNetObject, onVisibleFunc: string, onInvisibleFunc: string) {
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

export function removeVisibleTriggers(observer: IntersectionObserver) {
    observer.disconnect();
}

export function capturePointer(ref: Element, id: number) {
    console.log("Logging from capture pointer");
    ref.setPointerCapture(id);
}

export function releasePointer(ref: Element, id: number) {
    ref.releasePointerCapture(id);
}

export function registerOnScrollEvent(obj: DotNetObject, funcName: string) {
    window.addEventListener("scroll", async (e: Event) => {
        let scrollEvent = {
            ...e,
            ScrollX: window.scrollX,
            ScrollY: window.scrollY,
        }
        await obj.invokeMethodAsync(funcName, scrollEvent);
    })
}