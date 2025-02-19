> Note: <0.5.2 is unstable. This version is the most stable

# Elemxx

A simple, portable webcomponent on the go. Heavily inspired by [Lit](https://github.com/lit/lit)

It dosen't uses shadow dom, directly exposing [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) class, and some reactive objects!

The difference? (comparing to Lit)

- Since we dosen't use shadow dom, the `static Elemxx.css` object has `:me` directive
> Or, you can even use your own styling processor, and replace your own directive with [`Elemxx.localName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName)!

- We use event-based object (without using EventEmitter) to make it reactive. Like, getter and setters, and simple array of listening event functions. We do have cleanup for those events
<details>
<summary>Example</summary>

```js
// define & extend your class from Elemxx
...
// add the Track object here
areYouOk = this.track("yes, i am!")
...
// so, whenever you want to print to console 
// everytime it was changed, you can do this
this.areYouOk.watch((v)=>{console.log(v)})
// alternatively, you can access the value directly
console.log(this.areYouOk.value)

// now, you can change it like this. 
// It would trigger the events that we put earlier
this.areYouOk.value = "no, im not 😭"
...
// close the class
```
</details>

> Consider looking the [`Track` interface type in ./index.ts](./index.ts)

- Your element is ok! Dosen't really isolated from HTMLElement bindings 

- Webcomponent replacement functions and objects! (no need for `super[function here]()`)
  - Instead of `connectedCallback`, you can use `onMount`
  - Instead of `disconnectedCallback`, you can use `onUnmount`
  - Instead of `(string[]) observedAttributes`, you can use `attrList`
  - Instead of `attributeChangedCallback`, you can use `({[key:string]:Track<string|null>}) attrs` and listen using `attrs["<attribute name>"].watch((value)=>{})`
  - Instead of `(boolean) isConnected`, you can use `(boolean) mounted`. It would be changed during mount changes

## Usage

### Browser

You can use the raw version of [./index.js](./index.js) by downloading it (don't forget to obtain the [./LICENSE](./LICENSE) file 😉), or
use the Github CDN
https://raw.githubusercontent.com/teamdunno/elemxx/refs/heads/main/index.js

> Also, no `d.ts`. since we use [jsr:@deno/emit](https://jsr.io/@deno/emit) to
> transpile `index.ts`

### Installation for Nodejs

For npm

```shell
$ npx jsr add @dunno/elemxx
```

For Yarn

> Note: You need to upgrade to v4+, because when installing Yarn, the
> distribution for Linux only sticks to v1 (thats why the `dlx` command dosent
> found)
>
> ```shell
> $ yarn upgrade
> ```

```shell
$ yarn dlx jsr add @dunno/elemxx
```

For pnpm

```shell
$ pnpm dlx jsr add @dunno/elemxx
```

### Installation for non-Nodejs

For Bun

```
$ bunx jsr add @dunno/elemxx
```

For Deno

```
$ deno add jsr:@dunno/elemxx
```

## Examples

### Javascript examples

#### Typing animation

<details>

```js
// replace /path/to/elemxx/index.js with the imported elemxx module
import { Elemxx } from "/path/to/elemxx/index.js";
// define simple sleep function, instead of nesting in setTimeout
const sleep = (ms)=>new Promise((res, _)=>setTimeout(res, ms))
// make the new typing elem
class TypingAnim extends Elemxx {
    // this would make a new Track object called `this.attrs.sentence`
    static attrList = ["sentence"]
    // track the text
    sentence = ""
    _text = this.track("")
    // this will stop the animation if set otherwise
    _anim = this.track(true)
    // the css style
    static css = `
        @keyframes blinkTextCursor {
            from{color: black;}
            to{color: transparent;}
        } 
        // the :me is a special directive to reference itself
        // since elemxx dosent use shadow dom
        :me {
            display:flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        :me > h2 {
            text-shadow: gray 0px 1px 1px;
        } 
        :me > h2 > span.cursor {
            animation: blinkTextCursor 0.8s steps(44) infinite normal;  
        }
    `;
    constructor() {
        super();
        // since `this.attrs` dosent cleaned when unmounted, we put them in here
        // so it dosent re-trigger on mount changes

        // by the way, this only listen. Dosent trigger once
        this.attrs.sentence.watch((value)=>{
            // if elem isnt mounted, return
            if (!this.mounted) return
            // we need to require users to use the `sentence` attribute
            if (value===null) throw new TypeError("attribute `sentence` is required")
            // set to our own sentence object
            this.sentence = value
        })
    }
    render() {
        // create new header text
        const h2 = document.createElement("h2")
        // create new span (for text)
        const animText = document.createElement("span")
        // add to header
        h2.appendChild(animText)

        // create new span (for cursor)
        const cursor = document.createElement("span")
        // add cursor class so the CSS pick up
        cursor.classList.add("cursor")
        cursor.innerText = "|"

        // add to header
        h2.appendChild(cursor)
        // set innerText once, and listen to set innerText again
        // (just like doWhile without looping)
        this._text.observe((text) => {
            animText.innerText = text
        })

        const button = document.createElement("button")
        button.addEventListener("click", () => this._toggle())

        // set the button text and trigger animation if true, and listen to set that again
        // (just like doWhile without looping)
        this._anim.observe((v) => {
            button.innerText = v ? "Stop animation" : "Play animation"
            if (v) this._triggerAnim()
        })

        // add header to :me
        this.appendChild(h2)
        // add button to :me
        this.appendChild(button)
    }
    // if mounted, render the element
    onMount () {
        this.render()
    }
    // if unmounted, stop the animation
    onUnmount () {
        this._anim.value = false
    }
    // trigger animation
    async _triggerAnim() {
        while (this._anim.value) {
            const sentence = this.sentence
            await sleep(2000)
            for (let i = 0; i <= sentence.length; i++) {
                this._text.value = sentence.substring(0, i)
                await sleep(150)
                if (!this._anim.value) return
            }
            await sleep(3000)
            if (!this._anim) return
            for (let i = sentence.length; i >= 0; i--) {
                this._text.value = sentence.substring(0, i)
                await sleep(50)
                if (!this._anim.value) return
            }
            await sleep(500)
            if (!this._anim.value) return
        }
    }
    // toggle the animation to play/stop
    _toggle() {
        this._anim.value = !this._anim.value
    }
};
customElements.define("typing-anim", TypingAnim)
```

<details>
<summary>HTML</summary>

```html
<html>
  <head>
    <!-- add the script -->
    <script type="module" src="/path/to/script.js"></script>
  </head>
  <body>
    <!-- add our custom elem -->
    <typing-anim sentence="Hello World"></typing-anim>
  </body>
</html>
```

</details>

</details>

### Typescript examples

#### Simple text (with decorators)

<details>
<summary>Quote from the founder</summary>

> Quote from [vintheweirdass](https://github.com/vintheweirdass) (founder of this package)
>> "For decorators: idk for nodejs users. Since i use Deno, it was enabled automatically. If nodejs users wants to volunteer on this, sure :\)"
</details>

<details>

```ts
import { Elemxx } from "@dunno/elemxx";
import { css, define } from "@dunno/elemxx/decorators";

@define("simple-hello")
@css(`
    :me {
        background-color:#FFEBCD;
        padding: 10px;
        border-radius: 10px;
        font-size: larger;
    }
`)
export class SimpleHello extends Elemxx {
    override onMount (){
        // create new span
        const span = document.createElement("span")
        // add text to span
        span.innerText = "hello everyone!"
        // add span to :me
        this.appendChild(span)
    }
}
```
</details>
