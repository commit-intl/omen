import {omen} from '@omen/core';

export const Headline = ({children}) => (
  <h1
    style={{
      fontFamily: 'monospace',
      backgroundColor: '#222222',
      color: '#ffffff',
    }}>
    {children}
  </h1>
);