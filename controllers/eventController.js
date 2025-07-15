import db from '../db.js';

async function addEvent(title, datetime, location, capacity) {
    let ID = null;

    try{
        const response = await db.query("INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id;", [title, datetime, location, capacity]);

        ID = response.rows[0].id;
    }
    catch(err){
        console.log("Insertion Failed", err);
    }

    return ID;
}

const createEvent = async (req, res) => {
    const {title, datetime, location, capacity} = req.body;

    if(title === undefined || datetime === undefined || location === undefined || capacity === undefined)
        return res.status(400).json({error: 'Missing fields!! (title, location, capacity and datetime) are required!'});

    if(capacity < 1 || capacity > 1000)
        return res.status(400).json({error: 'Inavlid capacity!! range (1, 1000)'});


    // Ensures the event datetime is in the correct format
    const date = new Date(datetime);

    if(isNaN(date.getTime()))
        return res.status(400).json({error: 'Invalid datetime format!'});

    const ISOdatetime = date.toISOString();

    
    // Add the event
    const newEventID = await addEvent(title, ISOdatetime, location, capacity);

    if(!newEventID)
        return res.status(500).json({error: "Server FAILED to insert the new event!!"});

    return res.status(201).json({eventID: newEventID});
}



async function fetchEvent(ID) {
    try{
        const response = await db.query('SELECT * FROM events WHERE id = $1', [ID]);

        if(response.rowCount > 0) return response.rows[0];
        else return 404;
    }
    catch(err){
        console.log("Server FAILED to fetch data from events", err);
        return 500;
    }
}

async function getRegisteredUsers(eventID){
    try{
        const response = await db.query(`
            SELECT users.id, name, email
            FROM users
            JOIN event_registrations ON event_registrations.user_id = users.id
            JOIN events ON event_registrations.event_id = events.id
            WHERE events.id = $1
        `, [eventID]);

        if(response.rowCount > 0) return response.rows;
    }
    catch(err){
        console.log("Server Failed to fetch data from events", err);
        return null;
    }
}

const getEvent = async (req, res) => {
    const eventID = req.params.id;

    const event = await fetchEvent(eventID);

    if(event === 500) return res.status(500).json({error: 'Server FAILED to fetch the event'});
    if(event === 404) return res.status(404).json({error: 'Event Not Found'});

    // Fetch all the users who are in the event
    const registeredUsers = await getRegisteredUsers(eventID);

    if(registeredUsers === null)
        return res.status(500).json({error: 'Server Failed to fetch the registered users in the event'});

    // Combine registered users to the event object
    event.registeredUsers = registeredUsers || [];

    return res.status(200).json({event: event});
}

const getFutureEvents = async (req, res) => {
    try{
        const response = await db.query("SELECT * FROM events WHERE datetime > NOW() ORDER BY datetime ASC, location ASC");

        const futureEvents = response.rows;

        return res.status(200).json({events: futureEvents});
    }
    catch(err){
        console.log("Server failed to fetch events", err);
        return res.status(500).json({error: 'Server FAILED to fetch events'});
    }
}

const getEventStats = async (req, res) => {
    const eventID = req.params.id;

    try{
        const response = await db.query(`
            SELECT COALESCE(COUNT(event_registrations.user_id), 0) AS total_registrations, events.capacity
            FROM events
            LEFT JOIN event_registrations ON events.id = event_registrations.event_id
            WHERE events.id = $1
            GROUP BY events.capacity;
        `, [eventID]);

        if(response.rowCount == 0)
            return res.status(404).json({message: 'Event Not Found'});

        const eventStats = response.rows[0];

        // Create a clean event stats object
        const wholeEventStats = {
            total_registrations: parseInt(eventStats.total_registrations),
            remaining_capacity: parseInt(eventStats.capacity) - parseInt(eventStats.total_registrations),
            used_capacity_percentage: parseFloat(Number((parseInt(eventStats.total_registrations) * 100) / parseInt(eventStats.capacity)).toFixed(2))
        }

        return res.status(200).json({eventStats: wholeEventStats});

    }
    catch(err){
        console.log("Server failed to get the event stats", err);
        return res.status(500).json({error: "Server FAILED To Get Event Stats"});
    }
}

export { createEvent, getEvent, getFutureEvents, getEventStats };