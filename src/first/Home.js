import React, { useState } from 'react';
import {
    Link
  } from "react-router-dom";

import {Modal, Button} from 'react-bootstrap'

function Home(props) {
    const [timePlayVoid,setTimePlayVoid] = useState(0)
    const [timePlayPuzzle,setTimePlayPuzzle] = useState(0)
    const [timePlayQuiz,setTimePlayQuiz] = useState(0)
    const [login,setLogin] = useState(false)

    const loginSubmit = () => {
        setLogin(true)
    }


    return (
    <div className="d-flex flex-md-row justify-content-center align-items-center bg-info flex-wrap" style={{minHeight:'100vh'}}>
            <div className="col-md-6 col-sm-12 my-2">
            <div className="card col-md-8 col-sm-8 m-auto">
                <div className="card-header">
                    <h2 className="card-title text-center">Void Game</h2>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height:140}}>
                    <p className="card-text text-center font-weight-normal">Sejago apa kamu menghindar ?</p>
                </div>
                <div className="card-footer text-right">
                    {timePlayVoid < 3 ?
                        <Link className="btn btn-info w-100 my-1" to="/void">Start</Link>
                    :
                        <div className="btn btn-danger w-100 my-1" style={{cursor:"not-allowed"}}>Already tried 3 times, try again tomorrow</div>
                    }
                </div>
            </div>
            </div>
            <div className="col-md-6 col-sm-12 my-2">
            <div className="card col-md-8 col-sm-8 m-auto">
                <div className="card-header">
                    <h2 className="card-title text-center">Puzzle Game</h2>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height:140}}>
                    <p className="card-text text-center font-weight-normal">Berapa waktu yang diperlukan untuk selesai ?</p>
                </div>
                <div className="card-footer text-right">
                    {timePlayPuzzle < 3 ?
                        <Link className="btn btn-info w-100 my-1" to="/puzzle">Start</Link>
                    :
                        <div className="btn btn-danger w-100 my-1" style={{cursor:"not-allowed"}}>Already tried 3 times, try again tomorrow</div>
                    }
                </div>
            </div>
            </div>
            <div className="col-md-6 col-sm-12 my-2">
            <div className="card col-md-8 col-sm-8 m-auto">
                <div className="card-header">
                    <h2 className="card-title text-center">Quiz Game</h2>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height:140}}>
                    <p className="card-text text-center font-weight-normal">Seberapa kenalkah kamu dengan Umi{'&'}Shio ?</p>
                </div>
                <div className="card-footer text-right">
                    {timePlayPuzzle < 2 ?
                        <Link className="btn btn-info w-100 my-1" to="/quiz">Start</Link>
                    :
                        <div className="btn btn-danger w-100 my-1" style={{cursor:"not-allowed"}}>Already tried this game, try again tomorrow</div>
                    }
                </div>
            </div>
            </div>
            <div className="col-md-6 col-sm-12 my-2">
            <div className="card col-md-8 col-sm-8 m-auto">
                <div className="card-header">
                    <h2 className="card-title text-center">Check Classement</h2>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center" style={{height:140}}>
                    <p className="card-text text-center font-weight-normal">Cek Classement disini</p>
                </div>
                <div className="card-footer text-right">
                    <div className="btn btn-info w-100 my-1">Start</div> <br/>
                </div>
            </div>
            </div>
            {!login &&
                <Modal show={!login} backdrop="static" keyboard={false}>
                    <Modal.Header>
                    <Modal.Title>Masukkan Password Kamu</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <p className="text-justify">Jika password sudah pernah dimasukkan, maka masukkan password yang sudah pernah dimasukkan. Jika belum, password ini akan jadi password untuk masuk ke game. Jadi disimpen ya..</p>
                            <div class="form-group">
                                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="password"/>
                            </div>
                        </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary"  onClick={() => loginSubmit()}>
                        Finish
                    </Button>
                    </Modal.Footer>
                </Modal>
            }
    </div>
    );
}

export default Home;