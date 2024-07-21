CREATE SEQUENCE IF NOT EXISTS tariff_id_seq start with 1;

CREATE TABLE IF NOT EXISTS tariff
(
    id           INTEGER DEFAULT nextval('tariff_id_seq'),
    name         VARCHAR(100)   NOT NULL PRIMARY KEY,
    price        NUMERIC(10, 2) NOT NULL,
    description  VARCHAR(255),
    is_active    BOOLEAN DEFAULT FALSE,
    data_limit   INTEGER DEFAULT 0,
    call_minutes INTEGER DEFAULT 0,
    sms_limit    INTEGER DEFAULT 0
);
