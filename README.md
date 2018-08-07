# omega

**ONE STATE, ONE APP!**

A simple data driven frontend library using JSX.

There are some major differences to render based libraries like React:
- no render cycle, no shadow DOM, no complicated change detection
- no component has a private state
- getting data from the store is handled via directives e.g. _bind / _for

``` cmd
npm i -S ome
```

example:
``` javascript
const initialState = {
  'app': [
      {title: 'Hello', color: '#fe8d00'},
      {title: 'World', color: '#333333'},
    ]
  }
};

export const store = new Store(initialState);

omega.render(
  <div className="app">
    <h1>omega is awesome!</h1>
    <p _for="app">
      <span style={data => data && ({color: data.color})}>{data => data && data.title}</span>
    </p>
  </div>,
  document.body,
  store
);
```