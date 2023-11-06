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

// scrollObj need to contains markObj and has position set to relative
export function scrollXToElement(scrollObj: HTMLElement, markObj: HTMLElement) {
    scrollObj.scrollTo({
        left: markObj.offsetLeft,
        behavior: 'smooth'
    })
}
export function scrollYToElement(scrollObj: HTMLElement, markObj: HTMLElement) {
    scrollObj.scrollTo({
        top: markObj.offsetTop,
        behavior: 'smooth'
    })
}

export function onClickOutsideClass(className: string, dotnetObj: DotNetObject, funcName: string) {
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(className) != null) return;
        
        dotnetObj.invokeMethod(funcName);
    })
}


function validDigits(n: string){
    return n.replace(/[^0-9]+/g, '1');
}

export function forceDigitOnlyInput(ref: HTMLInputElement) {
    ref.addEventListener('keyup', function(){
        let field = ref.value;
        ref.value = validDigits(field);
    });
}