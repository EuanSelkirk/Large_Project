import React, { useState } from 'react';
import { buildPath } from './Path';
import { useNavigate } from 'react-router-dom';

function Register()
{
    const [message,setMessage] = useState('');
    const [first,setFirst] = React.useState('');
    const [last,setLast] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();

        var obj = {firstName:first,lastName:last,email:email,login:loginName,password:loginPassword};
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/register'), {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            
            var res = JSON.parse(await response.text());

            if( res.error.length > 0 )
            {
                //setMessage( "API Error: " + res.error );
                setMessage( "Register Failed" );
            }
            else
            {
                setMessage('User has been created');
            }
        }
        catch(error:any)
        {
            setMessage(error.toString());
        }
    };

    function handleSetFirst(e:any):void
    {
        setFirst(e.target.value);
    }

    function handleSetLast(e:any):void
    {
        setLast(e.target.value);
    }
    
    function handleSetLoginName( e: any ) : void
    {
        setLoginName( e.target.value );
    }
    
    function handleSetPassword( e: any ) : void
    {
        setPassword( e.target.value );
    }

    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }

    const navigate = useNavigate();
    
    return(
        <div id="registerDiv">
            <span id="inner-title">PLEASE REGISTER</span><br />
            First Name: <input type="text" id="first" placeholder="First Name"
                onChange={handleSetFirst} /><br />
            Last Name: <input type="text" id="last" placeholder="Last Name"
                onChange={handleSetLast} /><br />
            Email: <input type="text" id="email" placeholder="name@example.com"
                onChange={handleSetEmail} /><br />
            Login: <input type="text" id="loginName" placeholder="Username"
                onChange={handleSetLoginName} /><br />
            Password: <input type="password" id="loginPassword" placeholder="Password"
                onChange={handleSetPassword} /><br />
            <input type="submit" id="registerButton" className="buttons" value = "Register"
                onClick={doRegister} /><br />
            <span id="registerResult">{message}</span><br /><br />
            <input type="button" id="loginPageButton" className="buttons" value = "Login Page"
                onClick={() => navigate('/')} />
        </div>
    );
};

export default Register;
