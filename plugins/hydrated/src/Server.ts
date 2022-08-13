import path from 'path';
import auriserve from 'auriserve';
import { addStylesheet, removeStylesheet } from 'elements';

import './Style.pcss';

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);
auriserve.once('cleanup', () => removeStylesheet(styles));

export { default as Static } from './Static';
export { default as hydrate } from './Hydrate';
