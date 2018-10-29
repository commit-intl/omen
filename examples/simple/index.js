import {omen, Store} from '@omen/core';

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

export const store = new Store(initialState);

omen.render(
  <App title="Omen is awesome!"/>,
  document.body,
  store,
);