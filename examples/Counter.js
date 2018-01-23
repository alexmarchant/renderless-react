class Counter extends Renderless {
  constructor(props) {
    super(props)

    this.state = {count: 0}

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

const container = document.getElementById('container')
const element = React.createElement(Counter, {container: container})
ReactDOM.hydrate(element, container)
