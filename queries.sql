CREATE DATABASE security_information;

DROP TABLE tb_user_verify;
DROP TABLE tb_user;

CREATE TABLE tb_user(
    cd_username VARCHAR(100) PRIMARY KEY,
    ds_password VARCHAR(512),
    cd_email VARCHAR(100),
    nm_user VARCHAR(100),
    is_verified BOOLEAN,
    dh_token_password TIMESTAMP
);

CREATE TABLE tb_user_verify(
    cd_username VARCHAR(100) PRIMARY KEY,
    ds_token VARCHAR(6),
    dh_token TIMESTAMP,
    CONSTRAINT tb_user_verify_tb_user_fkey FOREIGN KEY 
        (cd_username) REFERENCES tb_user(cd_username)
);