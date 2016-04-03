--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE account (
    email citext NOT NULL,
    salt character(64) NOT NULL,
    hash character(40) NOT NULL,
    type character varying(16) NOT NULL,
    CONSTRAINT account_type_check CHECK ((((type)::text = 'admin'::text) OR ((type)::text = 'entrepreneur'::text) OR ((type)::text = 'patron'::text)))
);


ALTER TABLE account OWNER TO letsfund;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE admin (
    email citext NOT NULL,
    name text NOT NULL
);


ALTER TABLE admin OWNER TO letsfund;

--
-- Name: entrepreneur; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE entrepreneur (
    email citext NOT NULL,
    name text NOT NULL,
    website text,
    address text,
    description text
);


ALTER TABLE entrepreneur OWNER TO letsfund;

--
-- Name: patron; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE patron (
    email citext NOT NULL,
    name text NOT NULL
);


ALTER TABLE patron OWNER TO letsfund;

--
-- Name: project; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE project (
    title text NOT NULL,
    email citext NOT NULL,
    goal numeric NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    description text,
    CONSTRAINT project_check CHECK ((start_time < end_time)),
    CONSTRAINT project_goal_check CHECK ((goal > (0)::numeric))
);


ALTER TABLE project OWNER TO letsfund;

--
-- Name: refund; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE refund (
    amount numeric NOT NULL,
    "time" timestamp without time zone,
    transactionid integer NOT NULL
);


ALTER TABLE refund OWNER TO letsfund;

--
-- Name: session; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO letsfund;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE tag (
    name text NOT NULL,
    title text NOT NULL,
    email citext NOT NULL
);


ALTER TABLE tag OWNER TO letsfund;

--
-- Name: transaction; Type: TABLE; Schema: public; Owner: letsfund
--

CREATE TABLE transaction (
    id integer NOT NULL,
    patronemail citext,
    entrepreneuremail citext,
    title text,
    amount numeric NOT NULL,
    "time" timestamp without time zone
);


ALTER TABLE transaction OWNER TO letsfund;

--
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: letsfund
--

CREATE SEQUENCE transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transaction_id_seq OWNER TO letsfund;

--
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: letsfund
--

ALTER SEQUENCE transaction_id_seq OWNED BY transaction.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY transaction ALTER COLUMN id SET DEFAULT nextval('transaction_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY account (email, salt, hash, type) FROM stdin;
admin@letsfund.com	UiOJ*L}/%@eb0X]dyC.z$L<1v'VMlK$fMTfn"2j+p,IZxB9:PkG3hl^,_sL"$]TW	b9b2a0cffdd2b6cb5cdb64ff8becac21af146829	admin
e1@gmail.com	eYmUa^0)0|2+N[T_g n$I2ZhUr}s1oh&aV\\vq::$b?'UiK:!d=56&v^e:XdY+)up	264074212e5c27b8db7c71883bf29c375736002f	entrepreneur
p2@gmail.com	Q2IL?Yvt%WI'fD,q_i[`MR(tXkP;;,)/ M.<Qw[[6:4&4:C<aw?lGpFzw|2Qb?3\\	26c1b697ccfd65571b297d8ef06a459b6c7aec21	patron
e2@gmail.com	TGvDAriM?eZ~G`/vXsOnAE'c?r66`uO8eDPjIM|tXTTY^9DPNO:IF"%|qyU}t|y(	2c00898bc0513feea1aeefc3cd23d454998232dd	entrepreneur
p1@gmail.com	/#QOi$}r{ea~nD==A 9YuwBm:LECxC{;?78$xy&])W.\\}) F/rEX{e'G;P(eg@3m	c49244ec252272ec9fa75fc7a0ecd8c00a059d42	patron
\.


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY admin (email, name) FROM stdin;
admin@letsfund.com	Admin
\.


--
-- Data for Name: entrepreneur; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY entrepreneur (email, name, website, address, description) FROM stdin;
e2@gmail.com	Entre 2		Somewhere on earth.	Dummy entre account 2.
e1@gmail.com	Entre 1	www.hello.com		
\.


--
-- Data for Name: patron; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY patron (email, name) FROM stdin;
p2@gmail.com	Patron 2
p1@gmail.com	Patron 1
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY project (title, email, goal, start_time, end_time, description) FROM stdin;
Fund for Xbox & PS4	e2@gmail.com	7000	2016-03-23 05:21:46	2016-04-03 19:08:26	thx a lotz
Project 2	e2@gmail.com	145000	2016-03-25 02:36:49	2016-04-05 16:23:29	Proj 2 Desc
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY refund (amount, "time", transactionid) FROM stdin;
-100.5	2016-03-24 19:20:28.2	1
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY session (sid, sess, expire) FROM stdin;
4YWcxK54g649S_rDixeB41dH9fWODUY8	{"cookie":{"originalMaxAge":86400000,"expires":"2016-03-27T03:11:57.803Z","httpOnly":true,"path":"/"},"email":"admin@letsfund.com","type":"admin"}	2016-03-27 12:01:24
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY tag (name, title, email) FROM stdin;
xbox	Fund for Xbox & PS4	e2@gmail.com
pls	Fund for Xbox & PS4	e2@gmail.com
thx	Fund for Xbox & PS4	e2@gmail.com
help	Fund for Xbox & PS4	e2@gmail.com
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: letsfund
--

COPY transaction (id, patronemail, entrepreneuremail, title, amount, "time") FROM stdin;
1	p1@gmail.com	e2@gmail.com	Fund for Xbox & PS4	100.5	2016-03-23 06:02:40.689
2	p1@gmail.com	e2@gmail.com	Fund for Xbox & PS4	50	2016-03-24 06:02:40.4
\.


--
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: letsfund
--

SELECT pg_catalog.setval('transaction_id_seq', 2, true);


--
-- Name: account_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY account
    ADD CONSTRAINT account_pkey PRIMARY KEY (email);


--
-- Name: admin_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (email);


--
-- Name: entrepreneur_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY entrepreneur
    ADD CONSTRAINT entrepreneur_pkey PRIMARY KEY (email);


--
-- Name: patron_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY patron
    ADD CONSTRAINT patron_pkey PRIMARY KEY (email);


--
-- Name: project_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_pkey PRIMARY KEY (title, email);


--
-- Name: refund_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (transactionid);


--
-- Name: session_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (name, title, email);


--
-- Name: transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- Name: admin_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY admin
    ADD CONSTRAINT admin_email_fkey FOREIGN KEY (email) REFERENCES account(email) ON UPDATE CASCADE;


--
-- Name: entrepreneur_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY entrepreneur
    ADD CONSTRAINT entrepreneur_email_fkey FOREIGN KEY (email) REFERENCES account(email) ON UPDATE CASCADE;


--
-- Name: patron_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY patron
    ADD CONSTRAINT patron_email_fkey FOREIGN KEY (email) REFERENCES account(email) ON UPDATE CASCADE;


--
-- Name: project_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_email_fkey FOREIGN KEY (email) REFERENCES entrepreneur(email) ON UPDATE CASCADE;


--
-- Name: refund_transactionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY refund
    ADD CONSTRAINT refund_transactionid_fkey FOREIGN KEY (transactionid) REFERENCES transaction(id) ON UPDATE CASCADE;


--
-- Name: tag_title_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_title_fkey FOREIGN KEY (title, email) REFERENCES project(title, email) ON UPDATE CASCADE;


--
-- Name: transaction_entrepreneuremail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY transaction
    ADD CONSTRAINT transaction_entrepreneuremail_fkey FOREIGN KEY (entrepreneuremail, title) REFERENCES project(email, title) ON UPDATE CASCADE;


--
-- Name: transaction_patronemail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: letsfund
--

ALTER TABLE ONLY transaction
    ADD CONSTRAINT transaction_patronemail_fkey FOREIGN KEY (patronemail) REFERENCES patron(email) ON UPDATE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

