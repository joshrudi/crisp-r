// networking helper functions

async function callGenerateUrlApi(longUrl) {

	let shortUrl = "await promise";

	let promise = axios
	.post(
		"./api/url/generate",
		{ 
		longUrl
		}
	)
	.then(response => {
		let obj = JSON.parse(response.data);
		shortUrl = obj.shortUrl;
	})
	.catch(error => {
		console.log(error);
	});

	// wait for token to return
	let result = await promise;

	return shortUrl;
}

async function callGetLongUrlApi(shortUrl) {

	let longUrl = "await promise";

	let response = await axios
	.post(
		"./api/url/getLongUrl",
		{ 
		shortUrl
		}
	)

	let obj = JSON.parse(response.data);
	longUrl = obj.longUrl;

	return longUrl;
}