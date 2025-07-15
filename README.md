# Events Management - API
An Event Management REST API using Node.js, Express, and  PostgreSQL.

---
 
## Setup Instructions
1. Download and install Node.js from [https://nodejs.org/](https://nodejs.org/) if you don't have it
2. Download PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/) if you don't have it
3. Clone the repository:<br>
```https://github.com/marouan-boumchahate/event-management```
4. ```cd event-management```
5. ```npm install```
6. Ensure PostgreSQL is running and create your database manually or via script.
7. create ```.env``` file, then add the coming attributes:<br>
    - DB_USER=your-postgres-username<br>
    - DB_HOST=localhost<br>
    - DB_NAME=your-database-name<br>
    - DB_PASSWORD=your-database-password<br>
    - DB_PORT=5432<br>
8. start the server by ```node .\index.js```

---

## APIs Description
1. ### POST /events
   #### Description:
   ```
   Creates a new event
   ```
   #### Request Body:
    ```
   {
     "title": "Tech Conference 2025",
     "location": "Casablanca, Morocco", 
     "datetime": "2025-08-20 13:00:00+03",
     "capacity": 450
   }
    ```
    #### Constraints:
   1. capacity must be between (1 and 1000)
   2. datetime must be in ISO format
    #### Responses:
    ##### Status Code 201 - Created
    ```
    {
        eventID: 5
    }
    ```
    ##### Status Code 400 - Bad Request
    ```
   {
     error: "Missing fields!! (title, location, capacity and datetime) are required!"
   }
    ```
    ##### Status Code 400 - Bad Request
    ```
   {
     error: "Inavlid capacity!! range (1, 1000)"
   }
    ```
    ##### Status Code 400 - Bad Request
    ```
   {
     error: "Invalid datetime format!"
   }
    ```
    ##### Status Code 500 - Internal Server Error
    ```
   {
     error: "Server FAILED to insert the new event!!"
   }
    ```
2. ### GET /events
   #### Description:
   Retrieves all future events sorted by datetime (ascending) and location (ascending)
   
   #### Responses:
   ##### Status Code 200 - OK
   ```
   {
        "events": [
            {
                "eventID": 5,
                "title": "Tech Conference 2025",
                "location": "Casablanca, Morocco",
                "datetime": "2025-08-20T10:00:00.000Z",
                "capacity": 450
            },
            {
                "eventID": 8,
                "title": "Developer Meetup",
                "location": "Rabat, Morocco",
                "datetime": "2025-09-15T14:00:00.000Z",
                "capacity": 200
            },
            ...
        ]
   }
   ```
   ##### Status Code 500 - Internal Server Error
    ```
   {
     error: "Server FAILED to fetch events"
   }
    ```
3. ### GET /events/:id
   #### Description:
   Retrieves detailed information about a specific event including registered users
   
   #### Path Parameters:
   - `id` (integer): The ID of the event to retrieve
   
   #### Responses:
   ##### Status Code 200 - OK
    ```
    {
        "event": {
            "eventID": 5,
            "title": "Tech Conference 2025",
            "location": "Casablanca, Morocco",
            "datetime": "2025-08-20T10:00:00.000Z",
            "capacity": 450,
            "registeredUsers": [
            {
                "userID": 101,
                "name": "John Doe",
                "email": "john@example.com"
            },
            {
                "userID": 102,
                "name": "Jane Smith",
                "email": "jane@example.com"
            },
            ...
            ]
        }
    }
    ```
    ##### Status Code 404 - Not Found
    ```
    {
        "error": "Event Not Found"
    }
    ```
    ##### Status Code 404 - Not Found
    ```
    {
        "error": "Event Not Found"
    }
    ```
    ##### Status Code 500 - Internal Server Error (Event Fetch Failure)
    ```
    {
        "error": "Server FAILED to fetch the event"
    }
    ```
    ##### Status Code 500 - Internal Server Error (User Fetch Failure)
    ```
    {
        "error": "Server Failed to fetch the registered users in the event"
    }
    ```
4. ### GET /events/stats/:id
    #### Description:
    Retrieves stats for a specific event including registration numbers and capacity utilization

    #### Path Parameters:
    - `id` (integer): The ID of the event to retrieve statistics for

    #### Responses:
    ##### Status Code 200 - OK
    ```
    {
        "eventStats": {
            "total_registrations": 120,
            "remaining_capacity": 330,
            "used_capacity_percentage": 26.67
        }
    }
    ```
    ##### Status Code 404 - Not Found
    ```
    {
        "message": "Event Not Found"
    }
    ```
    ##### Status Code 500 - Internal Server Error
    ```
    {
        "error": "Server FAILED To Get Event Stats"
    }
    ```
5. ### POST /registrations
    #### Description:
    Registers a user to a specific event after validating all requirements

    #### Request Body:
    ```
    {
        "userID": 123,
        "eventID": 456
    }
    ```
    #### Constraints:
    1. Both userID and eventID are required
    2. IDs must be positive integers (1 or greater)
    3. Event must exist, be in the future, and have available capacity
    4. User must exist and not be already registered for the event
    #### Responses:
    ##### Status Code 201 - Created (Success)
    ```
    {
        "message": "User with ID=123 registered successfully in the event with ID=456"
    }
    ```
    ##### Status Code 400 - Bad Request (Missing/Invalid Fields)
    ```
    {
        "error": "Missing fields (userID, eventID) / range from 1 and up"
    }
    ```
    ##### Status Code 400 - Bad Request (Event Full)
    ```
    {
        "error": "Event is full"
    }
    ```
    ##### Status Code 400 - Bad Request (Event Ended)
    ```
    {
        "error": "The event is already ended"
    }
    ```
    ##### Status Code 400 - Bad Request (Already Registered)
    ```
    {
        "error": "User is already registered in the event"
    }
    ```
    ##### Status Code 404 - Not Found (Event)
    ```
    {
        "error": "Event Not Found"
    }
    ```
    ##### Status Code 404 - Not Found (User)
    ```
    {
        "error": "User is NOT Found"
    }
    ```
    ##### Status Code 500 - Internal Server Error (Event Fetch)
    ```
    {
        "error": "Server FAILED to fetch the event"
    }
    ```
    ##### Status Code 500 - Internal Server Error (User Fetch)
    ```
    {
        "error": "Server FAILED to fetch the user"
    }
    ```
    ##### Status Code 500 - Internal Server Error (Registration)
    ```
    {
        "error": "Server FAILED to register for the event"
    }
    ```
6. ### DELETE /registrations
    #### Description:
    Cancels a user's registration for a specific event after validating all requirements

    #### Query Parameters:
    - `userID` (integer): The ID of the user to unregister (required, positive integer)
    - `eventID` (integer): The ID of the event to unregister from (required, positive integer)

    #### Constraints:
    1. Event must exist and not be ended
    2. User must exist
    3. User must be currently registered for the event

    #### Responses:
    ##### Status Code 204 - No Content (Success)
    (Empty response body)

    ##### Status Code 400 - Bad Request (Event Ended)
    ```
    {
        "error": "The Event is already ended"
    }
    ```
    Status Code 404 - Not Found (Event)
    ```
    {
        "error": "Event NOT Found"
    }
    ```
    Status Code 404 - Not Found (User)
    ```
    {
        "error": "User NOT Found"
    }
    ```
    Status Code 404 - Not Found (Registration)
    ```
    {
        "error": "User is NOT registered to the event with ID=456"
    }
    ```
    Status Code 500 - Internal Server Error (Event Fetch)
    ```
    {
        "error": "Server FAILED to fetch the event"
    }
    ```
    Status Code 500 - Internal Server Error (User Fetch)
    ```
    {
        "error": "Server FAILED to fetch the user"
    }
    ```
    Status Code 500 - Internal Server Error (Registration Fetch)
    ```
    {
        "error": "Server FAILED to fetch event registrations"
    }
    ```
    Status Code 500 - Internal Server Error (Cancellation Failed)
    ```
    {
        "error": "Server FAILED to cancel the user registration"
    }
    ```
7. ### POST /users
    #### Description:
    Creates a new user in the system

    #### Request Body:
    ```
    {
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
    ```
    #### Constraints:
    - Both name and email fields are required
    - Email must be unique (not already registered)

    Responses:
    ##### Status Code 201 - Created (Success)
    ```
    {
        "userID": 123
    }
    ```
    ##### Status Code 400 - Bad Request (Missing Fields)
    ```
    {
        "error": "Missing fields (name, email) are required"
    }
    ```
    ##### Status Code 400 - Bad Request (Duplicate Email)
    ```
    {
        "error": "email is already exist"
    }
    ```
    ##### Status Code 500 - Internal Server Error
    ```
    {
        "error": "Server FAILED to add new user"
    }
    ```
8. ### GET /users/:id
    #### Description:
    Retrieves details of a specific user by their ID

    #### Path Parameters:
    - `id` (integer): The ID of the user to retrieve (must be positive integer)

    #### Responses:
    ##### Status Code 200 - OK (Success)
    ```
    {
        "user": {
            "id": 123,
            "name": "John Doe",
            "email": "john.doe@example.com"
        }
    }
    ```
    ##### Status Code 400 - Bad Request (Invalid ID)
    ```
    {
        "error": "The ID is missing or not greater than 0"
    }
    ```
    ##### Status Code 404 - Not Found
    ```
    {
        "error": "User NOT Found"
    }
    ```
    ##### Status Code 500 - Internal Server Error
    ```
    {
        "error": "Server FAILED to fetch the user"
    }
    ```
9. ### GET /users
    #### Description:
    Retrieves a list of all registered users in the system

    #### Responses:
    ##### Status Code 200 - OK (Success)
    ```
    {
        "users": [
            {
            "id": 123,
            "name": "John Doe",
            "email": "john@example.com",
            "created_at": "2023-05-15T10:30:00.000Z"
            },
            {
            "id": 124,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "created_at": "2023-05-16T11:45:00.000Z"
            },
            ...
        ]
    }
    ```
    ##### Status Code 500 - Internal Server Error
    ```
    {
        "error": "Server FAILED to fetch users"
    }
    ```
