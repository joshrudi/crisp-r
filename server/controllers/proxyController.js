
// init flag used to track if admin firebase object has been set up already
var isInit = false;

function firebaseAdminInit() {

	// firebase setup
	let admin = require("firebase-admin")

	// init admin if it has not yet been done
	if (!isInit) {

		// Fetch the service account key JSON file contents
		let serviceAccount = require("./../auth/firebase/crisp-r-firebase-adminsdk-g7x2x-835a63bb40.json")

		// Initialize the app with a service account, granting admin privileges
		admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://crisp-r.firebaseio.com"
		})

		// set init flag
		isInit = true;
	}

	return admin
}

async function getShortUrlIfCorrespondingLongUrlExists(admin, longUrl) {

	let snapshot = await admin.database().ref('/URLS/LONG/' + longUrl).once('value')

	return snapshot.exists() ? snapshot.child('shortUrl').val() : null
}

async function getLongUrlIfCorrespondingShortUrlExists(admin, shortUrl) {

	let snapshot = await admin.database().ref('/URLS/SHORT/' + shortUrl).once('value')

	return snapshot.exists() ? snapshot.child('longUrl').val() : null
}

async function setShortUrl(admin, shortUrl, longUrl, longUrlPath) {

	await admin.database().ref('/URLS/SHORT/' + shortUrl).set({
		longUrl: longUrl
	})

	await admin.database().ref('/URLS/LONG/' + longUrlPath).set({
		shortUrl: shortUrl
	})
}

async function checkIfShortUrlAlreadyExists(admin, shortUrl) {

	let snapshot = await admin.database().ref('/URLS/SHORT/' + shortUrl).once('value')

	return snapshot.exists()
}

function generateRandomShortUrl() {

	return Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5)
}

exports.generateUrl = async function (req, res) {

	let admin = firebaseAdminInit()
	let longUrl = req.body.longUrl
	let longUrlPath = longUrl.replace(/[\[\]\.\#\$]+/g, '') // path cannot contain [].#$

	let preexistingShortUrl = await getShortUrlIfCorrespondingLongUrlExists(admin, longUrlPath)
	if (preexistingShortUrl != null) {

		res.json('{ \"shortUrl\" : \"' + preexistingShortUrl + '\" }')
		return
	}

	let candidateShortUrl = generateRandomShortUrl()
	while (await checkIfShortUrlAlreadyExists(admin, candidateShortUrl)) {

		candidateShortUrl = generateRandomShortUrl()
	}
	
	await setShortUrl(admin, candidateShortUrl, longUrl, longUrlPath)

	res.json('{ \"shortUrl\" : \"' + candidateShortUrl + '\" }')
}

exports.getLongUrl = async function (req, res) {

	let admin = firebaseAdminInit()
	let shortUrl = req.body.shortUrl
	
	let longUrl = await getLongUrlIfCorrespondingShortUrlExists(admin, shortUrl)

	if (longUrl == null) {
		longUrl = "none"
	}

	res.json('{ \"longUrl\" : \"' + longUrl + '\" }')
}