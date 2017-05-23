import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Button extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    date: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  render() {
    const {action, date, type, onClick} = this.props;
    const _newDate = action === 'preview' ?
      moment(date).subtract(1, (type === 'daily' ? 'months' : 'years')) :
      moment(date).add(1,      (type === 'daily' ? 'months' : 'years'));

    return <button
      data-button={action}
      data-type={type}
      data-date={_newDate.format('YYYY-MM-DD')}
      onClick={onClick}>
      <i className='material-icons'>{`keyboard_arrow_${action}`}</i>
    </button>;
  }
}

export default Button;
