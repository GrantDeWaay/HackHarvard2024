import React, { CSSProperties } from 'react';
import menu from './Burger_logo.png';

const Header: React.FC = () => {
    const headerStyle: CSSProperties = {
        backgroundColor: '#A51C30', // Harvard's red
        color: 'white',
        textAlign: 'center',
        padding: '10px 0',
        height: '150px', // Set a height for consistent vertical alignment
    };

    return (
        <header className={"flex-container"} style={headerStyle}>
            <img className={"img"} src={menu} alt="Burger Logo"></img>
            <h1 className={"Aligner-item"}>Harvard Burger</h1>
        </header>
    );
};

export default Header;
