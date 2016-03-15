// Algorithm: SHA1
// SALT = fundmenowthankyouverymuchpleasedonothackhahahahahahahaha
// Format = stringSALT
// E.g. Hashing "hello" will be hashing "hellofundmenowthankyouverymuchpleasedonothackhahahahahahahaha"

var sha1 = require("sha1");

var globalSalt = "fundmenowthankyouverymuchpleasedonothackhahahahahahahaha";

function getHash(string) {
	return sha1(string);
}

function getHashWithGlobalSalt(string) {
	return sha1(string + globalSalt);
}

// Generates a random string using all printable characters of
// ASCII (32_decimal " " to 126_decimal "~")
function generateRandomSalt(length) {
	var str = "";
	for(var i = 0; i < length; i++) {
		str += String.fromCharCode(
			Math.floor(Math.random() * 95) + 32
		);
	}
	return str;
}

module.exports = {
	getHash: getHash,
	getHashWithGlobalSalt: getHashWithGlobalSalt,
	generateRandomSalt: generateRandomSalt
};