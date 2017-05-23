import React from 'react';
import {render} from 'react-dom';
import {Calendar} from '../src/components';

// Styles
import '../src/sass/default.scss';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const container1 = document.createElement('div');
container1.classList.add('container1');
container1.style.width = '300px';
container1.style.height= '100%';
document.body.appendChild(container1);
render(<Calendar type='daily' />, container1);

const container2 = document.createElement('div');
container2.classList.add('container1');
container2.style.width = '300px';
container2.style.height= '100%';
document.body.appendChild(container2);

render(<Calendar type='monthly' />, container2);
