import React, { useState } from 'react';
import { buildPath } from './Path';
import { retrieveToken, storeToken } from '../tokenStorage';

function CardUI()
{
    /*let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : string = ud.id;*/
    //let firstName : string = ud.firstName;
    //let lastName : string = ud.lastName;
    
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    const [search,setSearchValue] = React.useState('');
    const [card,setCardNameValue] = React.useState('');

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(String(_ud));
    var userId = ud.id;
    //var firstName = ud.firstName;
    //var lastName = ud.lastName;

    /*const app_name = 'cop4331group5.xyz';

    function buildPath(route:string) : string
    {
        if (import.meta.env.MODE != 'development')
        {
            return 'http://' + app_name + ':5000/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }*/
    
    async function addCard(e:any) : Promise<void>
    {
        e.preventDefault();
        
        //let obj = {userId:userId,card:card};
        //let js = JSON.stringify(obj);

        var obj = {userId:userId,card:card,jwtToken:retrieveToken()};
        var js = JSON.stringify(obj);
        
        try
        {
            //const response = await
            //fetch('http://localhost:5000/api/addcard', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            //fetch('http://cop4331group5.xyz:5000/api/addcard', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            const response = await fetch(buildPath('api/addCard'), {method:'POST',body:js,headers:{'Content-Type':'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);
            
            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Card has been added');
                storeToken( res.jwtToken );
            }
        }
        catch(error:any)
        {
            setMessage(error.toString());
        }
    };
    
    async function searchCard(e:any) : Promise<void>
    {
        e.preventDefault();

        var obj = {userId:userId,search:search,jwtToken:retrieveToken()};
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/searchCards'), {method:'POST',body:js,headers:{'Content-Type':'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);
            let _results = res.results;
            let resultText = '';
            
            for( let i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                
                if( i < _results.length - 1 )
                {
                    resultText += ', ';
                }
            }
            
            setResults('Card(s) have been retrieved');
            storeToken( res.jwtToken );
            setCardList(resultText);
        }
        catch(error:any)
        {
            alert(error.toString());
            setResults(error.toString());
        }
    };

    function handleSearchTextChange( e: any ) : void
    {
        setSearchValue( e.target.value );
    }
    
    function handleCardTextChange( e: any ) : void
    {
        setCardNameValue( e.target.value );
    }
    
    /*return(
        <div id="accessUIDiv">
            <br />
            Search: <input type="text" id="searchText" placeholder="Card To Search For" 
                onChange={handleSearchTextChange} />
            <button type="button" id="searchCardButton" className="buttons" 
                onClick={searchCard}> Search Card </button><br />
            <span id="cardSearchResult">{searchResults}</span>
            <p id="cardList">{cardList}</p><br /><br />
            Add: <input type="text" id="cardText" placeholder="Card To Add" 
                onChange={handleCardTextChange} />
            <button type="button" id="addCardButton" className="buttons" 
                onClick={addCard}> Add Card </button><br />
            <span id="cardAddResult">{message}</span>
        </div>
    );*/

    return(
        <div id="cardUIDiv">
            <br />
            Search: <input type="text" id="searchText" placeholder="Card To Search For"
                onChange={handleSearchTextChange} />
            <button type="button" id="searchCardButton" className="buttons"
                onClick={searchCard}> Search Card</button><br />
            <span id="cardSearchResult">{searchResults}</span>
            <p id="cardList">{cardList}</p><br /><br />
            Add: <input type="text" id="cardText" placeholder="Card To Add"
                onChange={handleCardTextChange} />
            <button type="button" id="addCardButton" className="buttons"
                onClick={addCard}> Add Card </button><br />
            <span id="cardAddResult">{message}</span>
        </div>
    );
}

export default CardUI;
