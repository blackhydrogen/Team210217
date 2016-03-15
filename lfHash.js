// Algorithm: SHA1
// SALT = fundmenowthankyouverymuchpleasedonothackhahahahahahahaha
// Format = stringSALT
// E.g. Hashing "hello" will be hashing "hellofundmenowthankyouverymuchpleasedonothackhahahahahahahaha"

var sha1 = require("sha1");

var globalSalt = "fundmenowthankyouverymuchpleasedonothackhahahahahahahaha";

// Automatically hashes with the global salt. Use getHashWithoutSalt(string) for normal (i.e. unsalted) hashing.
function getHash(string) {
	return sha1(string + globalSalt);
}

function getHashWithoutSalt(string) {
	return sha1(string);
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
	getHashWithoutSalt: getHashWithoutSalt,
	generateRandomSalt: generateRandomSalt
};