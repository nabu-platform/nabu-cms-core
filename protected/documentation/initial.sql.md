-- log in with superuser
CREATE USER username WITH PASSWORD 'password';
GRANT CREATE ON DATABASE postgres TO username;

-- log in as newly created user
CREATE SCHEMA username authorization username;
ALTER DEFAULT PRIVILEGES IN SCHEMA username GRANT ALL ON TABLES TO username;

