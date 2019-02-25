import app from "./app";
import * as https from 'https';
import * as fs from 'fs';

const PORT = 8765;

const httpsOptions = {
    key: fs.readFileSync('server/config/key.pem', 'utf8'),
    cert: fs.readFileSync('server/config/cert.pem', 'utf8')
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(PORT, () => {
    console.log(`REST API server listening on port ${PORT}`);
});