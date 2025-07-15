import db from '../db.js';

async function getEventStats(eventID){
    try{
        const response = await db.query(`
            SELECT COALESCE(count(event_registrations.user_id), 0) as "total_registrations", events.capacity, events.datetime
            FROM events
            LEFT JOIN event_registrations ON events.id = event_registrations.event_id
            WHERE events.id = $1
            GROUP BY events.capacity, events.datetime;
        `, [eventID]);

        if(response.rowCount > 0) return response.rows[0];

        return 404;
    }
    catch(err){
        console.log("Server failed to get the event", err);
        return 500;
    }
}

async function getUser(userID){
    try{
        const response = await db.query("SELECT * FROM users WHERE id = $1", [userID]);

        if(response.rowCount > 0)
            return response.rows[0];

        return 404;
    }
    catch(err){
        console.log("Server FAILED to fetch the user");
    }

    return 500;
}

async function linkUserWithEvent(userID, eventID){
    try{
        const response = await db.query("INSERT INTO event_registrations (user_id, event_id) VALUES ($1, $2);", [userID, eventID]);

        return 201;
    }
    catch(err){
        // constraint error (userID and eventID cannot be duplicated together)
        if(err.code === '23505')
            return 400;

        console.log("Server FAILED to register for event");
        return 500;
    }
}


const registerUserToEvent = async (req, res) => {
    const {userID, eventID} = req.body;

    if(userID === undefined || eventID === undefined || userID <= 0 || eventID <= 0)
        return res.status(400).json({error: "Missing fields (userID, eventID) / range from 1 and up"});


    // Ensures the event is exist, not ended and not full
    const eventStats = await getEventStats(eventID);

    if(eventStats === 404)
        return res.status(404).json({error: 'Event Not Found'});
    if(eventStats === 500)
        return res.status(500).json({error: 'Server FAILED to fetch the event'});

    if(eventStats.total_registrations >= eventStats.capacity)
        return res.status(400).json({error: 'Event is full'});

    if(new Date(eventStats.datetime) <= new Date())
        return res.status(400).json({error: 'The event is already ended'});


    
    // Ensures the user is exist
    const user = await getUser(userID);

    if(user === 404)
        return res.status(404).json({error: 'User is NOT Found'});
    else if(user === 500)
        return res.status(500).json({error: 'Server FAILED to fetch the user'});



    // Ensures the user is not already registered in the event. Then, Add it to the event
    const registerUserStatus = await linkUserWithEvent(userID, eventID);

    if(registerUserStatus === 400)
        return res.status(400).json({error: 'User is already registered in the event'});
    if(registerUserStatus === 500)
        return res.status(500).json({error: 'Server FAILED to register for the event'});


    return res.status(201).json({message: `User with ID=${userID} registered successfully in the event with ID=${eventID}`});
}



async function isUserRegistered(userID, eventID) {
    try{
        const response = await db.query('SELECT * FROM event_registrations WHERE event_id = $1 and user_id = $2;', [eventID, userID]);

        if(response.rowCount > 0) 
            return true;
        
        return false;
    }
    catch(err){
        console.log('Server FAILED to fetch event registrations', err);
        return 500;
    }
}

async function deleteRegistration(userID, eventID){
    try{
        await db.query('DELETE FROM event_registrations WHERE event_id = $1 and user_id = $2', [eventID, userID]);
    }
    catch(err){
        console.log("Server FAILED to delete a user registration event", err);
        return false;
    }

    return true;
}

const cancelRegistration = async (req, res) => {
    const { userID, eventID } = req.query;

    // Ensures the event is exist and not ended
    const eventStats = getEventStats(eventID);

    if(eventStats === 404)
        return res.status(404).json({error: 'Event NOT Found'});
    else if(new Date(eventStats.datetime) <= new Date())
        return res.status(400).json({error: 'The Event is already ended'});
    else if(eventStats === 500)
        return res.status(500).json({error: 'Server FAILED to fetch the event'});
    
    
    
    // Ensures the user is exist
    const user = await getUser(userID);
    
    if(user === 404)
        return res.status(404).json({error: 'User NOT Found'});
    else if(user === 500)
        return res.status(500).json({error: 'Server FAILED to fetch the event'});
    
    
    
    // Ensures the user is already in the event
    const registrationFound = await isUserRegistered(userID, eventID);
    
    if(registrationFound === false)
        return res.status(404).json({error: `User is NOT registered to the event with ID=${eventID}`})
    else if(registrationFound === 500)
        return res.status(500).json({error: 'Server FAILED to fetch event registrations'});
    
    
    
    // Cancel the User registration
    const isDeleted = await deleteRegistration(userID, eventID);
    
    if(isDeleted)
        return res.status(204);
    
    return res.status(500).json({error: 'Server FAILED to cancel the user registration'});
}

export { registerUserToEvent, cancelRegistration };