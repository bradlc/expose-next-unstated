import { Component } from 'preact'
import EditableProps from './editable-props.js'

export default class Highlighter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: null,
      showEditablePropsPopout: false
    }
    window.setHighlightState = this.setState.bind(this)

    window.setHighlightedElement = (el, state) => {
      if (this.state.showEditablePropsPopout) return
      let rect = el.getBoundingClientRect()
      this.setState({
        ...state,
        styles: {
          top: `${rect.top - 10 + window.pageYOffset}px`,
          left: `${rect.left - 10}px`,
          width: `${rect.width + 20}px`,
          height: `${rect.height + 20}px`
        }
      })
      // state.editableStateContainer &&
      //   state.editableStateContainer.set({ color: 'red' })
    }

    window.addEventListener('click', this.hideEditablePropsPopout)
  }
  hideEditablePropsPopout = e => {
    if (
      e.target.closest('.expose-editable-props') ||
      e.target.closest('.expose-show-editable-popout')
    )
      return
    this.setState({ showEditablePropsPopout: false })
  }
  render() {
    return this.state.styles ? (
      <div
        style={{
          position: 'absolute',
          border: '1px solid red',
          pointerEvents: 'none',
          ...this.state.styles
        }}
      >
        {typeof this.state.variantIndex !== 'undefined' && (
          <button
            type="button"
            style={{
              position: 'absolute',
              bottom: -16,
              right: -16,
              width: 32,
              height: 32,
              background: 'blue',
              pointerEvents: 'auto'
            }}
            onClick={() => {
              this.state.stateContainer.add('text', this.state.variantIndex)
            }}
          />
        )}
        {this.state.showEditablePropsPopout ? (
          <EditableProps
            props={this.state.editableProps}
            stateContainer={this.state.editableStateContainer}
          />
        ) : (
          this.state.editableProps && (
            <button
              class="expose-show-editable-popout"
              type="button"
              style={{
                position: 'absolute',
                top: 0,
                right: '100%',
                width: 32,
                height: 32,
                pointerEvents: 'auto'
              }}
              onClick={() => this.setState({ showEditablePropsPopout: true })}
            />
          )
        )}
      </div>
    ) : null
  }
}
