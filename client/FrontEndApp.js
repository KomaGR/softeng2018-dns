const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const routes = require('./routes');


class FrontEndApp {
    constructor() {
        this.front_end_app = express();
        this.config();
    }

    config() {
        // support application/json type post data
        this.front_end_app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.front_end_app.use(bodyParser.urlencoded({ extended: false }));

        // Override ejs 'views' directory with 'pages' directory
        this.front_end_app.set('views', path.join(__dirname, 'pages'));

        // Serving static files starts from client/pages
        this.front_end_app.use(express.static('client/pages'));
        
        routes.default(this.front_end_app);
    }
}

exports.default = new FrontEndApp().front_end_app;