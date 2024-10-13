import React from 'react';
import CheckoutListItem from './CheckoutListItem';

interface CheckoutItemProps {
    items: string[];
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ items }) => {
    if(items?.length == 0){

        return( 
        <div className='textbox'>
                <CheckoutListItem name={"No Items"}/>
        </div>)
    }
    else{
        return (
            <div className='textbox'>
                {items.map((item, index) => (
                    <div key={index}>
                        <CheckoutListItem name={item}/>
                    </div>
                ))}
            </div>
        );
    }

};

export default CheckoutItem;