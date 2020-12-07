# SQL Intro:

## Simple Statements

SQL Used
Retrieving a single column:

SELECT <column name> FROM <table name>; 
Examples:

SELECT email FROM users;
SELECT first_name FROM users;
SELECT name FROM products;
SELECT zip_code FROM addresses;
Retrieving multiple columns:

SELECT <column name 1>, <column name 2>, ... FROM <table name>;
Examples:

SELECT first_name, last_name FROM customers;
SELECT name, description, price FROM products;
SELECT title, author, isbn, year_released FROM books;
SELECT name, species, legs FROM pets;

SQL Used
SELECT <column name> AS <alias> FROM <table name>;
SELECT <column name> <alias> FROM <table name>;

## Categorizing Your Output with 'AS'

Examples:

SELECT username AS Username, first_name AS "First Name" FROM users;
SELECT title AS Title, year AS "Year Released" FROM movies;
SELECT name AS Name, description AS Description, price AS "Current Price" FROM products;
SELECT name Name, description Description, price "Current Price" FROM products;

### Link: https://github.com/treehouse/cheatsheets/blob/master/sql_basics/cheatsheet.md