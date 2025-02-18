/**
 * A simple, portable webcomponent on the go
 * @author teamdunno <https://github.com/teamdunno>
 * @license MIT
 * @module
 */

import { Elemxx } from "./index.ts";
/** check if target was Elemxx */
const checkTarget = (target: unknown) => {
    const t = Object.getPrototypeOf(target)
    if (t! instanceof Elemxx) throw new TypeError("Elemxx decorator target only can be applied to Elemxx itself")
}
/** decorator context */
type ElemxxDecoratorContext<T = Elemxx> = ClassDecoratorContext<{ new(...args: unknown[]): T }>
/** decorator function */
type DecoratorFunc<T extends Elemxx> = (target: unknown, c: ElemxxDecoratorContext<T>) => void
/** 
 * Add the elem to {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements customElements} right after initialized
 * 
 * @param name - The name. If `undefined` and the class dosent get {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class anonymized},
 * it would try to get the class prototype name (not recommended if using bundlers). Or else;
 * 
 * @throws `TypeError` if the decorator cant find any provided names
 */
export const define: <T extends Elemxx>(name?: string) => DecoratorFunc<T> = <T extends Elemxx>(name?: string) => (target: unknown, c: ElemxxDecoratorContext<T>) => {
    checkTarget(target)
    c.addInitializer(function () {
        let n: string;
        if (name && !c.name) n = name
        else if (!name && c.name) n = c.name.replace(/_/g, "-")
        else throw new TypeError("Elemxx `define` decorator: Cant find any elem names")
        return customElements.define(n, this);
    })
};
/** 
 * Add attribute list to static Elemxx
 * 
 * @param list The attribute list
 */
export const attrList: <T extends Elemxx>(list: string[]) => DecoratorFunc<T> = <T extends Elemxx>(list: string[]) => (target: unknown, _c: ElemxxDecoratorContext<T>) => {
    checkTarget(target)
    Object.getPrototypeOf(target).observedAttributes = list
};
/** 
 * Add CSS to static Elemxx
 * 
 * @param css The CSS string
 */
export const css: <T extends Elemxx>(css: string) => DecoratorFunc<T> = <T extends Elemxx>(css: string) => (target: unknown, _c: ElemxxDecoratorContext<T>) => {
    checkTarget(target)
    Object.getPrototypeOf(target).css = css
};