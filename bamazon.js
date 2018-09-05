var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var productID=-1;
var AllID =[];
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "fishsticks",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});
function start()
{
  connection.query("SELECT * FROM products", function(err, results)
  {
    if (err) throw err;
    var data = results;
    var t = new Table;
    //////////////
    data.forEach(function(product) {
      if(AllID.indexOf(product.id)==-1)AllID.push(product.id);
      t.cell('Id', product.id)
      t.cell('Product', product.product_name)
      t.cell('Department', product.department_name)
      t.cell('Price, USD', product.price, Table.number(2))
      t.cell('In Stock', product.stock_quantity, Table.number(0))
      t.newRow()
    })
     
    console.log(t.toString());
    myVar = setTimeout(inquiring, 500);
//     end();
// return;
    //////////////
    // console.log(data)
    

  })
}

function end()
{
  console.log("Thanks for shopping at BAM!azon. We are in no way affiliated with those Bozos (or is it Bezos?).")
  connection.end();
}
// function which prompts the user for what action they should take
function inquiring() {
  inquirer
  .prompt([
    {
      name: "ID",
      type: "input",
      message: "Enter Product ID:"
      
    }      
  ]).then(function(answer) {
    productID=answer.ID;
    if(AllID[productID-1]==null)
    {
      console.log("Invalid choice.")
      myVar = setTimeout(start, 500);
      return;
    }// console.log(AllID)
    showProduct(productID);
  });
  
}
function showProduct(id)
{
  
 // end()
  connection.query("SELECT * FROM products WHERE id = ?",id, function(err, results)
  {
    if (err) throw err;
    var data = results;
    var t = new Table;
    //////////////
    data.forEach(function(product) {
      if(product.stock_quantity<1){
          console.log("Out of stock");
          myVar = setTimeout(start, 500);
          return;
        }
      t.cell('Id', product.id)
      t.cell('Product', product.product_name)
      t.cell('Department', product.department_name)
      t.cell('Price, USD', product.price, Table.number(2))
      t.cell('In Stock', product.stock_quantity, Table.number(0))
      t.newRow()
    })
     
    console.log(t.toString());
  });
  myVar = setTimeout(quantity, 500);
  //quantity(productID);
}
function quantity()
{
  inquirer
  .prompt([
    {
      name: "quantity",
      type: "input",
      message: "How many:"
      }
  ]).then(function(answer) {
    checkQuantity(answer.quantity);//console.log()
    //end();
  });
}
function checkQuantity(q)
{
  connection.query("SELECT * FROM products WHERE id = ?",productID, function(err, results)
  {
    if (err) throw err;
    if(q>results[0].stock_quantity ||results[0].stock_quantity<1)
    {
      console.log("Not Enough in Stock");
      if(results[0].stock_quantity<1)myVar = setTimeout(start, 500);
      else myVar = setTimeout(quantity, 500);
      return;
    }
    else
    {
      var newQuantity=results[0].stock_quantity-parseInt(q);
      var totalSales=results[0].product_sales+(q*results[0].price);
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newQuantity,
            product_sales: financial(totalSales)
          },
          {
            id: productID
          }
        ],
        function(error) {
          if (error) throw err;
          var tc=q*results[0].price;

          console.log("Successful purchase. Total cost: $"+financial(tc));
          // connection.query("INSERT INTO departments (department_name, product_sales)    SELECT department_name, product_sales FROM products"),function(err, results)
          // {
          //   if (err) throw err;
          // }

          inquirer
          .prompt([
            {
                type: 'confirm',
                name: 'keepShopping',
                message: 'Keep Shopping?'
            }
          ]).then(function(answer) {
            if(answer.keepShopping)
              myVar = setTimeout(start, 500);
            else end();
          });

        }
      );
    } 
  })

}
// function UpdateDepartmentsDB()
// {
//   connection.query(`INSERT INTO departments (department_name, product_sales) VALUES ('${answer.itemN}', '${answer.deptN}', '${answer.price}', '${answer.quantity}')`,productID, function(err, results)
// }
function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}