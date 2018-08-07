import { Component } from 'preact'

export default class EditableProps extends Component {
  render() {
    return (
      <div
        className="expose-editable-props"
        style={{ background: '#eee', width: 200, pointerEvents: 'auto' }}
      >
        {Object.keys(this.props.props).map(prop => {
          let p = this.props.props[prop]
          switch (p.type) {
            case 'text':
              return (
                <input
                  type="text"
                  defaultValue={
                    this.props.stateContainer.state.value[prop] || ''
                  }
                  key={`${this.props.stateContainer.location}.${prop}`}
                  onInput={e =>
                    this.props.stateContainer.set(prop, e.target.value)
                  }
                />
              )
              break
            case 'color':
              return (
                <ul>
                  {p.options.map(option => (
                    <li>
                      <button
                        type="button"
                        style={{ width: 32, height: 32, background: option }}
                        onClick={() => {
                          this.props.stateContainer.set(prop, option)
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )
          }
        })}
      </div>
    )
  }
}
