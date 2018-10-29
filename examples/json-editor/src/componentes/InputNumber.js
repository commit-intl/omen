import {omen} from '@omen/core';

const InputNumber = ({value}) => <input type="number" value={value} onChange={(e) => value.set(parseInt(e.target.value))} />;

export default InputNumber;