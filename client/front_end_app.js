"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const routes_1 = require("../server/routes/routes");
class Front_end_app {
    constructor() {
        this.front_end_app = express();
        this.config();
    }
    config() {
        this.front_end_app.use(bodyParser.json());
        this.front_end_app.use(bodyParser.urlencoded({ extended: false }));
        routes_1.default(this.front_end_app);
        this.front_end_app.get("/", function(req, res){
            res.render("../client/homepage.ejs");
        });
        
    }
}
exports.default = new Front_end_app().front_end_app;
//# sourceMappingURL=app.js.map