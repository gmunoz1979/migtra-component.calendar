import PropTypes from 'prop-types';
import React, {Component} from 'react';

class Cell extends Component {

  static propTypes = {
    className: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const {className, type, text, date, onClick} = this.props;

    return <td
      className={className}
      data-type={type}>
      <button
        data-text={text}
        data-date={date}
        onClick={onClick}
      />
    </td>;
  }
}

export default Cell;
