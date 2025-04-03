import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const LoginRegisterPopup: React.FC = ()=>{
    const [showPopup,setShowPopup] = useState(false)

    const togglePopup = () =>{
        setShowPopup(!showPopup)
    }

    return (
        <div>
            <button onClick={togglePopup}>Login/Register</button>
            {showPopup && (<div className='modal fade show' tabIndex={-1} style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }} onClick={togglePopup}>
                <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5>Why create an account?</h5>
                        </div>
                        <div className='modal-body '>
                            <h3 className='text-center'>Benefits</h3>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Upload your own recipes</li>
                                <li className="list-group-item">Save recipes</li>
                                <li className="list-group-item">Post ratings and reviews of recipes</li>
                                <li className="list-group-item">Track your daily macros</li>
                                <li className="list-group-item">Generate a recipe with your ingredients</li>
                            </ul>
                        </div>
                        <div className='modal-footer justify-content-center align-item-center'>
                            <button className='btn btn-secondary' onClick={togglePopup}>Close</button>
                            <Link to="/login">
                                <button className='btn btn-primary' onClick={togglePopup}>Login</button>
                            </Link>
                            <Link to="/Register">
                                <button className='btn btn-primary' onClick={togglePopup}>Register</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default LoginRegisterPopup
