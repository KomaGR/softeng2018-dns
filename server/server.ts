import app from "./app";
import front_end_app from "../client/front_end_app";

const PORT = 8765;
const PORT_front = 3000;

app.listen(PORT, ()=> {
    console.log('Express server listening on port ' + PORT);
})

front_end_app.listen(PORT_front, ()=> {
    console.log('Client is listening on port ' + PORT_front)
})