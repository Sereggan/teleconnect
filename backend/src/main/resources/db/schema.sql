-- Drop existing tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_role CASCADE;
DROP TABLE IF EXISTS tariff CASCADE;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS roles_id_seq;
DROP SEQUENCE IF EXISTS tariff_id_seq;

CREATE SEQUENCE IF NOT EXISTS tariff_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS tariff (
    id INTEGER DEFAULT nextval('tariff_id_seq'),
    name VARCHAR(100) NOT NULL PRIMARY KEY,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    data_limit INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit INTEGER DEFAULT 0
    );

CREATE SEQUENCE IF NOT EXISTS roles_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS user_role (
    id INTEGER DEFAULT nextval('roles_id_seq') PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
    );

CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER DEFAULT nextval('users_id_seq') PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES user_role(id)
    );
