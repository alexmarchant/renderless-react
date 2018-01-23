const e = React.createElement

const attributeNamesMap = {
  'class': 'className',
  'for': 'htmlFor',
}

class Renderless extends React.Component {
  constructor(props) {
    super(props)

    this.root = this.props.container.children[0]
    // Save a copy of the original dom contents as our
    // template, without this saved copy we would be parsing
    // the output from react
    this.rootClone = this.root.cloneNode(true)
  }

  parseNode(node) {
    switch (node.nodeName) {
      case '#text':
        return this.parseTextNode(node)
      default:
        return this.parseElementNode(node)
    }
  }

  nodeAttributes(node) {
    // Run through the attributes and make them work
    // with react
    return Array.from(node.attributes)
      .reduce((accumulator, attr) => (Object.assign(
        accumulator,
        this.parseAttribute(attr)
      )), {})
  }

  parseAttribute(attr) {
    let name = attr.name

    // Map attributes to react friendly names
    if (attributeNamesMap[name]) { name = attributeNamesMap[name] }

    // Save original attr so that the react render
    // matches the origin dom node
    const reactAttributes = {[name]: attr.value}

    // Replace data-react attributes with camelcase
    // versions and eval the value
    if (name.search('data-react-') !== -1) {
      name = name.replace('data-react-', '')
      name = this.hypenToCamelCase(name)
      reactAttributes[name] = eval(attr.value)
    }

    return reactAttributes
  }

  hypenToCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  parseChildren(node) {
    return Array
      .from(node.childNodes)
      .map((child) => this.parseNode(child)) 
  }

  parseTextNode(node) {
    // Split up text nodes into an array by curly braces
    const parts = node.wholeText.split(/({.*?})/)

    // Replace curly brace content with eval'ed results
    return parts
      .map((part) => {
        const match = part.match(/{(.*?)}/)
        if (match) {
          const exp = match[1]
          return eval(exp)
        }
        return part
      })
  }

  parseElementNode(node) {
    return e(
      node.tagName.toLowerCase(),
      this.nodeAttributes(node),
      ...this.parseChildren(node)
    )
  }

  render() {
    return this.parseNode(this.rootClone)
  }
}
