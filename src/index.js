import { Component, render } from 'preact'
import Expose from './expose.js'
import Repeater from './repeater.js'
import Variant from './variant.js'
import Text from './text.js'
import Editable from './editable.js'

window.expose = {
  containers: {},
  data: {
    sections: [
      {
        name: 'text',
        $children: {
          title: 'hiya'
        }
      },
      {
        name: 'text',
        $children: {
          title: 'seeya',
          'test-props': {
            color: 'hotpink',
            suffix: 'test'
          }
        }
      }
    ]
  }
}

export default class App extends Component {
  state = {
    count: 0
  }
  render() {
    return (
      <div style={{ margin: '100px' }}>
        {/*<div>
          {this.state.count}{' '}
          <button
            onClick={() => this.setState(state => ({ count: state.count + 1 }))}
          >
            +
          </button>
        </div>*/}
        <Repeater name="sections">
          <Variant
            name="text"
            render={() => (
              <Editable
                name="test-props"
                props={{
                  color: { type: 'color', options: ['hotpink', 'yellow'] },
                  suffix: { type: 'text' }
                }}
              >
                {({ color, suffix }) => (
                  <div style={{ color: color || '' }}>
                    ::<Text name="title" /> – {suffix}
                  </div>
                )}
              </Editable>
            )}
          />
        </Repeater>
        {/*<Repeater name="sections">
          <Variant
            name="text"
            render={() => (
              <Editable
                name="test-props"
                props={{
                  color: { type: 'color', options: ['hotpink', 'yellow'] }
                }}
              >
                {({ color }) => (
                  <div style={{ color: color || '' }}>
                    ::<Text name="title" />
                  </div>
                )}
              </Editable>
            )}
          />
        </Repeater>*/}
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  render(
    <Expose>
      <App />
    </Expose>,
    document.getElementById('root')
  )
}
