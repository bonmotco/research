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

## Searching Tables with 'WHERE'

SQL Used
A WHERE Clause
SELECT <columns> FROM <table> WHERE <condition>;
Equality Operator
Find all rows that a given value matches a column's value.

SELECT <columns> FROM <table> WHERE <column name> = <value>;
Examples:

SELECT * FROM contacts WHERE first_name = "Andrew";
SELECT first_name, email FROM users WHERE last_name = "Chalkley";
SELECT name AS "Product Name" FROM products WHERE stock_count = 0;
SELECT title "Book Title" FROM books WHERE year_published = 1999;
Inequality Operator
Find all rows that a given value doesn't match a column's value.

SELECT <columns> FROM <table> WHERE <column name> != <value>;
SELECT <columns> FROM <table> WHERE <column name> <> <value>;
The not equal to or inequality operator can be written in two ways != and <>. The latter is less common.

Examples:

SELECT * FROM contacts WHERE first_name != "Kenneth";
SELECT first_name, email FROM users WHERE last_name != "L:one";
SELECT name AS "Product Name" FROM products WHERE stock_count != 0;
SELECT title "Book Title" FROM books WHERE year_published != 2015;



