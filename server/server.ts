import app from "./app";

const PORT = 3000; // change to 8765

app.listen(PORT, ()=> {
    console.log('Express server listening on port ' + PORT);
})