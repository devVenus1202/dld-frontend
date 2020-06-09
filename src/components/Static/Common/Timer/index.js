import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class Index extends React.PureComponent {
  static propTypes = {
    from: PropTypes.any,
    to: PropTypes.any,
    onEnd: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      timerString: this.getTimerString()
    }
  }

  componentWillMount () {
    this.interval = setInterval(() => {
      this.setState({timerString: this.getTimerString()})
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  getTimerString () {
    let {from, to, onEnd} = this.props
    let dateFrom = from ? moment.utc(from) : moment.utc()
    let dateTo = to ? moment(to) : moment.utc()
    let offset = dateFrom.parseZone(dateTo).utcOffset() * 60 * 1000
    let duration = moment.duration(dateTo - offset - dateFrom, 'ms')
    const h = duration.hours() + (duration.days() * 24)
    if (duration.minutes() <= 0 && h <= 0 && duration.seconds() <= 0) {
      clearInterval(this.interval)
      if (typeof onEnd === 'function') {
        onEnd()
      }
    } else {
      return `${h > 0 ? `${h}:` : ''}${`0${duration.minutes()}`.substr(-2)}:${`0${duration.seconds()}`.substr(-2)}`
    }
  }


  render () {
    let {timerString = ''} = this.state
    return <div>{timerString}</div>
  }
}
