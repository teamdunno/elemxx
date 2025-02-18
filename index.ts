// A simple, portable webcomponent on the go. Refer to docs for more info https://github.com/teamdunno/elemxx#readme
/**
 * @author teamdunno <https://github.com/teamdunno>
 * @license MIT
 * @module
 */

// -_-

/** 
 * Detach reference from existing object (only function that returns the same reference)
 * 
 * @param val The object
 * @returns New reference from the object
 * @throws TypeError on worse case (if `typeof value` dosent provide anything, or forcefully put the value as `function`)
*/
export function detachRef<T extends unknown>(val:T):T {
    switch (typeof val) {
        case "function":{
            return val as T
        }
        case "string": {
            return val.valueOf() as T
        }
        case "number": {
            return val.valueOf() as T
        }
        case "bigint": {
            return val.valueOf() as T
        }
        case "boolean": {
            return val.valueOf() as T
        }
        case "symbol": {
            return val.valueOf() as T
        }
        case "undefined": {
            return undefined as T
        }
        case "object": {
            switch (Array.isArray(val)) {
                case true: {
                    return [...val as unknown[]] as T
                }
                default: {
                    if (val === null) {
                        return null as T
                    }
                    return { ...val }
                }
            }
        }
        default: {
            throw new TypeError("elemxx detachRef: typeof keyword dosent provide anything to detach from")
        }
    }
}
/** `Track` interace. Used in {@link Elemxx.track} */
export interface Track<T>{
    /** The value */
    value: T;
    /**
     * Listen only on object changes
     * @param func The function that wants to listen to
     */
    watch(func:(value:T)=>void):void;
    /**
     * Trigger once and listen on object changes
     * @param func The function that wants to listen to
     */
    observe(func:(value:T)=>void):void;
    /**
     * Remove event by function reference
     * @param func The function that wants to remove from
     */
    remove(func:(value:T)=>void):void;
    /** Remove all events */
    removeAll():void;
}
/** A simple, portable webcomponent on the go */
export class Elemxx extends HTMLElement {
    /** CSS string for the elem. It would be appended to DOM if set */
    static css?:string=undefined;
    /** Attribute list. If defined, {@link Track} will be added alongside the name to the {@link Elemxx.attrs}, and not cleaned on unmounted */
    static attrList?:string[]=undefined;
    /** Shorthand for {@link https://developer.mozilla.org/docs/Web/API/Node/isConnected HTMLElement.isConnected} */
    protected mounted:boolean = false;
    /** use {@link Elemxx.attrs} insead */
    public static observedAttributes=this.attrList;
    /** Attributes that are defined in {@link Elemxx.attrList}. Not cleaned when unmounted unlike normal trackers on {@link Elemxx.track} */
    public readonly attrs:Record<string, Track<string|null>> = {}
    private _EXX_TRACKERS:Track<unknown>[] = []
    /** Run this function on mounted */
    onMount(){};
    /** Run this function on unmounted */
    onUnmount(){};
    constructor() {
        super();
        const proto = ()=>Object.getPrototypeOf(this)
        proto().css = proto().css.replace(/:me/g, this.localName)
        const attrList = proto().attrList as string[]
        if (attrList.length>0) {
            for (let i=0;i<attrList.length;i++) {
                const name = attrList[i]
                this.attrs[name] = this.track<string|null>(this.getAttribute(name), true)
            }
        }
        // TODO: freeze these
        // Object.freeze(proto().css)
        // Object.freeze(proto().attrList)
        // Object.freeze(this.onMount)
        // Object.freeze(this.onUnmount)
    }
    /** use {@link Elemxx.attrs} instead */
    public attributeChangedCallback(k:string, _:string|null, n:string|null) {
        if (typeof this.attrs[k] === "undefined") return
        this.attrs[k].value = n
    }
    /** 
     * Track the changes of value
     * 
     * @param value The value
     * @param keep (default: `false`) Prevent removal of events when elem was unmounted
     * @returns [{@link Track}] object
     */
    protected track<T>(value:T, keep:boolean=false): Track<T>  {
        let evs:((value: T) => void)[] = []
        let v:T=value;
        const t:Track<T> = {
          get value(){
            return v
          },
          set value(newValue:T){
            v = newValue
          },
          watch: function (func: (value: T) => void): void {
            evs.push(func)
          },
          observe: function (func: (value: T) => void): void {
            func(v)
            evs.push(func)
          },
          remove: function (func: (value: T) => void): void {
            evs = evs.filter((t)=>t!==func)
          },
          removeAll: function (): void {
            evs = []
          }
        }
        if (!keep) {
            this._EXX_TRACKERS.push(t)
        }
        return t
    }
    /** use {@link Elemxx.onMount} instead */
    public connectedCallback() {
        this.mounted = true
        const proto = ()=>Object.getPrototypeOf(this)
        if (proto().css) {
            const stychild = document.createElement("style")
            stychild.innerHTML = proto().css
            this.appendChild(stychild)
        }
        if (this.onMount) this.onMount()
    }
    /** use {@link Elemxx.onUnmount} instead */
    public disconnectedCallback() {
        this.mounted = false
        if (this._EXX_TRACKERS.length>0) {
            for (let i=0;i<this._EXX_TRACKERS.length;i++) {
                this._EXX_TRACKERS[i].removeAll()
            }
        }
        if (this.onUnmount) this.onUnmount()
    }
}