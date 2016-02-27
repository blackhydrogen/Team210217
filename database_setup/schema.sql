CREATE TABLE account (
	-- http://dba.stackexchange.com/questions/68266/postgresql-datatype-for-email-address/68267
	email citext PRIMARY KEY,
	-- http://stackoverflow.com/questions/1200326/what-is-the-datatype-for-a-password-in-postgresql
	salt VARCHAR(128),
	passhash VARCHAR(256),
	type VARCHAR(16) CHECK(type = 'admin' OR type = 'entrepreneur' OR type = 'patron') 
);

-- TO BE VERIFIED: password hash is not needed anymore because user authentication is done by 'account' table
CREATE TABLE entrepreneur (
	email citext PRIMARY KEY,
	name TEXT NOT NULL,
	website TEXT,
	address TEXT,
	description TEXT,
	profile_pic_url VARCHAR(256)
);

CREATE TABLE admin (
	email citext PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE patron (
	email citext PRIMARY KEY,
	name TEXT NOT NULL,
	profile_pic_url VARCHAR(256)
);

CREATE TABLE project (
	title TEXT,
	email citext REFERENCES entrepreneur(email) ON DELETE CASCADE,
	goal INT CHECK (goal > 0),
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	description TEXT,
	PRIMARY KEY (title, email),
	CHECK (start_time > end_time)
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
	amount INT,
	time TIMESTAMP
);

CREATE TABLE refund (
	ref_id SERIAL,
	trans_id SERIAL REFERENCES transaction(id),
	PRIMARY KEY (ref_id, trans_id)
);