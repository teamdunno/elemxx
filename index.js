/// <reference types="./index.ts" />

/**
 * A simple, portable webcomponent on the go
 * @author teamdunno <https://github.com/teamdunno>
 * @license MIT
 * @module
 */ /** 
 * Detach reference from existing object (only function that returns the same reference)
 * 
 * @param val The object
 * @returns New reference from the object
 * @throws TypeError on worse case (if `typeof value` dosent provide anything, or forcefully put the value as `function`)
*/ export function detachRef(val) {
  switch(typeof val){
    case "function":
      {
        return val;
      }
    case "string":
      {
        return val.valueOf();
      }
    case "number":
      {
        return val.valueOf();
      }
    case "bigint":
      {
        return val.valueOf();
      }
    case "boolean":
      {
        return val.valueOf();
      }
    case "symbol":
      {
        return val.valueOf();
      }
    case "undefined":
      {
        return undefined;
      }
    case "object":
      {
        switch(Array.isArray(val)){
          case true:
            {
              return [
                ...val
              ];
            }
          default:
            {
              if (val === null) {
                return null;
              }
              return {
                ...val
              };
            }
        }
      }
    default:
      {
        throw new TypeError("elemxx detachRef: typeof keyword dosent provide anything to detach from");
      }
  }
}
/** A simple, portable webcomponent on the go */ export class Elemxx extends HTMLElement {
  /** CSS string for the elem. It would be appended to DOM if set */ static css = undefined;
  /** Attribute list. If defined, {@link Track} will be added alongside the name to the {@link Elemxx.attrs}, and not cleaned on unmounted */ static attrList = undefined;
  /** Shorthand for {@link https://developer.mozilla.org/docs/Web/API/Node/isConnected HTMLElement.isConnected} */ mounted = false;
  /** use {@link Elemxx.attrs} insead */ static observedAttributes = this.attrList;
  /** Attributes that are defined in {@link Elemxx.attrList}. Not cleaned when unmounted unlike normal trackers on {@link Elemxx.track} */ attrs = {};
  _EXX_TRACKERS = [];
  /** Run this function on mounted */ onMount() {}
  /** Run this function on unmounted */ onUnmount() {}
  constructor(){
    super();
    const proto = ()=>Object.getPrototypeOf(this);
    proto().css = proto().css.replace(/:me/g, this.localName);
    const attrList = proto().attrList;
    if (attrList.length > 0) {
      for(let i = 0; i < attrList.length; i++){
        const name = attrList[i];
        this.attrs[name] = this.track(this.getAttribute(name), true);
      }
    }
  // TODO: freeze these
  // Object.freeze(proto().css)
  // Object.freeze(proto().attrList)
  // Object.freeze(this.onMount)
  // Object.freeze(this.onUnmount)
  }
  /** use {@link Elemxx.attrs} instead */ attributeChangedCallback(k, _, n) {
    if (typeof this.attrs[k] === "undefined") return;
    this.attrs[k].value = n;
  }
  /** 
     * Track the changes of value
     * 
     * @param value The value
     * @param keep (default: `false`) Prevent removal of events when elem was unmounted
     * @returns [{@link Track}] object
     */ track(value, keep = false) {
    let evs = [];
    let v = value;
    const t = {
      get value () {
        return v;
      },
      set value (newValue){
        v = newValue;
      },
      watch: function(func) {
        evs.push(func);
      },
      observe: function(func) {
        func(v);
        evs.push(func);
      },
      remove: function(func) {
        evs = evs.filter((t)=>t !== func);
      },
      removeAll: function() {
        evs = [];
      }
    };
    if (!keep) {
      this._EXX_TRACKERS.push(t);
    }
    return t;
  }
  /** use {@link Elemxx.onMount} instead */ connectedCallback() {
    this.mounted = true;
    const proto = ()=>Object.getPrototypeOf(this);
    if (proto().css) {
      const stychild = document.createElement("style");
      stychild.innerHTML = proto().css;
      this.appendChild(stychild);
    }
    if (this.onMount) this.onMount();
  }
  /** use {@link Elemxx.onUnmount} instead */ disconnectedCallback() {
    this.mounted = false;
    if (this._EXX_TRACKERS.length > 0) {
      for(let i = 0; i < this._EXX_TRACKERS.length; i++){
        this._EXX_TRACKERS[i].removeAll();
      }
    }
    if (this.onUnmount) this.onUnmount();
  }
}
