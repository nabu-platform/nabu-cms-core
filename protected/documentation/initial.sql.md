-- log in with superuser
CREATE USER username WITH PASSWORD 'password';
GRANT CREATE ON DATABASE postgres TO username;

-- log in as newly created user
CREATE SCHEMA username authorization username;
-- this is for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA username GRANT ALL ON TABLES TO username;

-- this is for existing tables (as admin)
GRANT USAGE ON SCHEMA salas_dev TO salas_dev
grant ALL on all tables in schema platform_dev to platform_dev;
grant all on schema username to username;






--oracle (creating user creates a schema)
create user username identified by password;
grant create session, create table, create view, create any trigger, create any procedure, create sequence, create synonym to username;
alter user username quota unlimited on users;
