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
            res.render("../client/pages/homepage.ejs");
        });
        this.front_end_app.get("/search_results", function(req, res){
            var searchTerm = req.query.search_term;
            request("https://localhost:8765/observatory/api" + searchTerm, function(error, response, body){
                if(error){
                    console.log(error);
                }else{
                    res.render("../client/pages/search_results.ejs", {
                        prodData: JSON.parse(body)
                    });
                }
            });
        });
        this.front_end_app.get("/about", function(req, res){
            res.render("../client/pages/about.ejs");
        });
        this.front_end_app.get("/login", function(req, res){
            res.render("../client/pages/login.ejs");
        });
        this.front_end_app.post("/login", function(req, res){
            var username = req.body.l_username;
            var password = req.body.l_password;
            
            res.redirect('/');
        });
        this.front_end_app.get("/sign_up", function(req, res){
            res.render("../client/pages/sign_up.ejs");
        });
        this.front_end_app.post("/sign_up", function(req, res){
            var userEmail = req.body.s_email;
            var username = req.body.s_username;
            var userPassword = req.body.s_password;
            
            res.redirect('/login');
        });
        this.front_end_app.get("/submit_product", function(req, res){
            res.render("../client/pages/submit_product.ejs");
        });
    }
}
exports.default = new Front_end_app().front_end_app;
//# sourceMappingURL=app.js.map