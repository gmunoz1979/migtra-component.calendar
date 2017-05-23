import moment from 'moment';
moment.locale('es');

import components from './components';
const {Calendar, Cell} = components;
import 'material-icons';

export {Calendar, Cell, components};

export default {
  Calendar,
  Cell,
  components
};

import './sass/default.scss';
