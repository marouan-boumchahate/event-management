# event-management
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
     DB_USER=your-postgres-username<br>
     DB_HOST=localhost<br>
     DB_NAME=your-database-name<br>
     DB_PASSWORD=your-database-password<br>
     DB_PORT=5432<br>
8. finally run ```node .\index.js```

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
   ```
      + 1 <= capacity <= 1000,
      + datetime must be in ISO format
   ```
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
   

