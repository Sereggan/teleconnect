-- Drop existing tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tariff CASCADE;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS tariff_id_seq;

CREATE SEQUENCE IF NOT EXISTS tariff_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS tariff (
    id INTEGER DEFAULT nextval('tariff_id_seq') UNIQUE,
    name VARCHAR(100) NOT NULL PRIMARY KEY,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    data_limit INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit INTEGER DEFAULT 0
    );

CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER DEFAULT nextval('users_id_seq') PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tariff_id INTEGER,
    CONSTRAINT fk_tariff FOREIGN KEY (tariff_id) REFERENCES tariff(id)
    );
