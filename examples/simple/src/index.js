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