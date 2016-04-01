###Introduction
This document describes how the `lfRoutes.js` file works (and its purpose), and how it links to the `routes/` folder.

###Purpose
`lfRoute.js` helps to modularize each route into a seperate file.

###How It Works
So for example, say the application has 2 routes, `/login` and `/logout`.

Instead of placing the code for both routes inside a single file (usually `index.js`),
we seperate the code into 2 files: `login.js` and `logout.js`. These files are stored
inside the `routes/` folder.

What `lfRoute.js` does is then to load all files inside the `routes/` folder (thus it
will load both `login.js` and `logout.js`) and register the respective routes with the
application (usually a variable named `app`). The route names will be the respective
filenames of the .js file, so `login.js` will respond to the route `/login`.

Do note that all files inside `routes/` need to follow a particular format. Namely they
need to be a `.js` file, have a function named `handler(req, res)` and a module.exports
defined as given in the template below. The filename should be `<route_name>.js`.

###Template
Below is the template for the `.js` files inside the `routes/` folder. Be sure to name
the `.js` file as `<route_name>.js`.

```javascript
var lfDatabase = require("../lfDatabase");
var lfTools = require("../lfTools");
var lfHash = require("../lfHash");

var req;
var res;

var requestObject;
var responseObject = {};

function handler(reql, resl) {
	req = reql;
	res = resl;
	requestObject = req.body;
	
	if(!lfTools.requestObjectIsValid(requestObject))
		return;
		
	;
	
	lfTools.sendResponse(res, responseObject);
}


module.exports = {
	getHandler: function() { return handler; }
};
```