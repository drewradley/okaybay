var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var productID=-1;
var AllID =[];
var goToAddInventory=false;
// console.log('\x1b[31m', ''); 

// FgRed = "\x1b[31m" 

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

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});
function start()
{
  inquirer
  .prompt([
    {
	name: "quantity",
	type: "rawlist",
  message: "Menu:",
  choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product", "Finished" ]
    }
  ]).then(function(answer) {
    switch(answer.quantity) {
      case "View Products for Sale":
        goToAddInventory=false;
        listProducts();
          break;
      case "View Low Inventory":
        goToAddInventory=false;
        listLowInventory();
          break;
      case "Add to Inventory":
        goToAddInventory=true;
        listProducts();
        break;
      case "Add New Product":
        goToAddInventory=false;
        addNewItem();
            break;
      case "Finished":
        end();
          break;
          default:
        goToAddInventory=false;
         start();// code block
  } 
    // case(answer.quantity)
  });
}
function listProducts()
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
      t.newRow();

    })
     
    console.log(t.toString());
    if(goToAddInventory)
      {
        myVar = setTimeout(inquiring, 500);
        return;
      }
    // console.log('\x1b[0m', ''); 
    inquirer
    .prompt([
      {
    name: "anykey",
    type: "input",
    message: "Press any key to continue"
      }
    ]).then(function(answer) {
      
      myVar = setTimeout(start, 500);
    });
    
//     end();
// return;
    //////////////
    // console.log(data)
    

  })
}
function listLowInventory()
{
  connection.query("SELECT * FROM products", function(err, results)
  {
    if (err) throw err;
    var data = results;
    var t = new Table;
    //////////////
    data.forEach(function(product) {
      if(product.stock_quantity<10)
      {if(AllID.indexOf(product.id)==-1)AllID.push(product.id);
      t.cell('Id', product.id)
      t.cell('Product', product.product_name)
      t.cell('Department', product.department_name)
      t.cell('Price, USD', product.price, Table.number(2))
      t.cell('In Stock', product.stock_quantity, Table.number(0))
      t.newRow();}

    })
     
    console.log(t.toString());
    // console.log('\x1b[0m', ''); 
    inquirer
    .prompt([
      {
    name: "anykey",
    type: "input",
    message: "Press any key to continue"
      }
    ]).then(function(answer) {
      myVar = setTimeout(start, 500);
    });
  })
}
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
  connection.query("SELECT * FROM products WHERE id = ?",id, function(err, results)
  {
    if (err) throw err;
    var data = results;
    var t = new Table;
    //////////////
    data.forEach(function(product) {
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
    updateQuantity(answer.quantity);
  });
}
function updateQuantity(q)
{
  connection.query("SELECT * FROM products WHERE id = ?",productID, function(err, results)
  {
    if (err) throw err;
    
    var newQuantity=results[0].stock_quantity+parseInt(q);
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuantity
        },
        {
          id: productID
        }
      ],
      function(error) {
        if (error) throw err;
        if(q<1)
        {
          console.log("Invalid")
          myVar = setTimeout(start, 500);
          return;
        }
        if(q==1)
          console.log(`You have added ${q} ${results[0].product_name} to inventory`);
        else 
          console.log(`You have added ${q} ${results[0].product_name}s to inventory`);
        inquirer
        .prompt([
          {
              type: 'confirm',
              name: 'keepWorking',
              message: 'Keep Working?'
          }
        ]).then(function(answer) {
          if(answer.keepWorking)
            myVar = setTimeout(start, 500);
          else end();
        });
      }
    );
  })
  
}
function addNewItem()
{
  inquirer
  .prompt([
    {
    name: "itemN",
    type: "input",
    message: "Name of item:"
    },
    {
    name: "deptN",
    type: "input",
    message: "Name of Department:"
    },
    {
    name: "price",
    type: "input",
    message: "Price (USD):"
    }
    ,
    {
    name: "quantity",
    type: "input",
    message: "Quantity:"
    }
  ]).then(function(answer) {
    if(isNaN(answer.price)||isNaN(answer.quantity))
    {
      console.log("Invalid")
          myVar = setTimeout(start, 500);
          return;
    }
    connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${answer.itemN}', '${answer.deptN}', '${answer.price}', '${answer.quantity}')`,productID, function(err, results)
    {
      console.log(`${answer.quantity} ${answer.itemN} has been added`)
      inquirer
        .prompt([
          {
              type: 'confirm',
              name: 'keepWorking',
              message: 'Keep Working?'
          }
        ]).then(function(answer) {
          if(answer.keepWorking)
            myVar = setTimeout(start, 500);
          else end();
        });
    })
    //myVar = setTimeout(start, 500);
  });
}
function end()
{
  console.log("\x1b[34mBe Excellent: \x1b[0myou work for \x1b[42mBAM!azon\x1b[0m.\n\x1b[31mWe are in no way affiliated with those Bozos (or is it Bezos?).")
  connection.end();
}
function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}