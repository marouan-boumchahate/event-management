import express from 'express';
import bodyParser from 'body-parser';
import eventRouter from './routes/event.js';
import registrationRouter from './routes/registration.js';
import userRouter from './routes/user.js';

const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use('/events', eventRouter);
app.use('/registrations', registrationRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
