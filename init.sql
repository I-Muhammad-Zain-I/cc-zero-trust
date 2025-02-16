-- Create users
-- CREATE USER zt_user WITH PASSWORD 'zt_pass';
CREATE USER keycloak_user WITH PASSWORD 'keycloak_pass';


-- Create databases owned by their respective users
-- CREATE DATABASE zt_db OWNER zt_user;
CREATE DATABASE keycloak_db OWNER 'keycloak_user';


-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE zt_db TO zt_user;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak_user;


