class Form extends Renderless {
  constructor(props) {
    super(props)

    this.defaultMessage = 'This is a fake form, its not making any network calls.'

    this.state = {
      first: '',
      second: '',
      sending: false,
      message: this.defaultMessage,
    }

    this.submit = this.submit.bind(this)
    this.inputChange = this.inputChange.bind(this)
  }

  inputChange(event) {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    })
  }

  submit(event) {
    event.preventDefault()

    this.setState({
      sending: true,
      message: this.defaultMessage,
    })

    setTimeout(() => {
      this.setState({
        sending: false,
        message: 'Form sent successfully!',
        first: '',
        second: '',
      })
    }, 1500)
  }
}

const container = document.getElementById('container')
const element = React.createElement(Form, {container: container})
ReactDOM.hydrate(element, container)
