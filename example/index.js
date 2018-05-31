import omega from '../src/omega';
import DataStore from '../src/data';

const store =
  new DataStore({
    user: {
      name: 'Dustin',
    }
  });

const Input = ({value}) => {
  console.log(value);
  return <input type='text' value={value} />;
};

omega.render(
  <div className="test" style={{backgroundColor: '#fffedd'}}>
    Hallo, <b $bind="user.name" onClick={(event) =>{store.set('user.name', undefined); console.log('asjkhdkals')}}>lieber {data => data}</b>.
    <Input value={'TEST'}/>
  </div>,
  store
);