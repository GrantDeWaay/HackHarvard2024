import React from 'react';
import CheckoutListItem from './CheckoutListItem';

interface CheckoutItemProps {
    items: string[];
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ items }) => {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', height: '300px', overflowY: 'auto', border: '1px solid black' }}>
            {items.map((item, index) => (
                <div key={index}>
                    <CheckoutListItem name={item}/>
                </div>
            ))}
        </div>
    );
};

export default CheckoutItem;