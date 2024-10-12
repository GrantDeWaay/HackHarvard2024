import React from 'react';

interface CheckoutListItemProps {
    name: string;
}

const CheckoutListItem: React.FC<CheckoutListItemProps> = ({ name }) => {
    const onionFormat = (entry: string): string => {
        let returnStr = "ON RING";
    
        if (entry.includes('s')) {
            returnStr += "\n\tSML";
        } else if (entry.includes('l')) {
            returnStr += "\n\tLRG";
        }
        return returnStr;
    };
     
    const friesFormat = (entry: string): string => {
        let returnStr = "";
    
        if (entry.includes('s')) {
            returnStr += "SML";
        } else if (entry.includes('m')) {
            returnStr += "MED";
        } else if (entry.includes('l')) {
            returnStr += "LRG";
        }
    
        returnStr += " FRIES";
        return returnStr;
    };

    const shakeFormat = (entry: string) : string => {
        let returnStr = ""
        if (entry.includes('s')){
            returnStr = returnStr + "SML"
        }
        else if (entry.includes('l')){
            returnStr = returnStr + "LRG"
        }
        returnStr += " SHAKE";
        if (entry.includes('c')){
            returnStr = returnStr + "\n\tCHCL"
        }
        else if (entry.includes('v')){
            returnStr = returnStr + "\n\tVNL"
        }
        else if (entry.includes('S')){
            returnStr = returnStr + "\n\tSTRWBRY"
        }
        return returnStr
    };

    const burgerFormat = (entry: string) : string => {
        let returnStr = "BURGER"
        if (entry.includes('l')){
            returnStr = returnStr + "\n\tNO LTCE"
        }
        if (entry.includes('t')){
            returnStr = returnStr + "\n\tNO TOMTO"
        }
        if (entry.includes('o')){
            returnStr = returnStr + "\n\tNO ONION"
        }
        if (entry.includes('c')){
            returnStr = returnStr + "\n\tNO CHEES"
        }
        if (entry.includes('s')){
            returnStr = returnStr + "\n\tNO SAUS"
        }
        return returnStr
    };

    let styledText = ""
    
    if (name[0] === 'b'){
        styledText = burgerFormat(name.substring(6, name.length))
    }

    else if (name[0] === 's') {
        styledText = shakeFormat(name.substring(5, name.length)) //5
    }
    else if (name[0] === 'f'){
        // print("is this reaching?")
        styledText = friesFormat(name.substring(5, name.length)) // 5 
    }
    else if (name[0] === 'o'){
        styledText = onionFormat(name.substring(11, name.length)) // 11
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid black', padding: '0', margin: '0' }}>
            <pre>{styledText}</pre>
        </div>
    );
};

export default CheckoutListItem;