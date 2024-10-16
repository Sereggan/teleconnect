INSERT INTO tariff (name, price, description, is_active, data_limit, call_minutes, sms_limit)
VALUES ('Basic Plan', 19.99, 'Basic plan with limited features', true, 5, 100, 50),
       ('Premium Plan', 49.99, 'Premium plan with extended features', true, 20, 500, 200),
       ('Unlimited Plan', 79.99, 'Unlimited data, calls, and SMS', true, NULL, NULL, NULL),
       ('Family Plan', 59.99, 'Plan for families with 4 members', true, 50, 2000, 1000),
       ('Student Plan', 14.99, 'Affordable plan for students with moderate usage', true, 3000, 200, 100),
       ('Traveler Plan', 29.99, 'Plan for travelers with extended international calls', true, 10000, 600, 300),
       ('Business Plan', 89.99, 'Comprehensive plan for business users', true, 50, 4000, 2000),
       ('Gaming Plan', 49.99, 'Plan for gamers with high data and speed', true, 30, 1000, 500),
       ('Unlimited Talk & Text', 39.99, 'Unlimited calling and texting with limited data', true, 10, NULL, NULL),
       ('Senior Plan', 24.99, 'Plan designed for senior citizens with low data usage', true, 2000, 300, 150),
       ('Night Owl Plan', 19.99, 'Discounted night-time data', true, 15, 500, 200),
       ('Freelancer Plan', 34.99, 'Ideal plan for freelancers with balanced data and calls', true, 20, 1000, 500),
       ('Weekend Plan', 9.99, 'Weekend special with unlimited data', true, NULL, 300, 100),
       ('Data Lover Plan', 69.99, 'Huge data plan for heavy users', false, 100, 3000, 1000);

-- employee_password and customer_password
INSERT INTO users (phone_number, password, email, name, family_name, role, birth_date, tariff_id)
VALUES
    ('11111111111', '$2a$10$85VWTBqLP8nAZNU4an6i2uI2whSkKsnOjBC5MgiGvdu44FRXh/TYu', 'employee@example.com', 'Employee', 'User', 'ROLE_EMPLOYEE', '2020-01-01', NULL),
    ('1234567890211', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer@example.com', 'Customer', 'User', 'ROLE_CUSTOMER', '1999-04-01', 1),
    ('1112223334', '$2a$10$85VWTBqLP8nAZNU4an6i2uI2whSkKsnOjBC5MgiGvdu44FRXh/TYu', 'sergei.ni@yandex.ru', 'Manager', 'One', 'ROLE_EMPLOYEE', '1985-07-22', NULL),
    ('2223334445', '$2a$10$85VWTBqLP8nAZNU4an6i2uI2whSkKsnOjBC5MgiGvdu44FRXh/TYu', 'manager2.new@example.com', 'John', 'Doe', 'ROLE_EMPLOYEE', '1980-03-12', NULL),
    ('3334445556', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer1.new@example.com', 'Alice', 'Smith', 'ROLE_CUSTOMER', '1995-09-11', 2),
    ('4445556667', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer2.new@example.com', 'Bob', 'Johnson', 'ROLE_CUSTOMER', '1998-11-24', 3),
    ('5556667778', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer3.new@example.com', 'Charlie', 'Brown', 'ROLE_CUSTOMER', '2000-05-05', 4),
    ('6667778889', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer4.new@example.com', 'David', 'Miller', 'ROLE_CUSTOMER', '1992-02-15', 5),
    ('7778889990', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer5.new@example.com', 'Eve', 'Davis', 'ROLE_CUSTOMER', '1990-10-25', 6),
    ('8889990001', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer6.new@example.com', 'Frank', 'Garcia', 'ROLE_CUSTOMER', '1997-01-18', 7),
    ('9990001112', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer7.new@example.com', 'Grace', 'Martinez', 'ROLE_CUSTOMER', '1996-07-04', 8),
    ('0001112223', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer8.new@example.com', 'Hank', 'Lee', 'ROLE_CUSTOMER', '1989-09-30', 9),
    ('11122233340', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer9.new@example.com', 'Ivy', 'Clark', 'ROLE_CUSTOMER', '1994-03-27', 10),
    ('22233344450', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer10.new@example.com', 'Jack', 'Walker', 'ROLE_CUSTOMER', '1993-12-01', 1),
    ('33344455560', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer11.new@example.com', 'Karen', 'Hall', 'ROLE_CUSTOMER', '1999-08-09', 2),
    ('44455566670', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer12.new@example.com', 'Liam', 'Young', 'ROLE_CUSTOMER', '1991-04-16', 3),
    ('55566677780', '$2a$10$mEOuDpNnEBuVay1eyORJiutNJEAvVGXq8n7dJDkrAAe2h6nsFGVui', 'customer13.new@example.com', 'Mia', 'Harris', 'ROLE_CUSTOMER', '1992-06-11', 4);

-- Insert tariff adjustments for customers
INSERT INTO tariff_adjustment (data_limit, call_minutes, sms_limit, price, tariff_id, user_id)
VALUES
    (6000, 120, 60, 10.00, 1, 3),
    (22000, 550, 220, 5.00, 2, 4),
    (NULL, 1000, 500, 15.00, 3, 5),
    (80000, 3500, 1800, 8.00, 4, 6);

