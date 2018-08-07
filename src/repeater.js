import { Component } from 'preact'
import { Subscribe, Container } from 'unstated'
import Sortable from 'react-sortablejs'
import Location from './location.js'
import dset from 'dset'

class RepeaterContainer extends Container {
  constructor(initialValue, location) {
    super()
    this.location = location
    this.state = {
      value: initialValue || []
    }
  }
  add = (name, after) => {
    this.setState(state => {
      let nextValue = state.value.concat([])
      if (typeof after !== 'undefined') {
        nextValue.splice(after + 1, 0, { name, $children: {} })
      } else {
        nextValue.push({ name, $children: {} })
      }
      dset(window.expose.data, this.location, nextValue)
      return { value: nextValue }
    }, this.broadcast)
  }
  move = (from, to, location) => {
    this.setState(state => {
      let nextValue = state.value.concat([])
      nextValue.splice(to, 0, nextValue.splice(from, 1)[0])
      dset(window.expose.data, location, nextValue)
      return { value: nextValue }
    })
  }
}

export default class Repeater extends Component {
  constructor(props) {
    super(props)
    let container
    if (window.expose.containers[props.name]) {
      container = window.expose.containers[props.name]
    } else {
      container = window.expose.containers[props.name] = new RepeaterContainer(
        window.expose.data[props.name],
        props.name
      )
    }
    this.state = { container }
    this.dragging = false
  }
  render() {
    return (
      <Subscribe to={[this.state.container]}>
        {c => (
          <Sortable
            className="expose-repeater"
            onStart={() => {
              this.dragging = true
            }}
            onEnd={() => {
              this.dragging = false
            }}
            onChange={(order, sortable, e) => {
              c.move(e.oldIndex, e.newIndex, this.props.name)
            }}
            onMouseOver={e => {
              if (this.dragging) return
              let v = e.target.closest('.expose-repeater > *')
              if (!v) return

              window.setHighlightedElement(v, {
                variantIndex: getElementIndex(v),
                variants: this.props.children.map(n => n.attributes.name),
                stateContainer: c
              })
              // let rect = v.getBoundingClientRect()
              // window.setHighlightState({
              //   variantIndex: getElementIndex(v),
              //   variants: this.props.children.map(n => n.attributes.name),
              //   stateContainer: c,
              //   styles: {
              //     top: `${rect.top - 10 + window.pageYOffset}px`,
              //     left: `${rect.left - 10}px`,
              //     width: `${rect.width + 20}px`,
              //     height: `${rect.height + 20}px`
              //   }
              // })
            }}
          >
            {c.state.value.map((v, i) => (
              <Location.Provider value={`${this.props.name}.${i}.$children`}>
                {this.props.children
                  .filter(child => child.attributes.name === v.name)[0]
                  .attributes.render()}
              </Location.Provider>
            ))}
          </Sortable>
        )}
      </Subscribe>
    )
  }
}

function getElementIndex(node) {
  var index = 0
  while ((node = node.previousElementSibling)) {
    index++
  }
  return index
}
