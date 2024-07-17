INSERT INTO tariff (name, price, description, is_active, data_limit, call_minutes, sms_limit)
VALUES ('Basic Plan', 19.99, 'Basic plan with limited features', true, 5000, 100, 50),
       ('Premium Plan', 49.99, 'Premium plan with extended features', true, 20000, 500, 200),
       ('Unlimited Plan', 79.99, 'Unlimited data, calls, and SMS', true, null, null, null),
       ('Family Plan', 59.99, 'Plan for families with 4 members', true, 50000, 2000, 1000);
