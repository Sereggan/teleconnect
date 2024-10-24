DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tariff CASCADE;
DROP TABLE IF EXISTS token_blacklist CASCADE;
DROP TABLE IF EXISTS tariff_adjustment CASCADE;
DROP TABLE IF EXISTS password_reset_token CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;

CREATE TABLE IF NOT EXISTS tariff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    data_limit INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit INTEGER DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    family_name VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tariff_id INTEGER,
    birth_date DATE NOT NULL,
    CONSTRAINT fk_tariff FOREIGN KEY (tariff_id) REFERENCES tariff(id)
    );

CREATE TABLE IF NOT EXISTS tariff_adjustment (
    id SERIAL PRIMARY KEY,
    data_limit INTEGER,
    call_minutes INTEGER,
    sms_limit INTEGER,
    price NUMERIC(5, 2),
    tariff_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_tariff FOREIGN KEY (tariff_id) REFERENCES tariff(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS token_blacklist (
    id SERIAL PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );

CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(100) NOT NULL,
    original_file_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    file_size INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    resolution TEXT,
    created_at TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
