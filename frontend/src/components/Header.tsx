import React, { CSSProperties } from 'react';
import menu from './Burger_logo.png';

const Header: React.FC = () => {
    const headerStyle: CSSProperties = {
        backgroundColor: '#A51C30', // Harvard's red
        color: 'white',
        textAlign: 'center',
        padding: 'px 0',
        height: '10vh', // Set a height for consistent vertical alignment
    };

    return (
        <header className={"flex-container"} style={headerStyle}>
            <img className={"img"} src={menu} alt="Burger Logo"></img>
            <div>
            <h1 className='empty'>Harvard Burger</h1>
            <h1 className={"slogan"}> "You Want Fries with That?"</h1>
            </div>

        </header>
    );
};

export default Header;
