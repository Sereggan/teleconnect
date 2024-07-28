INSERT INTO tariff (name, price, description, is_active, data_limit, call_minutes, sms_limit)
VALUES ('Basic Plan', 19.99, 'Basic plan with limited features', true, 5000, 100, 50),
       ('Premium Plan', 49.99, 'Premium plan with extended features', true, 20000, 500, 200),
       ('Unlimited Plan', 79.99, 'Unlimited data, calls, and SMS', true, null, null, null),
       ('Family Plan', 59.99, 'Plan for families with 4 members', true, 50000, 2000, 1000);

-- Insert roles
INSERT INTO user_role (id, name) VALUES (nextval('roles_id_seq'), 'ROLE_ADMIN');
INSERT INTO user_role (id, name) VALUES (nextval('roles_id_seq'), 'ROLE_EMPLOYEE');
INSERT INTO user_role (id, name) VALUES (nextval('roles_id_seq'), 'ROLE_CUSTOMER');

-- Admin
INSERT INTO users (id, username, phone_number, password, email, name, surname, role_id, tariff_id)
VALUES (nextval('users_id_seq'), 'admin', '0000000000', '$2a$10$Dow1q7l7wrOX9w4.GfNayOefzYBcOaXn/L8OS.MuTewMOJxoJ7d1e', 'admin@example.com', 'Admin', 'User', (SELECT id FROM user_role WHERE name = 'ROLE_ADMIN'), NULL);

-- Employee
INSERT INTO users (id, username, phone_number, password, email, name, surname, role_id, tariff_id)
VALUES (nextval('users_id_seq'), 'employee', '1111111111', '$2a$10$Dow1q7l7wrOX9w4.GfNayOefzYBcOaXn/L8OS.MuTewMOJxoJ7d1e', 'employee@example.com', 'Employee', 'User', (SELECT id FROM user_role WHERE name = 'ROLE_EMPLOYEE'), NULL);

-- Customer
INSERT INTO users (id, username, phone_number, password, email, name, surname, role_id, tariff_id)
VALUES (nextval('users_id_seq'), 'customer', '1234567890', '$2a$10$Dow1q7l7wrOX9w4.GfNayOefzYBcOaXn/L8OS.MuTewMOJxoJ7d1e', 'customer@example.com', 'Customer', 'User', (SELECT id FROM user_role WHERE name = 'ROLE_CUSTOMER'), (SELECT id FROM tariff WHERE name = 'Basic Plan'));