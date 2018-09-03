DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price FLOAT(10,2) default 0,
  stock_quantity INT(10) default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stuff","Super Stuff", 2.50, 100), ("Stuff for days", "StuffNStuff",3.10, 120),("More Stuff","StuffNStuff", 12.50, 100), ("Still More Stuff", "Stuff It",2.15, 120), ("Enuff Stuff", "StuffNStuff",2.15, 120);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("NickNack","Super Stuff", .50, 10), ("PaddyWhack", "StuffNStuff",13.10, 12),("dog bone","StuffNStuff", 1.75, 1), ("Dinky the T-Rex souvenir", "Dinky the T-Rex souvenir shoppe",50.00, 12000);


SELECT * FROM bamazon_DB.products