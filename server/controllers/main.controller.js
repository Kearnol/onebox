const crypto = require("crypto");
const SECRET = "iv9y66e3u58l3t2crzdrh55c";

module.exports.index = (req, res) => {
	res.json({
		message: "Hello World",
	});
};

module.exports.webhookCheck = (req, res) => {
	console.log(req.query.challenge);
	res.send(req.query.challenge);
};

module.exports.webhook = (req, res) => {
	// Verify the request to make sure it's actually from Nylas.
	if (!verify_nylas_request(req)) {
		console.log("Failed to verify nylas");
		return res.status(401).send("X-Nylas-Signature failed verification 🚷 ");
	}

	// A quick 200 response tells Nylas your endpoint is online and healthy.
	res.sendStatus(200);

	// Nylas sent us a webhook notification for some kind of event, so we should
	// process it!
	const data = req.body.deltas;
	console.log(JSON.stringify(data, null, 2));
	for (var i = 0; i < data.length; i++) {
		// Print some of the information Nylas sent us. This is where you
		// would normally process the webhook notification and do things like
		// fetch relevant message ids, update your database, etc.
		console.log(
			"%s at %s with id %s",
			data[i].type,
			data[i].date,
			data[i].object_data.id
		);
	}
};

// Each request made by Nylas includes an X-Nylas-Signature header. The header
// contains the HMAC-SHA256 signature of the request body, using your client
// secret as the signing key. This allows your app to verify that the
// notification really came from Nylas.
function verify_nylas_request(req) {
	const digest = crypto
		.createHmac("sha256", SECRET)
		.update(req.rawBody)
		.digest("hex");
	return digest === req.get("x-nylas-signature");
}

