require('express');
require('mongodb');

exports.setApp = function ( app, client )
{
    app.post('/api/addcard', async (req, res, next) =>
    {
        // incoming: userId, color
        // outgoing: error

        var token = require('./createJWT.js');
        
        const { userId, card, jwtToken } = req.body;

        try
        {
            if(token.isExpired(jwtToken))
            {
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
        }
        catch(e)
        {
            console.log(e.message);
        }

        const newCard = {Card:card,UserId:userId};
        var error = '';
        
        try
        {
            const db = client.db('COP4331Cards');
            const result = db.collection('Cards').insertOne(newCard);
        }
        catch(e)
        {
            error = e.toString();
        }

        var refreshedToken = null;
        try
        {
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e)
        {
            console.log(e.message);
        }

        var ret = { error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) =>
    {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
        
        var error = '';

        const { login, password } = req.body;

        const db = client.db('COP4331Cards');
        const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
        
        var id = -1;
        var fn = '';
        var ln = '';
        
        if( results.length > 0 )
        {
            id = results[0].UserID;
            fn = results[0].FirstName;
            ln = results[0].LastName;

            try
            {
                const token = require("./createJWT.js");
                ret = token.createToken(fn, ln, id);
            }
            catch(e)
            {
                ret = {error:e.message};
            }
        }
        else
        {
            ret = {error:"Login/Password incorrect"};
        }
        
        //var ret = { id:id, firstName:fn, lastName:ln, error:''};
        res.status(200).json(ret);
    });

    app.post('/api/searchcards', async (req, res, next) =>
    {
        // incoming: userId, search
        // outgoing: results[], error

        var token = require('./createJWT.js');
        
        var error = '';

        const { userId, search, jwtToken } = req.body;

        try
        {
            if(token.isExpired(jwtToken))
            {
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
        }
        catch(e)
        {
            console.log(e.message);
        }

        var _search = search.trim();

        const db = client.db('COP4331Cards');
        const results = await db.collection('Cards').find({
            "Card":{$regex:_search+'.*', $options:'i'}, 
            "UserId": userId
        }).toArray();

        var _ret = [];
        for( var i=0; i<results.length; i++ )
        {
            _ret.push( results[i].Card );
        }

        var refreshedToken = null;
        try
        {
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e)
        {
            console.log(e.message);
        }
        
        var ret = { results:_ret, error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    });

    app.post('/api/register', async (req, res, next) =>
    {
        // incoming: firstName, lastName, login, password, email
        // outgoing: id, firstName, lastName, email, error, jwtToken

        const { firstName, lastName, login, password , email } = req.body;
        const db = client.db('COP4331Cards');

        try
        {
            // Check for existing user
            const existing = await db.collection('Users').findOne({ Login: login });
            if (existing)
            {
                return res.status(200).json({ error: 'User already exists' });
            }

            // Get the current max UserID
            const maxUser = await db.collection('Users')
                .find().sort({ UserID: -1 }).limit(1).toArray();

            const newUserId = maxUser.length > 0 ? maxUser[0].UserID + 1 : 1;

            const newUser = {
                UserID: newUserId,
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Login: login,
                Password: password
            };

            await db.collection('Users').insertOne(newUser);

            // Generate JWT
            const token = require("./createJWT.js");
            const jwt = token.createToken(firstName, lastName, newUserId);

            res.status(200).json({
                id: newUserId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                error: '',
                jwtToken: jwt.jwtToken
            });
        }
        catch (e)
        {
            res.status(500).json({ error: e.toString(), jwtToken: '' });
        }
    });
}
