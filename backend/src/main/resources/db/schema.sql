DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tariff CASCADE;
DROP TABLE IF EXISTS token_blacklist CASCADE;

DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS tariff_id_seq;
DROP SEQUENCE IF EXISTS token_blacklist_id_seq;

CREATE SEQUENCE IF NOT EXISTS tariff_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS tariff (
    id INTEGER DEFAULT nextval('tariff_id_seq') UNIQUE,
    name VARCHAR(100) NOT NULL PRIMARY KEY,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR
(
    255
) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    data_limit INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit INTEGER DEFAULT 0,
    valid_from DATE,
    valid_to DATE
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
    birth_date DATE,
    CONSTRAINT fk_tariff FOREIGN KEY (tariff_id) REFERENCES tariff(id)
    );

CREATE SEQUENCE IF NOT EXISTS token_blacklist_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS token_blacklist
(
    id
    SERIAL
    PRIMARY
    KEY,
    token
    VARCHAR
(
    512
) NOT NULL,
    token_type VARCHAR
(
    50
) NOT NULL,
    user_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY
(
    user_id
) REFERENCES users
(
    id
)
    );

CREATE INDEX IF NOT EXISTS idx_expiry_date ON token_blacklist(expiry_date);
