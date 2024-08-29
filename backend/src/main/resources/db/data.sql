INSERT INTO tariff (name, price, description, is_active, data_limit, call_minutes, sms_limit, valid_from, valid_to)
VALUES ('Basic Plan', 19.99, 'Basic plan with limited features', true, 5000, 100, 50, '2024-01-01', '2024-12-31'),
       ('Premium Plan', 49.99, 'Premium plan with extended features', true, 20000, 500, 200, '2024-01-01',
        '2024-12-31'),
       ('Unlimited Plan', 79.99, 'Unlimited data, calls, and SMS', true, NULL, NULL, NULL, '2024-01-01', '2025-12-31'),
       ('Family Plan', 59.99, 'Plan for families with 4 members', true, 50000, 2000, 1000, '2024-01-01', '2024-12-31');

-- Insert roles employee_password and customer_password
INSERT INTO users (phone_number, password, email, name, surname, role, tariff_id)
VALUES ('1111111111', '$2a$10$85VWTBqLP8nAZNU4an6i2uI2whSkKsnOjBC5MgiGvdu44FRXh/TYu', 'employee@example.com',
        'Employee', 'User', 'ROLE_EMPLOYEE', NULL),
       ('1234567890', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer@example.com',
        'Customer', 'User', 'ROLE_CUSTOMER', 1);
