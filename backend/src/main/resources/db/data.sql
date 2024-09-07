INSERT INTO tariff (name, price, description, is_active, data_limit, call_minutes, sms_limit)
VALUES ('Basic Plan', 19.99, 'Basic plan with limited features', true, 5000, 100, 50),
       ('Premium Plan', 49.99, 'Premium plan with extended features', true, 20000, 500, 200),
       ('Unlimited Plan', 79.99, 'Unlimited data, calls, and SMS', true, NULL, NULL, NULL),
       ('Family Plan', 59.99, 'Plan for families with 4 members', true, 50000, 2000, 1000);

-- employee_password and customer_password
INSERT INTO users (phone_number, password, email, name, surname, role, birth_date, tariff_id)
VALUES ('1111111111', '$2a$10$85VWTBqLP8nAZNU4an6i2uI2whSkKsnOjBC5MgiGvdu44FRXh/TYu', 'employee@example.com',
        'Employee', 'User', 'ROLE_EMPLOYEE', '2020-01-01', NULL),
       ('1234567890', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer@example.com',
        'Customer', 'User', 'ROLE_CUSTOMER', '1999-04-01', 1);
