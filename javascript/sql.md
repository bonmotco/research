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

# Filtering by Comparing Values

Relational Operators
There are several relational operators you can use:

< less than
<= less than or equal to
> greater than
>= greater than or equal to
These are primarily used to compare numeric and date/time types.

SQL Used
SELECT <columns> FROM <table> WHERE <column name> < <value>;
SELECT <columns> FROM <table> WHERE <column name> <= <value>;
SELECT <columns> FROM <table> WHERE <column name> > <value>;
SELECT <columns> FROM <table> WHERE <column name> >= <value>;
Examples:

SELECT first_name, last_name FROM users WHERE date_of_birth < '1998-12-01';
SELECT title AS "Book Title", author AS Author FROM books WHERE year_released <= 2015;
SELECT name, description FROM products WHERE price > 9.99;
SELECT title FROM movies WHERE release_year >= 2000;

# Filtering on More than One Condition

You can compare multiple values in a WHERE condition. If you want to test that both conditions are true use the AND keyword, or either conditions are true use the OR keyword.

SELECT <columns> FROM <table> WHERE <condition 1> AND <condition 2> ...;
SELECT <columns> FROM <table> WHERE <condition 1> OR <condition 2> ...;
Examples:

SELECT username FROM users WHERE last_name = "Chalkley" AND first_name = "Andrew";

SELECT * FROM products WHERE category = "Games Consoles" AND price < 400;

SELECT * FROM movies WHERE title = "The Matrix" OR title = "The Matrix Reloaded" OR title = "The Matrix Revolutions";

SELECT country FROM countries WHERE population < 1000000 OR population > 100000000;

# Searching Within a Set of Values

SELECT <columns> FROM <table> WHERE <column> IN (<value 1>, <value 2>, ...);
Examples:

SELECT name FROM islands WHERE id IN (4, 8, 15, 16, 23, 42);
SELECT * FROM products WHERE category IN ("eBooks", "Books", "Comics");
SELECT title FROM courses WHERE topic IN ("JavaScript", "Databases", "CSS");
SELECT * FROM campaigns WHERE medium IN ("email", "blog", "ppc");
To find all rows that are not in the set of values you can use NOT IN.

SELECT <columns> FROM <table> WHERE <column>  NOT IN (<value 1>, <value 2>, ...);
Examples:

SELECT answer FROM answers WHERE id IN (7, 42);
SELECT * FROM products WHERE category NOT IN ("Electronics");
SELECT title FROM courses WHERE topic NOT IN ("SQL", "NoSQL");

# Searching Within a Range of Values

SELECT <columns> FROM <table> WHERE <column> BETWEEN <lesser value> AND <greater value>;
Examples:

SELECT * FROM movies WHERE release_year BETWEEN 2000 AND 2010;
SELECT name, description FROM products WHERE price BETWEEN 9.99 AND 19.99;
SELECT name, appointment_date FROM appointments WHERE appointment_date BETWEEN "2015-01-01" AND "2015-01-07";

These are included []

# Finding Data that Matches a Pattern

SELECT <columns> FROM <table> WHERE <column> LIKE <pattern>;
Examples:

SELECT title FROM books WHERE title LIKE "Harry Potter%Fire";
SELECT title FROM movies WHERE title LIKE "Alien%";
SELECT * FROM contacts WHERE first_name LIKE "%drew";
SELECT * FROM books WHERE title LIKE "%Brief History%";
PostgreSQL Specific Keywords
LIKE in PostgreSQL is case-sensitive. To case-insensitive searches do ILIKE.

SELECT * FROM contacts WHERE first_name ILIKE "%drew";

# Filtering Out or Finding Missing Information


Sometimes you don't have all the information filled out in a row. Whether that's by the design of your database or because someone failed to enter anything, it can be handy to retrieve rows with or without information missing. Find this with 'IS NULL'.
Filter them out with 'IS NOT NULL'.

