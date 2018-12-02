import {omen} from '@omen/core';
import styles from './InputText.scss';

const InputText = ({value}) => <pre className={styles.host} contentEditable={true} onInput={(e) => value.set(e.target.innerText)}>{value.get()}</pre>;

export default InputText;