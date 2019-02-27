import app from "./app";
import front_end_app from "../client/front_end_app";
import * as https from 'https';
import * as fs from 'fs';

const PORT = 8765;
const PORT_front = 3000;

const httpsOptions = {
    key: fs.readFileSync('server/config/key.pem', 'utf8'),
    cert: fs.readFileSync('server/config/cert.pem', 'utf8')
};

const httpsServerFront = https.createServer(httpsOptions, front_end_app);

httpsServerFront.listen(PORT_front, ()=> {
    console.log('Client is listening on port ' + PORT_front)
})


const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(PORT, () => {
    console.log(`REST API server is listening on port ${PORT}`);
});
