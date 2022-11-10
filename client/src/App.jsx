import React from 'react';
import logo from './assets/images/logo.png'
import './index.scss'

const App = () => {
    return(
        <div className="app">
            <div className="app__logo">
                <img src={logo} alt="" />
            </div>
        </div>
    )
}

export default App