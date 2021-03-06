import React, { Component } from 'react';
import { GameInfo, Board, Player, Enemy, DebugState } from '../components';
import { UP, DOWN, LEFT, RIGHT } from '../helpers/constants';
import { pluck } from '../helpers/utils';
import {Modal, Button} from 'react-bootstrap'

import { Square } from '../components/';


import upArrow from '../../image/arrow/up-arrow.png'
import leftArrow from '../../image/arrow/left-arrow.png'
import rightArrow from '../../image/arrow/right-arrow.png'
import downArrow from '../../image/arrow/down-arrow.png'
import pippi from '../../image/pipi.png'
/*
    Since my api key is not publicly available,
    cloned versions will lack the ability to post
    new high scores.
*/
// import url from 'api';

const getDefaultState = ({ boardSize, playerSize, highScore = 0 }) => {
    const half = Math.floor(boardSize / 2) * playerSize;
    return {
        size: {
            board: boardSize,
            player: playerSize,
            maxDim: boardSize * playerSize
        },
        positions: {
            player: {
                top: half,
                left: half
            },
            enemies: []
        },
        playerScore: 0,
        highScore,
        timeElapsed: 0,
        enemySpeed: 5,
        enemyIndex: 0,
        activeEnemies: 1,
        baseScore: 10,
        playIng:false,
        finish:false
    }
};

export default class Game extends Component {
    constructor(props) {
        super(props);
        const half = Math.floor(props.boardSize / 2) * props.playerSize;
        const { boardSize, playerSize } = props;
        this.state = getDefaultState({ boardSize, playerSize })
    }

    setPlay = () => {
        let statePlaying = this.state.playIng
        this.setState({playIng:!statePlaying})
    }

    setFinish = () => {
        const half = Math.floor(this.props.boardSize / 2) * this.props.playerSize;
        this.setState({
            finish:true,
            positions: {
                player: {
                    top: half,
                    left: half
                },
                enemies: []
            },
        })
    }

    finishTab = () => {
        window.location.href = "http://localhost:3000/";
    }
    
    
    placeEnemy = () => {
        // enemies always launch at player
        const { player, maxDim } = this.state.size;
        const { player: playerPos } = this.state.positions;

        // assign to a random side
        const side = pluck([UP, DOWN, LEFT, RIGHT]);

        // generate enemy object
        const newEnemy = this.generateNewEnemy(playerPos, side);

        // add new enemy to state
        this.setState({
            positions: {
                ...this.state.positions,
                enemies: [...this.state.positions.enemies].concat(newEnemy)
            }
        });
    }

    generateNewEnemy = (position, side) => {
        this.setState({
            enemyIndex: this.state.enemyIndex + 1
        });

        const newEnemy = { key: this.state.enemyIndex, dir: side };
        const { maxDim, player } = this.state.size;

        switch(side) {
            case UP:
                newEnemy.top = maxDim;
                newEnemy.left = position.left;
                break;
            case DOWN:
                newEnemy.top = 0 - player;
                newEnemy.left = position.left;
                break; 
            case LEFT:
                newEnemy.top = position.top;
                newEnemy.left = maxDim;
                break;
            case RIGHT:
                newEnemy.top = position.top;
                newEnemy.left = 0 - player;
                break;
        }

        return newEnemy;
    }

    handleKeyDown = (e) => {
        let newDirection;
        
        switch(e.keyCode) {
            case 37:
                newDirection = { top: 0, left: -1 , dir: LEFT};
                break;
            case 38:
                newDirection = { top: -1, left: 0 , dir: UP};
                break;
            case 39:
                newDirection = { top: 0, left: 1, dir: RIGHT};
                break;
            case 40:
                newDirection = { top: 1, left: 0, dir: DOWN };
                break;
            default:
                return;
        }


        this.handlePlayerMovement(newDirection);
    }

    handleArrowDown = (arrow) => {
        let newDirection;
        console.log(arrow)        
        switch(arrow) {
            case "left":
                newDirection = { top: 0, left: -1 , dir: LEFT};
                break;
            case "up":
                newDirection = { top: -1, left: 0 , dir: UP};
                break;
            case "right":
                newDirection = { top: 0, left: 1, dir: RIGHT};
                break;
            case "down":
                newDirection = { top: 1, left: 0, dir: DOWN };
                break;
            default:
                return;
        }


        this.handlePlayerMovement(newDirection);
    }

    handlePlayerMovement = (dirObj) => {
        const { top, left } = this.state.positions.player;
        const { player, maxDim } = this.state.size;
        
        // check walls
        switch (dirObj.dir) {
            case UP:
                if (top === 0) return;
                break;
            case DOWN:
                if (top === maxDim - player) return;
                break;
            case LEFT:
                if (left === 0) return;
                break;
            case RIGHT:
                if (left === maxDim - player) return;
                break;
        }
        let ttop = top + (player * dirObj.top)
        let tleft = left + (player * dirObj.left)
        console.log(ttop +"="+tleft)
        this.setState({
            positions: {
                ...this.state.positions,
                player: {
                    top: top + (player * dirObj.top),
                    left: left + (player * dirObj.left)
                }
            }
        });
    }

    handlePlayerCollision = () => {
        this.resetGame();
    }

    startGame = () => {
        this.enemyInterval = setInterval(this.updateEnemyPositions, 50);
        this.timeInterval = setInterval(this.updateGame, 1000);
        this.gameInterval = setInterval(this.updateEnemiesInPlay, 250);
    }

    updateGame = () => {
        const { timeElapsed } = this.state;

        this.updateTimeAndScore();

        if (timeElapsed > 0) {

            // increment enemy speed
            if (timeElapsed % 3 === 0) {
                this.incrementEnemySpeed();
            }

            // increment max active enemies every 10 seconds
            if (timeElapsed % 10 === 0) {
                this.incrementActiveEnemies();
            }
        }
    }

    updateEnemyPositions = () => {
        const { enemySpeed, positions: { enemies }, size: { player, maxDim }} = this.state;

        this.setState({
            positions: {
                ...this.state.positions,
                enemies: enemies.filter(enemy => !enemy.remove).map(enemy => {
                    if (enemy.top < (0 - player) || 
                        enemy.top > maxDim + player || 
                        enemy.left < (0 - player) || 
                        enemy.left > maxDim + player ) {
                        enemy.remove = true;
                        return enemy;
                    }

                    // based on direction, increment the correct value (top / left)
                    switch(enemy.dir) {
                        case UP: 
                            enemy.top -= enemySpeed;
                            break;
                        case DOWN: 
                            enemy.top += enemySpeed;
                            break;
                        case LEFT:
                            enemy.left -= enemySpeed;
                            break;
                        case RIGHT:
                            enemy.left += enemySpeed;
                            break;
                    }

                    return enemy;
                })
            }
        });
    }

    updateEnemiesInPlay = () => {
        const { activeEnemies } = this.state;
        const { enemies } = this.state.positions;

        if (enemies.length < activeEnemies) {
            this.placeEnemy();
        }
    }

    updateTimeAndScore = () => {
        const { timeElapsed, playerScore, baseScore } = this.state;

        this.setState({
            timeElapsed: timeElapsed + 1,
            playerScore: playerScore + baseScore,
        });
    }

    incrementEnemySpeed = () => {
        const { enemySpeed } = this.state;

        this.setState({
            enemySpeed: parseFloat((enemySpeed + 0.25).toFixed(2))
        });
    }

    incrementActiveEnemies = () => {
        this.setState({
            activeEnemies: this.state.activeEnemies + 1
        });
    }

    resetGame = () => {
        const { boardSize, playerSize } = this.props;
        const { playerScore, highScore, globalHighScore, debug } = this.state;
        
        // clear intervals
        clearInterval(this.gameInterval); 
        clearInterval(this.enemyInterval);
        clearInterval(this.timeInterval);

        // if high score is higher than global high score, update it
        if (playerScore > globalHighScore) {
            this.updateGlobalHighScore(playerScore);
        }

        this.setFinish();

        // reset state
        // this.setState({
        //     ...getDefaultState({ boardSize, playerSize, highScore, playing:true }),
            // persist debug state and high scores
        //     playing:true,
        //     debug,
        //     highScore: playerScore > highScore ? playerScore : highScore,
        //     globalHighScore
        // });
        // restart game
        // this.startGame();

    }

    handleDebugToggle = () => {
        this.setState({
            debug: this.debug.checked
        });
    }

    fetchGlobalHighScore = () => {
        // axios.get(url)
        //     .then(data => {
        //         this.setState({
        //             globalHighScore: data.data.fields.global_high_score
        //         })
        //     })
        //     .catch(err => console.warn(err))
    }

    updateGlobalHighScore = (highScore) => {
        // axios.patch(url, {
        //     "fields": {
        //         "global_high_score": highScore
        //     }
        // })  
        // .then(data => {
        //     this.setState({
        //         globalHighScore: data.data.fields.global_high_score
        //     });
        // })
        // .catch(err => console.warn(err))
    }

    style = () => {
        return {
            width: '85%',
            maxWidth: '600px',
            margin: '0 auto'
        };
    }
    
    render() {
        const { 
            size: { board, player }, 
            positions: { player: playerPos },
            playerScore,
            timeElapsed,
            highScore,
            globalHighScore
        } = this.state;
        let ply = player
        return (
            <div>
            {this.state.playIng ?
                
                <div style={this.style()}>
                    <GameInfo 
                        playerScore={playerScore} 
                        timeElapsed={timeElapsed}
                        highScore={highScore}
                        globalHighScore={globalHighScore} />

                    <Board dimension={board * ply}>
                        <div ref={ n => { ply = n }} >
                            <div 
                                // size={ply}
                                // position={playerPos.top, playerPos.left }
                                // color='darkgray' 
                                style={{ 
                                    width: "40px",
                                    height: "40px",
                                    backgroundImage: `url(${pippi})`,
                                    backgroundSize:"cover",
                                    position: 'absolute',
                                    top: playerPos.top + 'px',
                                    left: playerPos.left + 'px',
                                    transition: 'all 0.1s ease'
                                }}
                                />
                        </div>
                        {/* <Player 
                            size={player} 
                            position={playerPos}
                            handlePlayerMovement={this.handlePlayerMovement} /> */}

                        {
                            this.state.positions.enemies.map(enemy => 
                                <Enemy key={enemy.key}
                                    size={player}
                                    info={enemy}
                                    playerPosition={playerPos}
                                    onCollide={this.handlePlayerCollision} />
                            )
                        }
                    </Board>
                    {false && <p style={{ position: 'fixed', bottom: 0, left: 16 }}>Debug: <input type="checkbox" onChange={this.handleDebugToggle} ref={ n => this.debug = n }/></p>}
                    {this.state.debug && <DebugState data={this.state} />}
                </div>
            :
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
                    <Button variant="primary"  onClick={() => { this.startGame();
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
                        <Modal.Body>Your Score is {playerScore}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary"  onClick={() => this.finishTab()}>
                        Finish
                    </Button>
                    </Modal.Footer>
                </Modal>
            }
            <div className="arrowWrap position-absolute" style={{bottom:"5vh", left:0, right:0}}>
                <div className="d-flex justify-content-center align-items-center">
                    <img className="mb-2" onClick={() => this.handleArrowDown("up")} src={upArrow} width={50}/>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img className="mr-4" onClick={() => this.handleArrowDown("left")} src={leftArrow} width={50}/>
                    <img className="ml-4" onClick={() => this.handleArrowDown("right")} src={rightArrow} width={50}/>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img className="mt-2" onClick={() => this.handleArrowDown("down")} src={downArrow} width={50}/>
                </div>
            </div>
            
            </div>
        )
    }
    
    componentDidMount() {
        // this.startGame();
        this.fetchGlobalHighScore();
        window.onkeydown = this.handleKeyDown;
    }

    componentWillUnmount() {
        clearInterval(this.state.gameInterval);
        clearInterval(this.state.enemyInterval);
        clearInterval(this.state.timeInterval);
    }
}