DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tariff CASCADE;
DROP TABLE IF EXISTS token_blacklist CASCADE;
DROP TABLE IF EXISTS tariff_adjustment CASCADE;

-- Таблица tariff
CREATE TABLE IF NOT EXISTS tariff (
                                      id
                                      SERIAL
                                      PRIMARY
                                      KEY,
                                      name
                                      VARCHAR
(
                                      100
) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR
(
    255
) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    data_limit INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit INTEGER DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS tariff_adjustment
(
    id
    SERIAL
    PRIMARY
    KEY,
    adjusted_data_limit
    INTEGER,
    adjusted_call_minutes
    INTEGER,
    adjusted_sms_limit
    INTEGER,
    discount_percentage
    NUMERIC
(
    5,
    2
)
    );

CREATE TABLE IF NOT EXISTS users (
                                     id
                                     SERIAL
                                     PRIMARY
                                     KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tariff_id INTEGER,
    tariff_adjustment_id INTEGER,
    birth_date DATE,
    CONSTRAINT fk_tariff FOREIGN KEY
(
    tariff_id
) REFERENCES tariff
(
    id
),
    CONSTRAINT fk_tariff_adjustment FOREIGN KEY
(
    tariff_adjustment_id
) REFERENCES tariff_adjustment
(
    id
)
    );

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
