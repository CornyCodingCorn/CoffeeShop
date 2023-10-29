/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@microsoft/dotnet-js-interop/dist/Microsoft.JSInterop.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/dotnet-js-interop/dist/Microsoft.JSInterop.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DotNet: () => (/* binding */ DotNet)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// This is a single-file self-contained module to avoid the need for a Webpack build
var DotNet;
(function (DotNet) {
    window.DotNet = DotNet; // Ensure reachable from anywhere
    const jsonRevivers = [];
    const byteArraysToBeRevived = new Map();
    const pendingDotNetToJSStreams = new Map();
    const jsObjectIdKey = "__jsObjectId";
    const dotNetObjectRefKey = "__dotNetObject";
    const byteArrayRefKey = "__byte[]";
    const dotNetStreamRefKey = "__dotNetStream";
    const jsStreamReferenceLengthKey = "__jsStreamReferenceLength";
    class JSObject {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(_jsObject) {
            this._jsObject = _jsObject;
            this._cachedFunctions = new Map();
        }
        findFunction(identifier) {
            const cachedFunction = this._cachedFunctions.get(identifier);
            if (cachedFunction) {
                return cachedFunction;
            }
            let result = this._jsObject;
            let lastSegmentValue;
            identifier.split(".").forEach(segment => {
                if (segment in result) {
                    lastSegmentValue = result;
                    result = result[segment];
                }
                else {
                    throw new Error(`Could not find '${identifier}' ('${segment}' was undefined).`);
                }
            });
            if (result instanceof Function) {
                result = result.bind(lastSegmentValue);
                this._cachedFunctions.set(identifier, result);
                return result;
            }
            throw new Error(`The value '${identifier}' is not a function.`);
        }
        getWrappedObject() {
            return this._jsObject;
        }
    }
    const pendingAsyncCalls = {};
    const windowJSObjectId = 0;
    const cachedJSObjectsById = {
        [windowJSObjectId]: new JSObject(window)
    };
    cachedJSObjectsById[windowJSObjectId]._cachedFunctions.set("import", (url) => {
        // In most cases developers will want to resolve dynamic imports relative to the base HREF.
        // However since we're the one calling the import keyword, they would be resolved relative to
        // this framework bundle URL. Fix this by providing an absolute URL.
        if (typeof url === "string" && url.startsWith("./")) {
            url = document.baseURI + url.substr(2);
        }
        return import(/* webpackIgnore: true */ url);
    });
    let nextAsyncCallId = 1; // Start at 1 because zero signals "no response needed"
    let nextJsObjectId = 1; // Start at 1 because zero is reserved for "window"
    let dotNetDispatcher = null;
    /**
     * Sets the specified .NET call dispatcher as the current instance so that it will be used
     * for future invocations.
     *
     * @param dispatcher An object that can dispatch calls from JavaScript to a .NET runtime.
     */
    function attachDispatcher(dispatcher) {
        dotNetDispatcher = dispatcher;
    }
    DotNet.attachDispatcher = attachDispatcher;
    /**
     * Adds a JSON reviver callback that will be used when parsing arguments received from .NET.
     * @param reviver The reviver to add.
     */
    function attachReviver(reviver) {
        jsonRevivers.push(reviver);
    }
    DotNet.attachReviver = attachReviver;
    /**
     * Invokes the specified .NET public method synchronously. Not all hosting scenarios support
     * synchronous invocation, so if possible use invokeMethodAsync instead.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns The result of the operation.
     */
    function invokeMethod(assemblyName, methodIdentifier, ...args) {
        return invokePossibleInstanceMethod(assemblyName, methodIdentifier, null, args);
    }
    DotNet.invokeMethod = invokeMethod;
    /**
     * Invokes the specified .NET public method asynchronously.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns A promise representing the result of the operation.
     */
    function invokeMethodAsync(assemblyName, methodIdentifier, ...args) {
        return invokePossibleInstanceMethodAsync(assemblyName, methodIdentifier, null, args);
    }
    DotNet.invokeMethodAsync = invokeMethodAsync;
    /**
     * Creates a JavaScript object reference that can be passed to .NET via interop calls.
     *
     * @param jsObject The JavaScript Object used to create the JavaScript object reference.
     * @returns The JavaScript object reference (this will be the same instance as the given object).
     * @throws Error if the given value is not an Object.
     */
    function createJSObjectReference(jsObject) {
        if (jsObject && typeof jsObject === "object") {
            cachedJSObjectsById[nextJsObjectId] = new JSObject(jsObject);
            const result = {
                [jsObjectIdKey]: nextJsObjectId
            };
            nextJsObjectId++;
            return result;
        }
        throw new Error(`Cannot create a JSObjectReference from the value '${jsObject}'.`);
    }
    DotNet.createJSObjectReference = createJSObjectReference;
    /**
     * Creates a JavaScript data reference that can be passed to .NET via interop calls.
     *
     * @param streamReference The ArrayBufferView or Blob used to create the JavaScript stream reference.
     * @returns The JavaScript data reference (this will be the same instance as the given object).
     * @throws Error if the given value is not an Object or doesn't have a valid byteLength.
     */
    function createJSStreamReference(streamReference) {
        let length = -1;
        // If we're given a raw Array Buffer, we interpret it as a `Uint8Array` as
        // ArrayBuffers' aren't directly readable.
        if (streamReference instanceof ArrayBuffer) {
            streamReference = new Uint8Array(streamReference);
        }
        if (streamReference instanceof Blob) {
            length = streamReference.size;
        }
        else if (streamReference.buffer instanceof ArrayBuffer) {
            if (streamReference.byteLength === undefined) {
                throw new Error(`Cannot create a JSStreamReference from the value '${streamReference}' as it doesn't have a byteLength.`);
            }
            length = streamReference.byteLength;
        }
        else {
            throw new Error("Supplied value is not a typed array or blob.");
        }
        const result = {
            [jsStreamReferenceLengthKey]: length
        };
        try {
            const jsObjectReference = createJSObjectReference(streamReference);
            result[jsObjectIdKey] = jsObjectReference[jsObjectIdKey];
        }
        catch (error) {
            throw new Error(`Cannot create a JSStreamReference from the value '${streamReference}'.`);
        }
        return result;
    }
    DotNet.createJSStreamReference = createJSStreamReference;
    /**
     * Disposes the given JavaScript object reference.
     *
     * @param jsObjectReference The JavaScript Object reference.
     */
    function disposeJSObjectReference(jsObjectReference) {
        const id = jsObjectReference && jsObjectReference[jsObjectIdKey];
        if (typeof id === "number") {
            disposeJSObjectReferenceById(id);
        }
    }
    DotNet.disposeJSObjectReference = disposeJSObjectReference;
    /**
     * Parses the given JSON string using revivers to restore args passed from .NET to JS.
     *
     * @param json The JSON stirng to parse.
     */
    function parseJsonWithRevivers(json) {
        return json ? JSON.parse(json, (key, initialValue) => {
            // Invoke each reviver in order, passing the output from the previous reviver,
            // so that each one gets a chance to transform the value
            return jsonRevivers.reduce((latestValue, reviver) => reviver(key, latestValue), initialValue);
        }) : null;
    }
    function invokePossibleInstanceMethod(assemblyName, methodIdentifier, dotNetObjectId, args) {
        const dispatcher = getRequiredDispatcher();
        if (dispatcher.invokeDotNetFromJS) {
            const argsJson = stringifyArgs(args);
            const resultJson = dispatcher.invokeDotNetFromJS(assemblyName, methodIdentifier, dotNetObjectId, argsJson);
            return resultJson ? parseJsonWithRevivers(resultJson) : null;
        }
        throw new Error("The current dispatcher does not support synchronous calls from JS to .NET. Use invokeMethodAsync instead.");
    }
    function invokePossibleInstanceMethodAsync(assemblyName, methodIdentifier, dotNetObjectId, args) {
        if (assemblyName && dotNetObjectId) {
            throw new Error(`For instance method calls, assemblyName should be null. Received '${assemblyName}'.`);
        }
        const asyncCallId = nextAsyncCallId++;
        const resultPromise = new Promise((resolve, reject) => {
            pendingAsyncCalls[asyncCallId] = { resolve, reject };
        });
        try {
            const argsJson = stringifyArgs(args);
            getRequiredDispatcher().beginInvokeDotNetFromJS(asyncCallId, assemblyName, methodIdentifier, dotNetObjectId, argsJson);
        }
        catch (ex) {
            // Synchronous failure
            completePendingCall(asyncCallId, false, ex);
        }
        return resultPromise;
    }
    function getRequiredDispatcher() {
        if (dotNetDispatcher !== null) {
            return dotNetDispatcher;
        }
        throw new Error("No .NET call dispatcher has been set.");
    }
    function completePendingCall(asyncCallId, success, resultOrError) {
        if (!pendingAsyncCalls.hasOwnProperty(asyncCallId)) {
            throw new Error(`There is no pending async call with ID ${asyncCallId}.`);
        }
        const asyncCall = pendingAsyncCalls[asyncCallId];
        delete pendingAsyncCalls[asyncCallId];
        if (success) {
            asyncCall.resolve(resultOrError);
        }
        else {
            asyncCall.reject(resultOrError);
        }
    }
    /**
     * Represents the type of result expected from a JS interop call.
     */
    // eslint-disable-next-line no-shadow
    let JSCallResultType;
    (function (JSCallResultType) {
        JSCallResultType[JSCallResultType["Default"] = 0] = "Default";
        JSCallResultType[JSCallResultType["JSObjectReference"] = 1] = "JSObjectReference";
        JSCallResultType[JSCallResultType["JSStreamReference"] = 2] = "JSStreamReference";
        JSCallResultType[JSCallResultType["JSVoidResult"] = 3] = "JSVoidResult";
    })(JSCallResultType = DotNet.JSCallResultType || (DotNet.JSCallResultType = {}));
    /**
     * Receives incoming calls from .NET and dispatches them to JavaScript.
     */
    DotNet.jsCallDispatcher = {
        /**
         * Finds the JavaScript function matching the specified identifier.
         *
         * @param identifier Identifies the globally-reachable function to be returned.
         * @param targetInstanceId The instance ID of the target JS object.
         * @returns A Function instance.
         */
        findJSFunction,
        /**
         * Disposes the JavaScript object reference with the specified object ID.
         *
         * @param id The ID of the JavaScript object reference.
         */
        disposeJSObjectReferenceById,
        /**
         * Invokes the specified synchronous JavaScript function.
         *
         * @param identifier Identifies the globally-reachable function to invoke.
         * @param argsJson JSON representation of arguments to be passed to the function.
         * @param resultType The type of result expected from the JS interop call.
         * @param targetInstanceId The instance ID of the target JS object.
         * @returns JSON representation of the invocation result.
         */
        invokeJSFromDotNet: (identifier, argsJson, resultType, targetInstanceId) => {
            const returnValue = findJSFunction(identifier, targetInstanceId).apply(null, parseJsonWithRevivers(argsJson));
            const result = createJSCallResult(returnValue, resultType);
            return result === null || result === undefined
                ? null
                : stringifyArgs(result);
        },
        /**
         * Invokes the specified synchronous or asynchronous JavaScript function.
         *
         * @param asyncHandle A value identifying the asynchronous operation. This value will be passed back in a later call to endInvokeJSFromDotNet.
         * @param identifier Identifies the globally-reachable function to invoke.
         * @param argsJson JSON representation of arguments to be passed to the function.
         * @param resultType The type of result expected from the JS interop call.
         * @param targetInstanceId The ID of the target JS object instance.
         */
        beginInvokeJSFromDotNet: (asyncHandle, identifier, argsJson, resultType, targetInstanceId) => {
            // Coerce synchronous functions into async ones, plus treat
            // synchronous exceptions the same as async ones
            const promise = new Promise(resolve => {
                const synchronousResultOrPromise = findJSFunction(identifier, targetInstanceId).apply(null, parseJsonWithRevivers(argsJson));
                resolve(synchronousResultOrPromise);
            });
            // We only listen for a result if the caller wants to be notified about it
            if (asyncHandle) {
                // On completion, dispatch result back to .NET
                // Not using "await" because it codegens a lot of boilerplate
                promise
                    .then(result => stringifyArgs([asyncHandle, true, createJSCallResult(result, resultType)]))
                    .then(result => getRequiredDispatcher().endInvokeJSFromDotNet(asyncHandle, true, result), error => getRequiredDispatcher().endInvokeJSFromDotNet(asyncHandle, false, JSON.stringify([
                    asyncHandle,
                    false,
                    formatError(error)
                ])));
            }
        },
        /**
         * Receives notification that an async call from JS to .NET has completed.
         * @param asyncCallId The identifier supplied in an earlier call to beginInvokeDotNetFromJS.
         * @param success A flag to indicate whether the operation completed successfully.
         * @param resultJsonOrExceptionMessage Either the operation result as JSON, or an error message.
         */
        endInvokeDotNetFromJS: (asyncCallId, success, resultJsonOrExceptionMessage) => {
            const resultOrError = success
                ? parseJsonWithRevivers(resultJsonOrExceptionMessage)
                : new Error(resultJsonOrExceptionMessage);
            completePendingCall(parseInt(asyncCallId, 10), success, resultOrError);
        },
        /**
         * Receives notification that a byte array is being transferred from .NET to JS.
         * @param id The identifier for the byte array used during revival.
         * @param data The byte array being transferred for eventual revival.
         */
        receiveByteArray: (id, data) => {
            byteArraysToBeRevived.set(id, data);
        },
        /**
         * Supplies a stream of data being sent from .NET.
         *
         * @param streamId The identifier previously passed to JSRuntime's BeginTransmittingStream in .NET code
         * @param stream The stream data.
         */
        supplyDotNetStream: (streamId, stream) => {
            if (pendingDotNetToJSStreams.has(streamId)) {
                // The receiver is already waiting, so we can resolve the promise now and stop tracking this
                const pendingStream = pendingDotNetToJSStreams.get(streamId);
                pendingDotNetToJSStreams.delete(streamId);
                pendingStream.resolve(stream);
            }
            else {
                // The receiver hasn't started waiting yet, so track a pre-completed entry it can attach to later
                const pendingStream = new PendingStream();
                pendingStream.resolve(stream);
                pendingDotNetToJSStreams.set(streamId, pendingStream);
            }
        }
    };
    function formatError(error) {
        if (error instanceof Error) {
            return `${error.message}\n${error.stack}`;
        }
        return error ? error.toString() : "null";
    }
    function findJSFunction(identifier, targetInstanceId) {
        const targetInstance = cachedJSObjectsById[targetInstanceId];
        if (targetInstance) {
            return targetInstance.findFunction(identifier);
        }
        throw new Error(`JS object instance with ID ${targetInstanceId} does not exist (has it been disposed?).`);
    }
    function disposeJSObjectReferenceById(id) {
        delete cachedJSObjectsById[id];
    }
    class DotNetObject {
        // eslint-disable-next-line no-empty-function
        constructor(_id) {
            this._id = _id;
        }
        invokeMethod(methodIdentifier, ...args) {
            return invokePossibleInstanceMethod(null, methodIdentifier, this._id, args);
        }
        invokeMethodAsync(methodIdentifier, ...args) {
            return invokePossibleInstanceMethodAsync(null, methodIdentifier, this._id, args);
        }
        dispose() {
            const promise = invokePossibleInstanceMethodAsync(null, "__Dispose", this._id, null);
            promise.catch(error => console.error(error));
        }
        serializeAsArg() {
            return { __dotNetObject: this._id };
        }
    }
    DotNet.DotNetObject = DotNetObject;
    attachReviver(function reviveReference(key, value) {
        if (value && typeof value === "object") {
            if (value.hasOwnProperty(dotNetObjectRefKey)) {
                return new DotNetObject(value[dotNetObjectRefKey]);
            }
            else if (value.hasOwnProperty(jsObjectIdKey)) {
                const id = value[jsObjectIdKey];
                const jsObject = cachedJSObjectsById[id];
                if (jsObject) {
                    return jsObject.getWrappedObject();
                }
                throw new Error(`JS object instance with Id '${id}' does not exist. It may have been disposed.`);
            }
            else if (value.hasOwnProperty(byteArrayRefKey)) {
                const index = value[byteArrayRefKey];
                const byteArray = byteArraysToBeRevived.get(index);
                if (byteArray === undefined) {
                    throw new Error(`Byte array index '${index}' does not exist.`);
                }
                byteArraysToBeRevived.delete(index);
                return byteArray;
            }
            else if (value.hasOwnProperty(dotNetStreamRefKey)) {
                return new DotNetStream(value[dotNetStreamRefKey]);
            }
        }
        // Unrecognized - let another reviver handle it
        return value;
    });
    class DotNetStream {
        constructor(streamId) {
            // This constructor runs when we're JSON-deserializing some value from the .NET side.
            // At this point we might already have started receiving the stream, or maybe it will come later.
            // We have to handle both possible orderings, but we can count on it coming eventually because
            // it's not something the developer gets to control, and it would be an error if it doesn't.
            if (pendingDotNetToJSStreams.has(streamId)) {
                // We've already started receiving the stream, so no longer need to track it as pending
                this._streamPromise = pendingDotNetToJSStreams.get(streamId).streamPromise;
                pendingDotNetToJSStreams.delete(streamId);
            }
            else {
                // We haven't started receiving it yet, so add an entry to track it as pending
                const pendingStream = new PendingStream();
                pendingDotNetToJSStreams.set(streamId, pendingStream);
                this._streamPromise = pendingStream.streamPromise;
            }
        }
        /**
         * Supplies a readable stream of data being sent from .NET.
         */
        stream() {
            return this._streamPromise;
        }
        /**
         * Supplies a array buffer of data being sent from .NET.
         * Note there is a JavaScript limit on the size of the ArrayBuffer equal to approximately 2GB.
         */
        async arrayBuffer() {
            return new Response(await this.stream()).arrayBuffer();
        }
    }
    class PendingStream {
        constructor() {
            this.streamPromise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }
    }
    function createJSCallResult(returnValue, resultType) {
        switch (resultType) {
            case JSCallResultType.Default:
                return returnValue;
            case JSCallResultType.JSObjectReference:
                return createJSObjectReference(returnValue);
            case JSCallResultType.JSStreamReference:
                return createJSStreamReference(returnValue);
            case JSCallResultType.JSVoidResult:
                return null;
            default:
                throw new Error(`Invalid JS call result type '${resultType}'.`);
        }
    }
    let nextByteArrayIndex = 0;
    function stringifyArgs(args) {
        nextByteArrayIndex = 0;
        return JSON.stringify(args, argReplacer);
    }
    function argReplacer(key, value) {
        if (value instanceof DotNetObject) {
            return value.serializeAsArg();
        }
        else if (value instanceof Uint8Array) {
            dotNetDispatcher.sendByteArray(nextByteArrayIndex, value);
            const jsonValue = { [byteArrayRefKey]: nextByteArrayIndex };
            nextByteArrayIndex++;
            return jsonValue;
        }
        return value;
    }
})(DotNet || (DotNet = {}));
//# sourceMappingURL=Microsoft.JSInterop.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DotNet: () => (/* reexport safe */ _microsoft_dotnet_js_interop__WEBPACK_IMPORTED_MODULE_0__.DotNet)
/* harmony export */ });
/* harmony import */ var _microsoft_dotnet_js_interop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/dotnet-js-interop */ "./node_modules/@microsoft/dotnet-js-interop/dist/Microsoft.JSInterop.js");


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsV0FBVyxNQUFNLFFBQVE7QUFDaEY7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxXQUFXO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCw2QkFBNkI7QUFDN0IsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RSxTQUFTO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRixnQkFBZ0I7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRixnQkFBZ0I7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpR0FBaUcsYUFBYTtBQUM5RztBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0MsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRSxZQUFZO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLDZFQUE2RTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsY0FBYyxJQUFJLFlBQVk7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxrQkFBa0I7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStELEdBQUc7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxNQUFNO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLFdBQVc7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsd0JBQXdCO0FBQ3pCOzs7Ozs7VUN2ZUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ042QyIsInNvdXJjZXMiOlsid2VicGFjazovL25wbXRzLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZG90bmV0LWpzLWludGVyb3AvZGlzdC9NaWNyb3NvZnQuSlNJbnRlcm9wLmpzIiwid2VicGFjazovL25wbXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25wbXRzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ucG10cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL25wbXRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbnBtdHMvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4vLyBUaGlzIGlzIGEgc2luZ2xlLWZpbGUgc2VsZi1jb250YWluZWQgbW9kdWxlIHRvIGF2b2lkIHRoZSBuZWVkIGZvciBhIFdlYnBhY2sgYnVpbGRcclxuZXhwb3J0IHZhciBEb3ROZXQ7XHJcbihmdW5jdGlvbiAoRG90TmV0KSB7XHJcbiAgICB3aW5kb3cuRG90TmV0ID0gRG90TmV0OyAvLyBFbnN1cmUgcmVhY2hhYmxlIGZyb20gYW55d2hlcmVcclxuICAgIGNvbnN0IGpzb25SZXZpdmVycyA9IFtdO1xyXG4gICAgY29uc3QgYnl0ZUFycmF5c1RvQmVSZXZpdmVkID0gbmV3IE1hcCgpO1xyXG4gICAgY29uc3QgcGVuZGluZ0RvdE5ldFRvSlNTdHJlYW1zID0gbmV3IE1hcCgpO1xyXG4gICAgY29uc3QganNPYmplY3RJZEtleSA9IFwiX19qc09iamVjdElkXCI7XHJcbiAgICBjb25zdCBkb3ROZXRPYmplY3RSZWZLZXkgPSBcIl9fZG90TmV0T2JqZWN0XCI7XHJcbiAgICBjb25zdCBieXRlQXJyYXlSZWZLZXkgPSBcIl9fYnl0ZVtdXCI7XHJcbiAgICBjb25zdCBkb3ROZXRTdHJlYW1SZWZLZXkgPSBcIl9fZG90TmV0U3RyZWFtXCI7XHJcbiAgICBjb25zdCBqc1N0cmVhbVJlZmVyZW5jZUxlbmd0aEtleSA9IFwiX19qc1N0cmVhbVJlZmVyZW5jZUxlbmd0aFwiO1xyXG4gICAgY2xhc3MgSlNPYmplY3Qge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgY29uc3RydWN0b3IoX2pzT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2pzT2JqZWN0ID0gX2pzT2JqZWN0O1xyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZWRGdW5jdGlvbnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmRGdW5jdGlvbihpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZEZ1bmN0aW9uID0gdGhpcy5fY2FjaGVkRnVuY3Rpb25zLmdldChpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVkRnVuY3Rpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuX2pzT2JqZWN0O1xyXG4gICAgICAgICAgICBsZXQgbGFzdFNlZ21lbnRWYWx1ZTtcclxuICAgICAgICAgICAgaWRlbnRpZmllci5zcGxpdChcIi5cIikuZm9yRWFjaChzZWdtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50IGluIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50VmFsdWUgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3NlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCAnJHtpZGVudGlmaWVyfScgKCcke3NlZ21lbnR9JyB3YXMgdW5kZWZpbmVkKS5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmJpbmQobGFzdFNlZ21lbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZWRGdW5jdGlvbnMuc2V0KGlkZW50aWZpZXIsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHZhbHVlICcke2lkZW50aWZpZXJ9JyBpcyBub3QgYSBmdW5jdGlvbi5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0V3JhcHBlZE9iamVjdCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2pzT2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHBlbmRpbmdBc3luY0NhbGxzID0ge307XHJcbiAgICBjb25zdCB3aW5kb3dKU09iamVjdElkID0gMDtcclxuICAgIGNvbnN0IGNhY2hlZEpTT2JqZWN0c0J5SWQgPSB7XHJcbiAgICAgICAgW3dpbmRvd0pTT2JqZWN0SWRdOiBuZXcgSlNPYmplY3Qod2luZG93KVxyXG4gICAgfTtcclxuICAgIGNhY2hlZEpTT2JqZWN0c0J5SWRbd2luZG93SlNPYmplY3RJZF0uX2NhY2hlZEZ1bmN0aW9ucy5zZXQoXCJpbXBvcnRcIiwgKHVybCkgPT4ge1xyXG4gICAgICAgIC8vIEluIG1vc3QgY2FzZXMgZGV2ZWxvcGVycyB3aWxsIHdhbnQgdG8gcmVzb2x2ZSBkeW5hbWljIGltcG9ydHMgcmVsYXRpdmUgdG8gdGhlIGJhc2UgSFJFRi5cclxuICAgICAgICAvLyBIb3dldmVyIHNpbmNlIHdlJ3JlIHRoZSBvbmUgY2FsbGluZyB0aGUgaW1wb3J0IGtleXdvcmQsIHRoZXkgd291bGQgYmUgcmVzb2x2ZWQgcmVsYXRpdmUgdG9cclxuICAgICAgICAvLyB0aGlzIGZyYW1ld29yayBidW5kbGUgVVJMLiBGaXggdGhpcyBieSBwcm92aWRpbmcgYW4gYWJzb2x1dGUgVVJMLlxyXG4gICAgICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKFwiLi9cIikpIHtcclxuICAgICAgICAgICAgdXJsID0gZG9jdW1lbnQuYmFzZVVSSSArIHVybC5zdWJzdHIoMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgbmV4dEFzeW5jQ2FsbElkID0gMTsgLy8gU3RhcnQgYXQgMSBiZWNhdXNlIHplcm8gc2lnbmFscyBcIm5vIHJlc3BvbnNlIG5lZWRlZFwiXHJcbiAgICBsZXQgbmV4dEpzT2JqZWN0SWQgPSAxOyAvLyBTdGFydCBhdCAxIGJlY2F1c2UgemVybyBpcyByZXNlcnZlZCBmb3IgXCJ3aW5kb3dcIlxyXG4gICAgbGV0IGRvdE5ldERpc3BhdGNoZXIgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzcGVjaWZpZWQgLk5FVCBjYWxsIGRpc3BhdGNoZXIgYXMgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugc28gdGhhdCBpdCB3aWxsIGJlIHVzZWRcclxuICAgICAqIGZvciBmdXR1cmUgaW52b2NhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRpc3BhdGNoZXIgQW4gb2JqZWN0IHRoYXQgY2FuIGRpc3BhdGNoIGNhbGxzIGZyb20gSmF2YVNjcmlwdCB0byBhIC5ORVQgcnVudGltZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXR0YWNoRGlzcGF0Y2hlcihkaXNwYXRjaGVyKSB7XHJcbiAgICAgICAgZG90TmV0RGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XHJcbiAgICB9XHJcbiAgICBEb3ROZXQuYXR0YWNoRGlzcGF0Y2hlciA9IGF0dGFjaERpc3BhdGNoZXI7XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBKU09OIHJldml2ZXIgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIHVzZWQgd2hlbiBwYXJzaW5nIGFyZ3VtZW50cyByZWNlaXZlZCBmcm9tIC5ORVQuXHJcbiAgICAgKiBAcGFyYW0gcmV2aXZlciBUaGUgcmV2aXZlciB0byBhZGQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGF0dGFjaFJldml2ZXIocmV2aXZlcikge1xyXG4gICAgICAgIGpzb25SZXZpdmVycy5wdXNoKHJldml2ZXIpO1xyXG4gICAgfVxyXG4gICAgRG90TmV0LmF0dGFjaFJldml2ZXIgPSBhdHRhY2hSZXZpdmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZva2VzIHRoZSBzcGVjaWZpZWQgLk5FVCBwdWJsaWMgbWV0aG9kIHN5bmNocm9ub3VzbHkuIE5vdCBhbGwgaG9zdGluZyBzY2VuYXJpb3Mgc3VwcG9ydFxyXG4gICAgICogc3luY2hyb25vdXMgaW52b2NhdGlvbiwgc28gaWYgcG9zc2libGUgdXNlIGludm9rZU1ldGhvZEFzeW5jIGluc3RlYWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFzc2VtYmx5TmFtZSBUaGUgc2hvcnQgbmFtZSAod2l0aG91dCBrZXkvdmVyc2lvbiBvciAuZGxsIGV4dGVuc2lvbikgb2YgdGhlIC5ORVQgYXNzZW1ibHkgY29udGFpbmluZyB0aGUgbWV0aG9kLlxyXG4gICAgICogQHBhcmFtIG1ldGhvZElkZW50aWZpZXIgVGhlIGlkZW50aWZpZXIgb2YgdGhlIG1ldGhvZCB0byBpbnZva2UuIFRoZSBtZXRob2QgbXVzdCBoYXZlIGEgW0pTSW52b2thYmxlXSBhdHRyaWJ1dGUgc3BlY2lmeWluZyB0aGlzIGlkZW50aWZpZXIuXHJcbiAgICAgKiBAcGFyYW0gYXJncyBBcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kLCBlYWNoIG9mIHdoaWNoIG11c3QgYmUgSlNPTi1zZXJpYWxpemFibGUuXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIHRoZSBvcGVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGludm9rZU1ldGhvZChhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gaW52b2tlUG9zc2libGVJbnN0YW5jZU1ldGhvZChhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIG51bGwsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgRG90TmV0Lmludm9rZU1ldGhvZCA9IGludm9rZU1ldGhvZDtcclxuICAgIC8qKlxyXG4gICAgICogSW52b2tlcyB0aGUgc3BlY2lmaWVkIC5ORVQgcHVibGljIG1ldGhvZCBhc3luY2hyb25vdXNseS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXNzZW1ibHlOYW1lIFRoZSBzaG9ydCBuYW1lICh3aXRob3V0IGtleS92ZXJzaW9uIG9yIC5kbGwgZXh0ZW5zaW9uKSBvZiB0aGUgLk5FVCBhc3NlbWJseSBjb250YWluaW5nIHRoZSBtZXRob2QuXHJcbiAgICAgKiBAcGFyYW0gbWV0aG9kSWRlbnRpZmllciBUaGUgaWRlbnRpZmllciBvZiB0aGUgbWV0aG9kIHRvIGludm9rZS4gVGhlIG1ldGhvZCBtdXN0IGhhdmUgYSBbSlNJbnZva2FibGVdIGF0dHJpYnV0ZSBzcGVjaWZ5aW5nIHRoaXMgaWRlbnRpZmllci5cclxuICAgICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBtZXRob2QsIGVhY2ggb2Ygd2hpY2ggbXVzdCBiZSBKU09OLXNlcmlhbGl6YWJsZS5cclxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbnZva2VNZXRob2RBc3luYyhhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gaW52b2tlUG9zc2libGVJbnN0YW5jZU1ldGhvZEFzeW5jKGFzc2VtYmx5TmFtZSwgbWV0aG9kSWRlbnRpZmllciwgbnVsbCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBEb3ROZXQuaW52b2tlTWV0aG9kQXN5bmMgPSBpbnZva2VNZXRob2RBc3luYztcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIEphdmFTY3JpcHQgb2JqZWN0IHJlZmVyZW5jZSB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gLk5FVCB2aWEgaW50ZXJvcCBjYWxscy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ganNPYmplY3QgVGhlIEphdmFTY3JpcHQgT2JqZWN0IHVzZWQgdG8gY3JlYXRlIHRoZSBKYXZhU2NyaXB0IG9iamVjdCByZWZlcmVuY2UuXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgSmF2YVNjcmlwdCBvYmplY3QgcmVmZXJlbmNlICh0aGlzIHdpbGwgYmUgdGhlIHNhbWUgaW5zdGFuY2UgYXMgdGhlIGdpdmVuIG9iamVjdCkuXHJcbiAgICAgKiBAdGhyb3dzIEVycm9yIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBub3QgYW4gT2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVKU09iamVjdFJlZmVyZW5jZShqc09iamVjdCkge1xyXG4gICAgICAgIGlmIChqc09iamVjdCAmJiB0eXBlb2YganNPYmplY3QgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgY2FjaGVkSlNPYmplY3RzQnlJZFtuZXh0SnNPYmplY3RJZF0gPSBuZXcgSlNPYmplY3QoanNPYmplY3QpO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBbanNPYmplY3RJZEtleV06IG5leHRKc09iamVjdElkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG5leHRKc09iamVjdElkKys7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNyZWF0ZSBhIEpTT2JqZWN0UmVmZXJlbmNlIGZyb20gdGhlIHZhbHVlICcke2pzT2JqZWN0fScuYCk7XHJcbiAgICB9XHJcbiAgICBEb3ROZXQuY3JlYXRlSlNPYmplY3RSZWZlcmVuY2UgPSBjcmVhdGVKU09iamVjdFJlZmVyZW5jZTtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIEphdmFTY3JpcHQgZGF0YSByZWZlcmVuY2UgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIC5ORVQgdmlhIGludGVyb3AgY2FsbHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0cmVhbVJlZmVyZW5jZSBUaGUgQXJyYXlCdWZmZXJWaWV3IG9yIEJsb2IgdXNlZCB0byBjcmVhdGUgdGhlIEphdmFTY3JpcHQgc3RyZWFtIHJlZmVyZW5jZS5cclxuICAgICAqIEByZXR1cm5zIFRoZSBKYXZhU2NyaXB0IGRhdGEgcmVmZXJlbmNlICh0aGlzIHdpbGwgYmUgdGhlIHNhbWUgaW5zdGFuY2UgYXMgdGhlIGdpdmVuIG9iamVjdCkuXHJcbiAgICAgKiBAdGhyb3dzIEVycm9yIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBub3QgYW4gT2JqZWN0IG9yIGRvZXNuJ3QgaGF2ZSBhIHZhbGlkIGJ5dGVMZW5ndGguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUpTU3RyZWFtUmVmZXJlbmNlKHN0cmVhbVJlZmVyZW5jZSkge1xyXG4gICAgICAgIGxldCBsZW5ndGggPSAtMTtcclxuICAgICAgICAvLyBJZiB3ZSdyZSBnaXZlbiBhIHJhdyBBcnJheSBCdWZmZXIsIHdlIGludGVycHJldCBpdCBhcyBhIGBVaW50OEFycmF5YCBhc1xyXG4gICAgICAgIC8vIEFycmF5QnVmZmVycycgYXJlbid0IGRpcmVjdGx5IHJlYWRhYmxlLlxyXG4gICAgICAgIGlmIChzdHJlYW1SZWZlcmVuY2UgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xyXG4gICAgICAgICAgICBzdHJlYW1SZWZlcmVuY2UgPSBuZXcgVWludDhBcnJheShzdHJlYW1SZWZlcmVuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RyZWFtUmVmZXJlbmNlIGluc3RhbmNlb2YgQmxvYikge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBzdHJlYW1SZWZlcmVuY2Uuc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc3RyZWFtUmVmZXJlbmNlLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChzdHJlYW1SZWZlcmVuY2UuYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjcmVhdGUgYSBKU1N0cmVhbVJlZmVyZW5jZSBmcm9tIHRoZSB2YWx1ZSAnJHtzdHJlYW1SZWZlcmVuY2V9JyBhcyBpdCBkb2Vzbid0IGhhdmUgYSBieXRlTGVuZ3RoLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IHN0cmVhbVJlZmVyZW5jZS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3VwcGxpZWQgdmFsdWUgaXMgbm90IGEgdHlwZWQgYXJyYXkgb3IgYmxvYi5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgW2pzU3RyZWFtUmVmZXJlbmNlTGVuZ3RoS2V5XTogbGVuZ3RoXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBqc09iamVjdFJlZmVyZW5jZSA9IGNyZWF0ZUpTT2JqZWN0UmVmZXJlbmNlKHN0cmVhbVJlZmVyZW5jZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdFtqc09iamVjdElkS2V5XSA9IGpzT2JqZWN0UmVmZXJlbmNlW2pzT2JqZWN0SWRLZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY3JlYXRlIGEgSlNTdHJlYW1SZWZlcmVuY2UgZnJvbSB0aGUgdmFsdWUgJyR7c3RyZWFtUmVmZXJlbmNlfScuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBEb3ROZXQuY3JlYXRlSlNTdHJlYW1SZWZlcmVuY2UgPSBjcmVhdGVKU1N0cmVhbVJlZmVyZW5jZTtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcG9zZXMgdGhlIGdpdmVuIEphdmFTY3JpcHQgb2JqZWN0IHJlZmVyZW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ganNPYmplY3RSZWZlcmVuY2UgVGhlIEphdmFTY3JpcHQgT2JqZWN0IHJlZmVyZW5jZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGlzcG9zZUpTT2JqZWN0UmVmZXJlbmNlKGpzT2JqZWN0UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBqc09iamVjdFJlZmVyZW5jZSAmJiBqc09iamVjdFJlZmVyZW5jZVtqc09iamVjdElkS2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIGlkID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIGRpc3Bvc2VKU09iamVjdFJlZmVyZW5jZUJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIERvdE5ldC5kaXNwb3NlSlNPYmplY3RSZWZlcmVuY2UgPSBkaXNwb3NlSlNPYmplY3RSZWZlcmVuY2U7XHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyB0aGUgZ2l2ZW4gSlNPTiBzdHJpbmcgdXNpbmcgcmV2aXZlcnMgdG8gcmVzdG9yZSBhcmdzIHBhc3NlZCBmcm9tIC5ORVQgdG8gSlMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGpzb24gVGhlIEpTT04gc3Rpcm5nIHRvIHBhcnNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZUpzb25XaXRoUmV2aXZlcnMoanNvbikge1xyXG4gICAgICAgIHJldHVybiBqc29uID8gSlNPTi5wYXJzZShqc29uLCAoa2V5LCBpbml0aWFsVmFsdWUpID0+IHtcclxuICAgICAgICAgICAgLy8gSW52b2tlIGVhY2ggcmV2aXZlciBpbiBvcmRlciwgcGFzc2luZyB0aGUgb3V0cHV0IGZyb20gdGhlIHByZXZpb3VzIHJldml2ZXIsXHJcbiAgICAgICAgICAgIC8vIHNvIHRoYXQgZWFjaCBvbmUgZ2V0cyBhIGNoYW5jZSB0byB0cmFuc2Zvcm0gdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIHJldHVybiBqc29uUmV2aXZlcnMucmVkdWNlKChsYXRlc3RWYWx1ZSwgcmV2aXZlcikgPT4gcmV2aXZlcihrZXksIGxhdGVzdFZhbHVlKSwgaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICB9KSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpbnZva2VQb3NzaWJsZUluc3RhbmNlTWV0aG9kKGFzc2VtYmx5TmFtZSwgbWV0aG9kSWRlbnRpZmllciwgZG90TmV0T2JqZWN0SWQsIGFyZ3MpIHtcclxuICAgICAgICBjb25zdCBkaXNwYXRjaGVyID0gZ2V0UmVxdWlyZWREaXNwYXRjaGVyKCk7XHJcbiAgICAgICAgaWYgKGRpc3BhdGNoZXIuaW52b2tlRG90TmV0RnJvbUpTKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZ3NKc29uID0gc3RyaW5naWZ5QXJncyhhcmdzKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0SnNvbiA9IGRpc3BhdGNoZXIuaW52b2tlRG90TmV0RnJvbUpTKGFzc2VtYmx5TmFtZSwgbWV0aG9kSWRlbnRpZmllciwgZG90TmV0T2JqZWN0SWQsIGFyZ3NKc29uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdEpzb24gPyBwYXJzZUpzb25XaXRoUmV2aXZlcnMocmVzdWx0SnNvbikgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY3VycmVudCBkaXNwYXRjaGVyIGRvZXMgbm90IHN1cHBvcnQgc3luY2hyb25vdXMgY2FsbHMgZnJvbSBKUyB0byAuTkVULiBVc2UgaW52b2tlTWV0aG9kQXN5bmMgaW5zdGVhZC5cIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpbnZva2VQb3NzaWJsZUluc3RhbmNlTWV0aG9kQXN5bmMoYXNzZW1ibHlOYW1lLCBtZXRob2RJZGVudGlmaWVyLCBkb3ROZXRPYmplY3RJZCwgYXJncykge1xyXG4gICAgICAgIGlmIChhc3NlbWJseU5hbWUgJiYgZG90TmV0T2JqZWN0SWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGb3IgaW5zdGFuY2UgbWV0aG9kIGNhbGxzLCBhc3NlbWJseU5hbWUgc2hvdWxkIGJlIG51bGwuIFJlY2VpdmVkICcke2Fzc2VtYmx5TmFtZX0nLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhc3luY0NhbGxJZCA9IG5leHRBc3luY0NhbGxJZCsrO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHBlbmRpbmdBc3luY0NhbGxzW2FzeW5jQ2FsbElkXSA9IHsgcmVzb2x2ZSwgcmVqZWN0IH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgYXJnc0pzb24gPSBzdHJpbmdpZnlBcmdzKGFyZ3MpO1xyXG4gICAgICAgICAgICBnZXRSZXF1aXJlZERpc3BhdGNoZXIoKS5iZWdpbkludm9rZURvdE5ldEZyb21KUyhhc3luY0NhbGxJZCwgYXNzZW1ibHlOYW1lLCBtZXRob2RJZGVudGlmaWVyLCBkb3ROZXRPYmplY3RJZCwgYXJnc0pzb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgLy8gU3luY2hyb25vdXMgZmFpbHVyZVxyXG4gICAgICAgICAgICBjb21wbGV0ZVBlbmRpbmdDYWxsKGFzeW5jQ2FsbElkLCBmYWxzZSwgZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldFJlcXVpcmVkRGlzcGF0Y2hlcigpIHtcclxuICAgICAgICBpZiAoZG90TmV0RGlzcGF0Y2hlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZG90TmV0RGlzcGF0Y2hlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gLk5FVCBjYWxsIGRpc3BhdGNoZXIgaGFzIGJlZW4gc2V0LlwiKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlUGVuZGluZ0NhbGwoYXN5bmNDYWxsSWQsIHN1Y2Nlc3MsIHJlc3VsdE9yRXJyb3IpIHtcclxuICAgICAgICBpZiAoIXBlbmRpbmdBc3luY0NhbGxzLmhhc093blByb3BlcnR5KGFzeW5jQ2FsbElkKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIHBlbmRpbmcgYXN5bmMgY2FsbCB3aXRoIElEICR7YXN5bmNDYWxsSWR9LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhc3luY0NhbGwgPSBwZW5kaW5nQXN5bmNDYWxsc1thc3luY0NhbGxJZF07XHJcbiAgICAgICAgZGVsZXRlIHBlbmRpbmdBc3luY0NhbGxzW2FzeW5jQ2FsbElkXTtcclxuICAgICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICBhc3luY0NhbGwucmVzb2x2ZShyZXN1bHRPckVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFzeW5jQ2FsbC5yZWplY3QocmVzdWx0T3JFcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXByZXNlbnRzIHRoZSB0eXBlIG9mIHJlc3VsdCBleHBlY3RlZCBmcm9tIGEgSlMgaW50ZXJvcCBjYWxsLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XHJcbiAgICBsZXQgSlNDYWxsUmVzdWx0VHlwZTtcclxuICAgIChmdW5jdGlvbiAoSlNDYWxsUmVzdWx0VHlwZSkge1xyXG4gICAgICAgIEpTQ2FsbFJlc3VsdFR5cGVbSlNDYWxsUmVzdWx0VHlwZVtcIkRlZmF1bHRcIl0gPSAwXSA9IFwiRGVmYXVsdFwiO1xyXG4gICAgICAgIEpTQ2FsbFJlc3VsdFR5cGVbSlNDYWxsUmVzdWx0VHlwZVtcIkpTT2JqZWN0UmVmZXJlbmNlXCJdID0gMV0gPSBcIkpTT2JqZWN0UmVmZXJlbmNlXCI7XHJcbiAgICAgICAgSlNDYWxsUmVzdWx0VHlwZVtKU0NhbGxSZXN1bHRUeXBlW1wiSlNTdHJlYW1SZWZlcmVuY2VcIl0gPSAyXSA9IFwiSlNTdHJlYW1SZWZlcmVuY2VcIjtcclxuICAgICAgICBKU0NhbGxSZXN1bHRUeXBlW0pTQ2FsbFJlc3VsdFR5cGVbXCJKU1ZvaWRSZXN1bHRcIl0gPSAzXSA9IFwiSlNWb2lkUmVzdWx0XCI7XHJcbiAgICB9KShKU0NhbGxSZXN1bHRUeXBlID0gRG90TmV0LkpTQ2FsbFJlc3VsdFR5cGUgfHwgKERvdE5ldC5KU0NhbGxSZXN1bHRUeXBlID0ge30pKTtcclxuICAgIC8qKlxyXG4gICAgICogUmVjZWl2ZXMgaW5jb21pbmcgY2FsbHMgZnJvbSAuTkVUIGFuZCBkaXNwYXRjaGVzIHRoZW0gdG8gSmF2YVNjcmlwdC5cclxuICAgICAqL1xyXG4gICAgRG90TmV0LmpzQ2FsbERpc3BhdGNoZXIgPSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmluZHMgdGhlIEphdmFTY3JpcHQgZnVuY3Rpb24gbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlkZW50aWZpZXIgSWRlbnRpZmllcyB0aGUgZ2xvYmFsbHktcmVhY2hhYmxlIGZ1bmN0aW9uIHRvIGJlIHJldHVybmVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXRJbnN0YW5jZUlkIFRoZSBpbnN0YW5jZSBJRCBvZiB0aGUgdGFyZ2V0IEpTIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJucyBBIEZ1bmN0aW9uIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpbmRKU0Z1bmN0aW9uLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERpc3Bvc2VzIHRoZSBKYXZhU2NyaXB0IG9iamVjdCByZWZlcmVuY2Ugd2l0aCB0aGUgc3BlY2lmaWVkIG9iamVjdCBJRC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhlIEphdmFTY3JpcHQgb2JqZWN0IHJlZmVyZW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBkaXNwb3NlSlNPYmplY3RSZWZlcmVuY2VCeUlkLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEludm9rZXMgdGhlIHNwZWNpZmllZCBzeW5jaHJvbm91cyBKYXZhU2NyaXB0IGZ1bmN0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlkZW50aWZpZXIgSWRlbnRpZmllcyB0aGUgZ2xvYmFsbHktcmVhY2hhYmxlIGZ1bmN0aW9uIHRvIGludm9rZS5cclxuICAgICAgICAgKiBAcGFyYW0gYXJnc0pzb24gSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0gcmVzdWx0VHlwZSBUaGUgdHlwZSBvZiByZXN1bHQgZXhwZWN0ZWQgZnJvbSB0aGUgSlMgaW50ZXJvcCBjYWxsLlxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXRJbnN0YW5jZUlkIFRoZSBpbnN0YW5jZSBJRCBvZiB0aGUgdGFyZ2V0IEpTIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJucyBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnZvY2F0aW9uIHJlc3VsdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpbnZva2VKU0Zyb21Eb3ROZXQ6IChpZGVudGlmaWVyLCBhcmdzSnNvbiwgcmVzdWx0VHlwZSwgdGFyZ2V0SW5zdGFuY2VJZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IGZpbmRKU0Z1bmN0aW9uKGlkZW50aWZpZXIsIHRhcmdldEluc3RhbmNlSWQpLmFwcGx5KG51bGwsIHBhcnNlSnNvbldpdGhSZXZpdmVycyhhcmdzSnNvbikpO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjcmVhdGVKU0NhbGxSZXN1bHQocmV0dXJuVmFsdWUsIHJlc3VsdFR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICA/IG51bGxcclxuICAgICAgICAgICAgICAgIDogc3RyaW5naWZ5QXJncyhyZXN1bHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW52b2tlcyB0aGUgc3BlY2lmaWVkIHN5bmNocm9ub3VzIG9yIGFzeW5jaHJvbm91cyBKYXZhU2NyaXB0IGZ1bmN0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGFzeW5jSGFuZGxlIEEgdmFsdWUgaWRlbnRpZnlpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoaXMgdmFsdWUgd2lsbCBiZSBwYXNzZWQgYmFjayBpbiBhIGxhdGVyIGNhbGwgdG8gZW5kSW52b2tlSlNGcm9tRG90TmV0LlxyXG4gICAgICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIElkZW50aWZpZXMgdGhlIGdsb2JhbGx5LXJlYWNoYWJsZSBmdW5jdGlvbiB0byBpbnZva2UuXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3NKc29uIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHJlc3VsdFR5cGUgVGhlIHR5cGUgb2YgcmVzdWx0IGV4cGVjdGVkIGZyb20gdGhlIEpTIGludGVyb3AgY2FsbC5cclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0SW5zdGFuY2VJZCBUaGUgSUQgb2YgdGhlIHRhcmdldCBKUyBvYmplY3QgaW5zdGFuY2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmVnaW5JbnZva2VKU0Zyb21Eb3ROZXQ6IChhc3luY0hhbmRsZSwgaWRlbnRpZmllciwgYXJnc0pzb24sIHJlc3VsdFR5cGUsIHRhcmdldEluc3RhbmNlSWQpID0+IHtcclxuICAgICAgICAgICAgLy8gQ29lcmNlIHN5bmNocm9ub3VzIGZ1bmN0aW9ucyBpbnRvIGFzeW5jIG9uZXMsIHBsdXMgdHJlYXRcclxuICAgICAgICAgICAgLy8gc3luY2hyb25vdXMgZXhjZXB0aW9ucyB0aGUgc2FtZSBhcyBhc3luYyBvbmVzXHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN5bmNocm9ub3VzUmVzdWx0T3JQcm9taXNlID0gZmluZEpTRnVuY3Rpb24oaWRlbnRpZmllciwgdGFyZ2V0SW5zdGFuY2VJZCkuYXBwbHkobnVsbCwgcGFyc2VKc29uV2l0aFJldml2ZXJzKGFyZ3NKc29uKSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHN5bmNocm9ub3VzUmVzdWx0T3JQcm9taXNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIFdlIG9ubHkgbGlzdGVuIGZvciBhIHJlc3VsdCBpZiB0aGUgY2FsbGVyIHdhbnRzIHRvIGJlIG5vdGlmaWVkIGFib3V0IGl0XHJcbiAgICAgICAgICAgIGlmIChhc3luY0hhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gT24gY29tcGxldGlvbiwgZGlzcGF0Y2ggcmVzdWx0IGJhY2sgdG8gLk5FVFxyXG4gICAgICAgICAgICAgICAgLy8gTm90IHVzaW5nIFwiYXdhaXRcIiBiZWNhdXNlIGl0IGNvZGVnZW5zIGEgbG90IG9mIGJvaWxlcnBsYXRlXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHN0cmluZ2lmeUFyZ3MoW2FzeW5jSGFuZGxlLCB0cnVlLCBjcmVhdGVKU0NhbGxSZXN1bHQocmVzdWx0LCByZXN1bHRUeXBlKV0pKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiBnZXRSZXF1aXJlZERpc3BhdGNoZXIoKS5lbmRJbnZva2VKU0Zyb21Eb3ROZXQoYXN5bmNIYW5kbGUsIHRydWUsIHJlc3VsdCksIGVycm9yID0+IGdldFJlcXVpcmVkRGlzcGF0Y2hlcigpLmVuZEludm9rZUpTRnJvbURvdE5ldChhc3luY0hhbmRsZSwgZmFsc2UsIEpTT04uc3RyaW5naWZ5KFtcclxuICAgICAgICAgICAgICAgICAgICBhc3luY0hhbmRsZSxcclxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXRFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgIF0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlY2VpdmVzIG5vdGlmaWNhdGlvbiB0aGF0IGFuIGFzeW5jIGNhbGwgZnJvbSBKUyB0byAuTkVUIGhhcyBjb21wbGV0ZWQuXHJcbiAgICAgICAgICogQHBhcmFtIGFzeW5jQ2FsbElkIFRoZSBpZGVudGlmaWVyIHN1cHBsaWVkIGluIGFuIGVhcmxpZXIgY2FsbCB0byBiZWdpbkludm9rZURvdE5ldEZyb21KUy5cclxuICAgICAgICAgKiBAcGFyYW0gc3VjY2VzcyBBIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGUgb3BlcmF0aW9uIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkuXHJcbiAgICAgICAgICogQHBhcmFtIHJlc3VsdEpzb25PckV4Y2VwdGlvbk1lc3NhZ2UgRWl0aGVyIHRoZSBvcGVyYXRpb24gcmVzdWx0IGFzIEpTT04sIG9yIGFuIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW5kSW52b2tlRG90TmV0RnJvbUpTOiAoYXN5bmNDYWxsSWQsIHN1Y2Nlc3MsIHJlc3VsdEpzb25PckV4Y2VwdGlvbk1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0T3JFcnJvciA9IHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgID8gcGFyc2VKc29uV2l0aFJldml2ZXJzKHJlc3VsdEpzb25PckV4Y2VwdGlvbk1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICA6IG5ldyBFcnJvcihyZXN1bHRKc29uT3JFeGNlcHRpb25NZXNzYWdlKTtcclxuICAgICAgICAgICAgY29tcGxldGVQZW5kaW5nQ2FsbChwYXJzZUludChhc3luY0NhbGxJZCwgMTApLCBzdWNjZXNzLCByZXN1bHRPckVycm9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlY2VpdmVzIG5vdGlmaWNhdGlvbiB0aGF0IGEgYnl0ZSBhcnJheSBpcyBiZWluZyB0cmFuc2ZlcnJlZCBmcm9tIC5ORVQgdG8gSlMuXHJcbiAgICAgICAgICogQHBhcmFtIGlkIFRoZSBpZGVudGlmaWVyIGZvciB0aGUgYnl0ZSBhcnJheSB1c2VkIGR1cmluZyByZXZpdmFsLlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhIFRoZSBieXRlIGFycmF5IGJlaW5nIHRyYW5zZmVycmVkIGZvciBldmVudHVhbCByZXZpdmFsLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlY2VpdmVCeXRlQXJyYXk6IChpZCwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBieXRlQXJyYXlzVG9CZVJldml2ZWQuc2V0KGlkLCBkYXRhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN1cHBsaWVzIGEgc3RyZWFtIG9mIGRhdGEgYmVpbmcgc2VudCBmcm9tIC5ORVQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RyZWFtSWQgVGhlIGlkZW50aWZpZXIgcHJldmlvdXNseSBwYXNzZWQgdG8gSlNSdW50aW1lJ3MgQmVnaW5UcmFuc21pdHRpbmdTdHJlYW0gaW4gLk5FVCBjb2RlXHJcbiAgICAgICAgICogQHBhcmFtIHN0cmVhbSBUaGUgc3RyZWFtIGRhdGEuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3VwcGx5RG90TmV0U3RyZWFtOiAoc3RyZWFtSWQsIHN0cmVhbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGVuZGluZ0RvdE5ldFRvSlNTdHJlYW1zLmhhcyhzdHJlYW1JZCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSByZWNlaXZlciBpcyBhbHJlYWR5IHdhaXRpbmcsIHNvIHdlIGNhbiByZXNvbHZlIHRoZSBwcm9taXNlIG5vdyBhbmQgc3RvcCB0cmFja2luZyB0aGlzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwZW5kaW5nU3RyZWFtID0gcGVuZGluZ0RvdE5ldFRvSlNTdHJlYW1zLmdldChzdHJlYW1JZCk7XHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nRG90TmV0VG9KU1N0cmVhbXMuZGVsZXRlKHN0cmVhbUlkKTtcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdTdHJlYW0ucmVzb2x2ZShzdHJlYW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJlY2VpdmVyIGhhc24ndCBzdGFydGVkIHdhaXRpbmcgeWV0LCBzbyB0cmFjayBhIHByZS1jb21wbGV0ZWQgZW50cnkgaXQgY2FuIGF0dGFjaCB0byBsYXRlclxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGVuZGluZ1N0cmVhbSA9IG5ldyBQZW5kaW5nU3RyZWFtKCk7XHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nU3RyZWFtLnJlc29sdmUoc3RyZWFtKTtcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdEb3ROZXRUb0pTU3RyZWFtcy5zZXQoc3RyZWFtSWQsIHBlbmRpbmdTdHJlYW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIGZvcm1hdEVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2Vycm9yLm1lc3NhZ2V9XFxuJHtlcnJvci5zdGFja31gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXJyb3IgPyBlcnJvci50b1N0cmluZygpIDogXCJudWxsXCI7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmaW5kSlNGdW5jdGlvbihpZGVudGlmaWVyLCB0YXJnZXRJbnN0YW5jZUlkKSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0SW5zdGFuY2UgPSBjYWNoZWRKU09iamVjdHNCeUlkW3RhcmdldEluc3RhbmNlSWRdO1xyXG4gICAgICAgIGlmICh0YXJnZXRJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0SW5zdGFuY2UuZmluZEZ1bmN0aW9uKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEpTIG9iamVjdCBpbnN0YW5jZSB3aXRoIElEICR7dGFyZ2V0SW5zdGFuY2VJZH0gZG9lcyBub3QgZXhpc3QgKGhhcyBpdCBiZWVuIGRpc3Bvc2VkPykuYCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkaXNwb3NlSlNPYmplY3RSZWZlcmVuY2VCeUlkKGlkKSB7XHJcbiAgICAgICAgZGVsZXRlIGNhY2hlZEpTT2JqZWN0c0J5SWRbaWRdO1xyXG4gICAgfVxyXG4gICAgY2xhc3MgRG90TmV0T2JqZWN0IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHktZnVuY3Rpb25cclxuICAgICAgICBjb25zdHJ1Y3RvcihfaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faWQgPSBfaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGludm9rZU1ldGhvZChtZXRob2RJZGVudGlmaWVyLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnZva2VQb3NzaWJsZUluc3RhbmNlTWV0aG9kKG51bGwsIG1ldGhvZElkZW50aWZpZXIsIHRoaXMuX2lkLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW52b2tlTWV0aG9kQXN5bmMobWV0aG9kSWRlbnRpZmllciwgLi4uYXJncykge1xyXG4gICAgICAgICAgICByZXR1cm4gaW52b2tlUG9zc2libGVJbnN0YW5jZU1ldGhvZEFzeW5jKG51bGwsIG1ldGhvZElkZW50aWZpZXIsIHRoaXMuX2lkLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcG9zZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IGludm9rZVBvc3NpYmxlSW5zdGFuY2VNZXRob2RBc3luYyhudWxsLCBcIl9fRGlzcG9zZVwiLCB0aGlzLl9pZCwgbnVsbCk7XHJcbiAgICAgICAgICAgIHByb21pc2UuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXJpYWxpemVBc0FyZygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgX19kb3ROZXRPYmplY3Q6IHRoaXMuX2lkIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgRG90TmV0LkRvdE5ldE9iamVjdCA9IERvdE5ldE9iamVjdDtcclxuICAgIGF0dGFjaFJldml2ZXIoZnVuY3Rpb24gcmV2aXZlUmVmZXJlbmNlKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShkb3ROZXRPYmplY3RSZWZLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERvdE5ldE9iamVjdCh2YWx1ZVtkb3ROZXRPYmplY3RSZWZLZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShqc09iamVjdElkS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSB2YWx1ZVtqc09iamVjdElkS2V5XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzT2JqZWN0ID0gY2FjaGVkSlNPYmplY3RzQnlJZFtpZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoanNPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNPYmplY3QuZ2V0V3JhcHBlZE9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBKUyBvYmplY3QgaW5zdGFuY2Ugd2l0aCBJZCAnJHtpZH0nIGRvZXMgbm90IGV4aXN0LiBJdCBtYXkgaGF2ZSBiZWVuIGRpc3Bvc2VkLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGJ5dGVBcnJheVJlZktleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWVbYnl0ZUFycmF5UmVmS2V5XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IGJ5dGVBcnJheXNUb0JlUmV2aXZlZC5nZXQoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ5dGVBcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBCeXRlIGFycmF5IGluZGV4ICcke2luZGV4fScgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBieXRlQXJyYXlzVG9CZVJldml2ZWQuZGVsZXRlKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBieXRlQXJyYXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoZG90TmV0U3RyZWFtUmVmS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEb3ROZXRTdHJlYW0odmFsdWVbZG90TmV0U3RyZWFtUmVmS2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVW5yZWNvZ25pemVkIC0gbGV0IGFub3RoZXIgcmV2aXZlciBoYW5kbGUgaXRcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9KTtcclxuICAgIGNsYXNzIERvdE5ldFN0cmVhbSB7XHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RyZWFtSWQpIHtcclxuICAgICAgICAgICAgLy8gVGhpcyBjb25zdHJ1Y3RvciBydW5zIHdoZW4gd2UncmUgSlNPTi1kZXNlcmlhbGl6aW5nIHNvbWUgdmFsdWUgZnJvbSB0aGUgLk5FVCBzaWRlLlxyXG4gICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIG1pZ2h0IGFscmVhZHkgaGF2ZSBzdGFydGVkIHJlY2VpdmluZyB0aGUgc3RyZWFtLCBvciBtYXliZSBpdCB3aWxsIGNvbWUgbGF0ZXIuXHJcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gaGFuZGxlIGJvdGggcG9zc2libGUgb3JkZXJpbmdzLCBidXQgd2UgY2FuIGNvdW50IG9uIGl0IGNvbWluZyBldmVudHVhbGx5IGJlY2F1c2VcclxuICAgICAgICAgICAgLy8gaXQncyBub3Qgc29tZXRoaW5nIHRoZSBkZXZlbG9wZXIgZ2V0cyB0byBjb250cm9sLCBhbmQgaXQgd291bGQgYmUgYW4gZXJyb3IgaWYgaXQgZG9lc24ndC5cclxuICAgICAgICAgICAgaWYgKHBlbmRpbmdEb3ROZXRUb0pTU3RyZWFtcy5oYXMoc3RyZWFtSWQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSd2ZSBhbHJlYWR5IHN0YXJ0ZWQgcmVjZWl2aW5nIHRoZSBzdHJlYW0sIHNvIG5vIGxvbmdlciBuZWVkIHRvIHRyYWNrIGl0IGFzIHBlbmRpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmVhbVByb21pc2UgPSBwZW5kaW5nRG90TmV0VG9KU1N0cmVhbXMuZ2V0KHN0cmVhbUlkKS5zdHJlYW1Qcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgcGVuZGluZ0RvdE5ldFRvSlNTdHJlYW1zLmRlbGV0ZShzdHJlYW1JZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlbid0IHN0YXJ0ZWQgcmVjZWl2aW5nIGl0IHlldCwgc28gYWRkIGFuIGVudHJ5IHRvIHRyYWNrIGl0IGFzIHBlbmRpbmdcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdTdHJlYW0gPSBuZXcgUGVuZGluZ1N0cmVhbSgpO1xyXG4gICAgICAgICAgICAgICAgcGVuZGluZ0RvdE5ldFRvSlNTdHJlYW1zLnNldChzdHJlYW1JZCwgcGVuZGluZ1N0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHJlYW1Qcm9taXNlID0gcGVuZGluZ1N0cmVhbS5zdHJlYW1Qcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN1cHBsaWVzIGEgcmVhZGFibGUgc3RyZWFtIG9mIGRhdGEgYmVpbmcgc2VudCBmcm9tIC5ORVQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RyZWFtKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RyZWFtUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3VwcGxpZXMgYSBhcnJheSBidWZmZXIgb2YgZGF0YSBiZWluZyBzZW50IGZyb20gLk5FVC5cclxuICAgICAgICAgKiBOb3RlIHRoZXJlIGlzIGEgSmF2YVNjcmlwdCBsaW1pdCBvbiB0aGUgc2l6ZSBvZiB0aGUgQXJyYXlCdWZmZXIgZXF1YWwgdG8gYXBwcm94aW1hdGVseSAyR0IuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYXN5bmMgYXJyYXlCdWZmZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoYXdhaXQgdGhpcy5zdHJlYW0oKSkuYXJyYXlCdWZmZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGFzcyBQZW5kaW5nU3RyZWFtIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHJlYW1Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjcmVhdGVKU0NhbGxSZXN1bHQocmV0dXJuVmFsdWUsIHJlc3VsdFR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHJlc3VsdFR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBKU0NhbGxSZXN1bHRUeXBlLkRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICAgICAgICAgIGNhc2UgSlNDYWxsUmVzdWx0VHlwZS5KU09iamVjdFJlZmVyZW5jZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVKU09iamVjdFJlZmVyZW5jZShyZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgSlNDYWxsUmVzdWx0VHlwZS5KU1N0cmVhbVJlZmVyZW5jZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVKU1N0cmVhbVJlZmVyZW5jZShyZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgSlNDYWxsUmVzdWx0VHlwZS5KU1ZvaWRSZXN1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBKUyBjYWxsIHJlc3VsdCB0eXBlICcke3Jlc3VsdFR5cGV9Jy5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgbmV4dEJ5dGVBcnJheUluZGV4ID0gMDtcclxuICAgIGZ1bmN0aW9uIHN0cmluZ2lmeUFyZ3MoYXJncykge1xyXG4gICAgICAgIG5leHRCeXRlQXJyYXlJbmRleCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3MsIGFyZ1JlcGxhY2VyKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFyZ1JlcGxhY2VyKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEb3ROZXRPYmplY3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnNlcmlhbGl6ZUFzQXJnKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xyXG4gICAgICAgICAgICBkb3ROZXREaXNwYXRjaGVyLnNlbmRCeXRlQXJyYXkobmV4dEJ5dGVBcnJheUluZGV4LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGpzb25WYWx1ZSA9IHsgW2J5dGVBcnJheVJlZktleV06IG5leHRCeXRlQXJyYXlJbmRleCB9O1xyXG4gICAgICAgICAgICBuZXh0Qnl0ZUFycmF5SW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIGpzb25WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG59KShEb3ROZXQgfHwgKERvdE5ldCA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1pY3Jvc29mdC5KU0ludGVyb3AuanMubWFwIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgKiBmcm9tIFwiQG1pY3Jvc29mdC9kb3RuZXQtanMtaW50ZXJvcFwiOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==