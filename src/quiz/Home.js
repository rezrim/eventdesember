import '../App.css';
import { useEffect, useState } from 'react';
import {Modal, Button} from 'react-bootstrap'

import qBank from './QuizBank'

function App() {
  const [question, setQuestion] = useState(qBank)
  const [score, setScore] = useState(0)
  const [tab, setTab] = useState(0)
  const [show, setShow] = useState(false);
  const [lastShow, setLastShow] = useState(false);
  const [right, setRight] = useState(false);
  const [rightAnswer, setRightAnswer] = useState("");

  useEffect(() => {
    console.log(question)
  })

  const answer = (e, item, itemRight) => {
    e.target.style.backgroundColor = 'green'
    setRightAnswer(itemRight)
    handleShow()
    
    let nilai=score
    if(item===itemRight){
      nilai+=10
      setScore(nilai)
      setRight(true)
    }else{
      setRight(false)
    }
  }

  const changeTab = (item) => {
    setTab(item)
    setShow(false)
    if(item==8){
      setLastShow(true)
    }
  }

  const finishTab = () => {
    window.location.href = "http://localhost:3000/";
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="d-flex justify-content-center align-items-center bg-info" style={{height:'100vh'}}>
      {qBank.map((item,i) => {
        return tab == i &&
        <div key={i} className="card" style={{width:400}}>
          <div className="card-header">
            <h1 className="card-title text-center">Question {i+1}</h1>
          </div>
          <div className="card-body">
            <h2 className="card-text text-center font-weight-normal">{item.question}</h2>
            <div className="btn btn-info w-100 my-1" onClick={(e) => answer(e,item.answers[0],item.correct)}>{item.answers[0]}</div> <br/>
            <div className="btn btn-info w-100 my-1" onClick={(e) => answer(e,item.answers[1],item.correct)}>{item.answers[1]}</div> <br/>
            <div className="btn btn-info w-100 my-1" onClick={(e) => answer(e,item.answers[2],item.correct)}>{item.answers[2]}</div> <br/>
            <div className="btn btn-info w-100 my-1" onClick={(e) => answer(e,item.answers[3],item.correct)}>{item.answers[3]}</div> <br/>
          </div>
          <div className="card-footer text-right">
            <h5 className="text-left">Score = {score}</h5>
          </div>
          <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header>
              <Modal.Title style={right ? {color:"green"} : {color:"red"}}>Your Answer is { right ? 'Right' : 'Wrong' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>The Answer is <b>{rightAnswer}</b></p>
              <p>Your Score = {score}</p>
            </Modal.Body>
            <Modal.Footer>
              {tab == 2 ?
                <Button variant="primary"  onClick={() => changeTab(8)}>
                  Next
                </Button>
              :
                <Button variant="primary"  onClick={() => changeTab(i+1)}>
                  Next
                </Button>
              }
              
            </Modal.Footer>
          </Modal>
        </div>
      })}
      {lastShow &&
        <Modal show={lastShow} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Question Finish</Modal.Title>
          </Modal.Header>
          <Modal.Body>Final Score = {score}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary"  onClick={() => finishTab()}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </div>
  );
}

export default App;
