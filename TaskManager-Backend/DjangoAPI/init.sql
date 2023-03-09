CREATE USER postgres;
CREATE DATABASE postgres;
ALTER USER postgres PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;