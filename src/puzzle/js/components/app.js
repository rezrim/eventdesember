import React, {Component} from 'react'
import {shuffle, range, every,} from 'lodash'
import {Modal, Button} from 'react-bootstrap'

const layout = range(0, 16).map(n => {
    const row = Math.floor(n / 4);
    const col = n % 4;
    return [80 * col, 80 * row];
});

const leftPad = (width, n) => {
    if ((n + '').length > width) {
        return n;
    }
    const padding = new Array(width).join('0');
    return (padding + n).slice(-width);
};

class TimeElapsed extends React.Component {
    getUnits() {
      const seconds = this.props.timeElapsed / 1000;
      return {
        min: Math.floor(seconds / 60).toString(),
        sec: Math.floor(seconds % 60).toString(),
        msec: (seconds % 1).toFixed(3).substring(2)
      };
    }
    render() {
      const units = this.getUnits();
      return (
        <div id={this.props.id} style={{padding:30}}>
          <span style={{color:"white", fontSize:24}}>{leftPad(2, units.min)}:</span>
          <span style={{color:"white", fontSize:24}}>{leftPad(2, units.sec)}.</span>
          <span style={{color:"white", fontSize:24}}>{units.msec}</span>
        </div>
      );
    }
  }
  
  class LapTimes extends React.Component {
    render() {
      const rows = this.props.lapTimes.map((lapTime, index) =>
        <tr key={++index}>
          <td>{index}</td>
          <td><TimeElapsed timeElapsed={lapTime} /></td>
        </tr>
      );
      return (
        <table id="lap-times">
          <thead>
            <th>Lap</th>
            <th>Time</th>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
  }

export default class APP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: shuffle(range(0, 16)),
            playing:false,
            finish:false,
            isRunning: false,
            lapTimes: [],
            timeElapsed: 0,
        }

    }

    finishTab = () => {
        window.location.href = "http://localhost:3000/";
    }

    toggle = () => {
        this.setState({isRunning: !this.state.isRunning}, () => {
          this.state.isRunning ? this.startTimer() : clearInterval(this.timer)
        });
    }

    lap = () => {
        const {lapTimes, timeElapsed} = this.state;
        this.setState({lapTimes: lapTimes.concat(timeElapsed)});
    }

    reset = () => {
        clearInterval(this.timer);
        this.setState(this.initialState);
    }

    startTimer = () => {
        this.startTime = Date.now();
        this.timer = setInterval(this.update, 10);
    }

    update = () => {
        const delta = Date.now() - this.startTime;
        this.setState({timeElapsed: this.state.timeElapsed + delta});
        this.startTime = Date.now();
    }

    updatePosition(index) {
        let {positions} = this.state;
        let emptyIndex = positions.indexOf(0);
        let targetIndex = positions.indexOf(index);
        const dif = Math.abs(targetIndex - emptyIndex);
        if (dif == 1 || dif == 4) {
            positions[emptyIndex] = index;
            positions[targetIndex] = 0;
            this.setState({positions});
            let win = every(positions, (value, index, array)=> {
                value = value || 16;
                return index === 0 || parseInt(array[index - 1]) <= parseInt(value)
            });
            if (win) {
                alert("U win")
                this.toggle()
                // this.setState({finish:true})
            }
        }
    }
    render() {
        const {isRunning, lapTimes, timeElapsed} = this.state;
        return (
            <div className="d-flex justify-content-start align-items-center bg-info flex-column" style={{height:"100vh"}}>
                 <div>
                    <TimeElapsed id="timer" timeElapsed={timeElapsed} />
                    {/* <button onClick={this.toggle}>
                        {isRunning ? 'Stop' : 'Start'}
                    </button> */}
                    {/* <button
                        onClick={isRunning ? this.lap : this.reset}
                        disabled={!isRunning && !timeElapsed}
                    >
                        {isRunning || !timeElapsed ? 'Lap' : 'Reset'}
                    </button> */}
                    {/* {lapTimes.length > 0 && <LapTimes lapTimes={lapTimes} />} */}
                </div>
                <div className="game">
                    {this.state.positions.map((i, key)=> {
                        let cellClass = key ? "cell":'empty cell';
                        let [x,y] = layout[this.state.positions.indexOf(key)];
                        return <div className={cellClass}
                                        onClick={this.updatePosition.bind(this, key)}
                                        style={{transform: `translate3d(${x}px,${y}px,0) scale(1.1)`}}>{key}</div>

                    })}
                    <div style={{clear:"both"}}></div>
                </div>
                {!this.state.playing &&
                    <Modal show={!this.state.playIng} backdrop="static" keyboard={false}>
                        <Modal.Header>
                        <Modal.Title>Ready ?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{fontWeight:"bold"}}>Info :</p>
                            <p>1. Each member is given 3 time to try</p>
                            <p>2. From 3 tries, the highest score will appear on the Classement Board</p>
                            <p>3. Classement Board and Point will be reset every day</p>
                            <p>Ready For the Game ?</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary"  onClick={() => { this.toggle()
                            this.setState({playIng:true})
                        }}>
                            Ready
                        </Button>
                        </Modal.Footer>
                    </Modal>
                }
                {this.state.finish &&
                <Modal show={this.state.finish} backdrop="static" keyboard={false}>
                    <Modal.Header>
                    <Modal.Title>Game Finish</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>Your Time is {timeElapsed}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary"  onClick={() => this.finishTab()}>
                        Finish
                    </Button>
                    </Modal.Footer>
                </Modal>
            }
            </div>
        )
    }
}

