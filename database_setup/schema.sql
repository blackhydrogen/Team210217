-- Stores only critical data; i.e. email (primary key), password-related fields and type.
CREATE TABLE account (
	-- http://dba.stackexchange.com/questions/68266/postgresql-datatype-for-email-address/68267
	email citext PRIMARY KEY,
	-- http://stackoverflow.com/questions/1200326/what-is-the-datatype-for-a-password-in-postgresql
	salt CHAR(64) NOT NULL, -- Lets use 64 random characters. Using ASCII's 95 printable characters, that's 95^64 possible combinations.
	passhash CHAR(40) NOT NULL, -- SHA1 algorithm. Always 40 characters (20 bytes in 40 HEX characters).
	type VARCHAR(16) CHECK(type = 'admin' OR type = 'entrepreneur' OR type = 'patron') 
);

-- TO BE VERIFIED: password hash is not needed anymore because user authentication is done by 'account' table
-- Ian: Yes
CREATE TABLE entrepreneur (
	email citext PRIMARY KEY REFERENCES account(email),
	name TEXT NOT NULL,
	website TEXT,
	address TEXT,
	description TEXT,
	profile_pic_url VARCHAR(256)
);

CREATE TABLE admin (
	email citext PRIMARY KEY REFERENCES account(email),
	name TEXT NOT NULL
);

CREATE TABLE patron (
	email citext PRIMARY KEY REFERENCES account(email),
	name TEXT NOT NULL,
	profile_pic_url VARCHAR(256)
);

CREATE TABLE project (
	title TEXT,
	email citext REFERENCES entrepreneur(email), -- removed ON DELETE CASCADE because it isn't used consistently (could be restored)
	goal INT CHECK (goal > 0) NOT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL,
	description TEXT,
	PRIMARY KEY (title, email),
	CHECK (start_time < end_time)
);

CREATE TABLE tag (
	name TEXT,
	title TEXT,
	email citext,
	FOREIGN KEY (title, email) REFERENCES project(title, email),
	PRIMARY KEY (name, title, email)
);

CREATE TABLE transaction ( 
	id SERIAL PRIMARY KEY,
	patronEmail citext REFERENCES patron(email),
	entrepreneurEmail citext,
	title citext,
	amount INT NOT NULL,
	time TIMESTAMP,
	FOREIGN KEY (entrepreneurEmail, title) REFERENCES project(email, title)
);

-- Slight change to ER digram <box>Refund</box> --- <diamond>refunded for</diamond> --- <box>transaction</box>
CREATE TABLE refund (
	id SERIAL PRIMARY KEY,
	amount INT NOT NULL,
	transactionId INT REFERENCES transaction(id)
);