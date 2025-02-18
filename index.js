/// <reference types="index.ts" />

/**
 * The superb portable webcomponent kit!
 * @author teamdunno
 * @license MIT
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
/** The superb portable webcomponent kit! */ export class Elemxx extends HTMLElement {
  /** use {@link Elemxx.attrs} insead */ static observedAttributes = this.attrList;
  /** Attributes that are defined in {@link Elemxx.attrList} */ attrs = {};
  _EXX_TRACKERS = [];
  onMount() {}
  onUnmount() {}
  constructor(){
    super();
    const proto = ()=>Object.getPrototypeOf(this);
    proto().css = proto().css.replace(/:me/g, this.localName);
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
        evs = evs.filter((t)=>t === func);
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
    const proto = ()=>Object.getPrototypeOf(this);
    if (proto().css) {
      const stychild = document.createElement("style");
      stychild.innerHTML = proto().css;
      this.appendChild(stychild);
    }
    if (this.onMount) this.onMount();
  }
  /** use {@link Elemxx.onUnmount} instead */ disconnectedCallback() {
    if (this.onUnmount) this.onUnmount();
  }
}
