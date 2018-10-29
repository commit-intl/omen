import {omen} from '@omen/core';

const InputText = ({value}) => <pre contentEditable={true} onInput={(e) => value.set(e.target.innerText)}>{value.get()}</pre>;

export default InputText;