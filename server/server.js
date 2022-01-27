const express = require('express');
const cors = require('cors');
const port = 8000;
app = express();
app.use(cors());
// app.use(express.json());
app.use(function (req, res, next) {
	req.rawBody = "";
	req.on("data", (chunk) => (req.rawBody += chunk));
	req.on("error", (err) => res.status(500).send("Error parsing body"));

	req.on("end", () => {
		// because the stream has been consumed, other parsers like bodyParser.json
		// cannot stream the request data and will time out so we must explicitly parse the body
		try {
			req.body = req.rawBody.length ? JSON.parse(req.rawBody) : {};
			next();
		} catch (err) {
			res.status(500).send("Error parsing body");
		}
	});
});
app.use(express.urlencoded({extended: true}))
require ("../server/routes/main.routes" )(app)
app.listen(port, ()=> console.log(`Listening at port ${port}`))



