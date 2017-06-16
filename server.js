var express = require("express"),
	nodeStatic = require("node-static"),
	file = new nodeStatic.Server("."),
	bodyParser = require("body-parser"),
	fs = require("fs"),
	app = express(),
	userHandlerInit = require("./backend/handlers/user-handler"),
	USERS_PATH = __dirname + "/resources/data.json",
	LISTEN_PORT = 8081;

app.use(bodyParser.json());

var users = [];

const usersJsonStr = fs.readFileSync(USERS_PATH, "utf8");

users = JSON.parse(usersJsonStr);
var userHandler = userHandlerInit(users);
app.post("/user", userHandler.add);

app.put("/user", userHandler.update);

app.get("/user", userHandler.get);

app.delete("/user", userHandler.del);

app.get("/countries", function (req, res) {
	var c = [];
	for (var i = 0; i < users.length; i++) {
		if (c.indexOf(users[i].country) === -1) {
			c.push(users[i].country);
		}
	}

	res.send(c);
});

console.log("Users API is ready...");

app.get("*", function (req, res) {
	file.serve(req, res);
});

app.listen(LISTEN_PORT);
console.log("Listen port " + LISTEN_PORT);