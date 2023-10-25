export function capturePointer(ref, id) {
    ref.setPointerCapture(id);
}

export function releasePointer(ref, id) {
    ref.releasePointerCapture(id);
}