import db from '../db.js';


const createUser = async (req, res) => {
    const {name, email} = req.body;

    if(name === undefined || email === undefined)
        return res.status(400).json({error: 'Missing fields (name, email) are required'});

    try{
        const response = await db.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id;", [name, email]);

        const userID = response.rows[0].id;

        return res.status(201).json({userID: userID});
    }
    catch(err){
        // The email is UNIQUE cannot be duplicated
        if(err.code === '23505')
            return res.status(400).json({error: 'email is already exist'});
        
        console.log("Server FAILED to add new user");
        return res.status(500).json({error: 'Server FAILED to add new user'});
    }
}

const getUsers = async (req, res) => {
    try{
        const response = await db.query("SELECT * FROM users;");

        const users = response.rows;

        return res.status(200).json({users: users});
    }
    catch(err){
        console.log("Server FAILED to fetch users");
        return res.status(500).json({error: 'Server FAILED to fetch users'});
    }
}

const getUser = async (req, res) => {
    const userID = req.params.id;

    if(userID === undefined || userID <= 0)
        return res.status(400).json({error: 'The ID is missing or not greater than 0'});

    try{
        const response = await db.query("SELECT * FROM users WHERE id = $1;", [userID]);

        // if no row returns that means there is no user by that ID
        if(response.rowCount <= 0)
            return res.status(404).json({error: 'User NOT Found'});

        const user = response.rows[0];

        return res.status(200).json({user: user});
    }
    catch(err){
        console.log("Server FAILED to fetch users");
        return res.status(500).json({error: 'Server FAILED to fetch the user'});
    }
}

export { createUser, getUser, getUsers }