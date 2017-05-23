import PropTypes from 'prop-types';
import React, {Component} from 'react';
import moment from 'moment';
import {Button, Cell} from '../components';

class Calendar extends Component {

  state = {
    date: moment(),
  }

  static propTypes = {
    date: PropTypes.any,
    firstDayOfWeek: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    type: PropTypes.string,
  }

  static defaultProps = {
    date: moment(),
    firstDayOfWeek: 1,
    onChange: () => {},
    type: 'dialy',
  }

  constructor(props) {
    super(props);

    this.state = {
      date: props.date
    };
  }

  componentDidMount() {
    /**
     * Redimensionamos las columnas dependiendo
     * del tamaño del contenedor.
     */
    const t = this.container.querySelector('table');
    const h = (t.clientWidth / 7) - 10;

    [].slice.call(t.querySelectorAll('td'))
      .forEach(td => td.style.height = h + 'px');
  }

  getHeader(type) {
    if (type === 'monthly') {
      return [];
    }

    // dialy
    const weekdays = moment.weekdaysShort();
    weekdays.push(weekdays.shift());

    return <tr>{weekdays.map(d => d.replace(/\./, ''))
      .map(d => <td>{d}</td>)}</tr>;
  }

  handlerChange(e) {
    e.preventDefault();
    e.stopPropagation();

    const button = e.currentTarget;
    const date = moment(button.dataset.date);

    this.setState({date: date});

    this.props.onChange(date);
  }

  getBodyMonthly(date) {
    const handlerChange = e => this.handlerChange.call(this, e);

    /**
     * Recuperamos el mes actual
     */
    const currentMonth = date.month();

    /**
     * Recuperamos el año actual
     */
    const year = date.format('YYYY');

    /**
     * Obtenemos el listado de meses
     */
    const months = moment.months();

    /**
     * Función que devuelve el valor
     * del mes con 2 digitos.
     */
    const month = value => (value < 9 ? '0' : '') + (value + 1);

    /**
     * Construimos la tabla de meses con 3 columnas
     * x 4 filas.
     */
    const rows  = [];
    let   cells = [];
    months.forEach((m, i) => {
      cells.push(<Cell
        className={currentMonth === i ? 'current' : ''}
        type='monthly'
        text={m}
        date={`${year}-${month(i)}-01`}
        onClick={handlerChange}
      />);

      if (i !== 0 && (i+1) % 3 == 0) {
        rows.push(<tr>{cells}</tr>);
        cells = [];
      }
    });

    /**
     * Retornamos las filas
     */
    return rows;
  }

  getBodyDialy(date) {
    /**
     * Recuperamos la fecha al inicio
     * del mes.
     */
    const firstDay = moment(date).startOf('month');

    /**
     * Despues vemos en que dia de la semana
     * empieza el mes.
     */
    const day = firstDay.day();

    /**
     * Ahora vemos cuantos días contiene
     * el mes.
     */
    const daysInMonth = date.daysInMonth();

    /**
     * En ingles el mes en el calendario comienza con
     * el día domingo a diferencia que en español
     * el calendario comienza el día lunes.
     * Con esto logramos corregir esta diferencia.
     */
    const firstDayOffset = this.props.firstDayOfWeek - (day === 0 ? 7 : day) + 1;

    /**
     * Obtenemos el total de dias que serán dibujados en
     * el calendario.
     */
    const totalDays = Math.ceil((Math.abs(firstDayOffset) + daysInMonth + 1) / 7) * 7;

    /**
     * Nos posicionamos el primer día visible del
     * calendario y creamos una copia.
     */
    const _d = moment(firstDay.add(firstDayOffset - 1, 'days'));

    /**
     * Obtener el día actual
     */
    const cur_date = date.date();

    /**
     * Guardamos año/mes
     */
    const year_month = date.format('YYYY-MM');

    /**
     * Función que devuelve el valor
     * del mes con 2 digitos.
     */
    const _day = value => (value <= 9 ? '0' : '') + value;

    let rows  = [];
    let cells = [];

    /**
     * Ahora recorremos cada día hasta completar
     * el total de días visiables en el calendario.
     */
    for (let d=1; d<=totalDays; d++) {
      const isOffset = firstDayOffset -1 + d <= 0 || firstDayOffset - 1 + d > daysInMonth;
      const day = _d.date();

      /**
       * Construimos la celda con el día. Sólo los días
       * del mes pueden cambiar día.
       */
      const handlerChange = isOffset ? () => {} : this.handlerChange.bind(this);

      /**
      * Pintamos en forma diferente los días fuera
      * de mes.
      * También pintamos diferente el día actual.
      */
      cells.push(<Cell
        className={isOffset ? 'offset-day' : (cur_date === day ? 'current' : '')}
        date={`${year_month}-${_day(day)}`}
        onClick={handlerChange}
        text={day}
        type='dialy'
      />);

      /**
       * Construimos la fila correspiente si
       * el total de celdas es 7 o se completo
       * el número de días.
       */
      if ((d !== 0 && d % 7 === 0) || d === totalDays) {
        rows.push(<tr>{cells}</tr>);
        cells = [];
      }

      /**
       * Avanzamos al siguiente día
       */
      _d.add(1, 'days');
    }

    return rows;
  }

  render () {
    const type = this.props.type;
    const date = this.state.date;

    const header = this.getHeader(type);
    const body   = type === 'monthly' ? this.getBodyMonthly(date)
                                      : this.getBodyDialy(date);

    const handlerChange = e => this.handlerChange.call(this, e);

    return <div className='calendar' ref={c => this.container = c}>
      <header>
        <Button
          action='left'
          date={date}
          onClick={handlerChange}
          type={type}
        />
        <h2>{date.format(type === 'monthly' ? 'YYYY' : 'MMMM YYYY')}</h2>
        <Button
          action='right'
          date={date}
          onClick={handlerChange}
          type={type}
        />
      </header>
      <table>
        <thead>{header}</thead>
        <tbody>{body}</tbody>
      </table>
    </div>;
  }
}

export default Calendar;
