# omen

**ONE STATE, ONE APP!**

A simple data driven frontend library using JSX.

There are some major differences to render based libraries like React:
- no render cycle, no shadow DOM, no complicated change detection
- data is set with observables


## install and run
``` cmd
npm i -S @omen/cli
omen serve
```

example:
``` javascript
import omen from '../../../core/lib/renderer';

const App = (props, state, data) => {
  const entries = data.entries.map(
    (value) => (
      <span style={
        value.transform(v => v && {color: v.color})
      }>
        {value.child('title')}
      </span>
    )
  );

  return (
    <div className="app">
      <h1>{props.title}</h1>
      <p>{entries}</p>
    </div>
  );
};

App.data = {
  entries: 'app',
};

const initialState = {
  'app': [
    {title: 'Hello', color: '#fe8d00'},
    {title: 'World', color: '#333333'},
  ],
};

omen.render(
  document.getElementById('app'),
  <App/>,
  {
    getInitialState: () => Promise.resolve(initialState)
  },
);
```