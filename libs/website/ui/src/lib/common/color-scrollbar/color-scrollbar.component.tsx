import { Scrollbar } from 'react-scrollbars-custom';

import styles from './color-scrollbar.module.scss';

function ColorScrollbar(props: JSX.Element): JSX.Element {
  return <Scrollbar {...props} data-testid="color-scrollbar" />;
}

export default ColorScrollbar;