import React, { CSSProperties } from 'react';

const Header: React.FC = () => {
    const headerStyle: CSSProperties = {
        backgroundColor: '#A51C30', // Harvard's red
        color: 'white',
        textAlign: 'center',
        padding: '10px 0'
    };

    return (
        <header style={headerStyle}>
            <h1>Harvard Burger</h1>
        </header>
    );
};

export default Header;