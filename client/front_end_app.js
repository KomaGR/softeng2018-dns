"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const routes = require('./routes');


class Front_end_app {
    constructor() {
        this.front_end_app = express();
        this.config();
        this.staticConfig();
    }
    config() {
        this.front_end_app.use(bodyParser.json());
        this.front_end_app.use(bodyParser.urlencoded({ extended: false }));
        this.front_end_app.set('views', path.join(__dirname, 'pages'));
        
        routes.default(this.front_end_app);
    }

    staticConfig() {
        this.front_end_app.use('/css', express.static('client/pages/css'));
        this.front_end_app.use('/images', express.static('client/pages/images'))
    }
}
exports.default = new Front_end_app().front_end_app;
//# sourceMappingURL=app.js.map