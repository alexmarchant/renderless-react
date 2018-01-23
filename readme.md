The ReverseReactComponent will let you build plain html and then hook a React component up to it. No JSX or render function. Just hook up your event callbacks like `onClick` using `data` attributes, and render dynamic text using curly braces `{}` like in JSX.

ReverseReactComponent reads the DOM and builds out its own tree of React elements to match what it sees. Kinda like server rendering.

### Example

The following example will render two buttons, `Add` increments and `Clear` clears `this.state.count`. That count is dynamicly reflected above the buttons in `Count: {this.state.count}`. Open `examples/Counter.html` in a browser to see this working (no webpack or anything needed, React loads from a CDN).

```html
<!-- Counter.html -->
<div id="container">
  <div>
    <p>Count: {this.state.count}</p>
    <p>
      <button data-react-on-click="this.add">
        Add
      </button>
      <button data-react-on-click="this.clear">
        Clear
      </button>
    </p>
  </div>
</div>
```

```js
// Counter.js
class Counter extends ReverseReactComponent {
  constructor(props) {
    super(props)

    this.state = {
      count: 0,
    }

    this.add = this.add.bind(this)
    this.clear = this.clear.bind(this)
  }

  add() {
    this.setState({count: this.state.count + 1})
  }

  clear() {
    this.setState({count: 0})
  }
}
```

**Code to render the component**

```js
const container = document.getElementById('container')
const element = React.createElement(Counter, {container: container})
ReactDOM.hydrate(element, container)
```

Note: Use `hydrate` instead of `render`. Also, pass the parent of the target you'd like to bind to you React component as `container`.

### Attributes

Attributes that start with `data-react-XXX` will be passed to react components and evaluated. Hyphens will be converted to camel case. e.g. `<button data-react-on-click="this.handleClick"></button>` will render a button with an `onClick` prop that will eval `this.handleClick`. `this` of course revers to the bound main component.

Note: as in normal React you'll likely need to bind event handlers in the `constructor`.

### Dynamic Text

Just use curly braces to render dynamic text. e.g. `<button>{this.state.buttonText}</button>` will do what you'd expect.

### Limitations

- Can't handle elements inside javascript blocks. I.e. can't use map.
- Can't use nested components.
- Currently getting some React errors that we aren't matching up text nodes correctly. Probably just need to work on the text node parsing.
