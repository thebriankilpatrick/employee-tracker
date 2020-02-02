const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table"); // Do I need this?

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1722",
    database: "employee_cms"
});
  
connection.connect(err => {
    if (err) throw err;
    // initialPrompt()
});

function initialPrompt() {
    inquirer.prompt([
        {
           type: "list",
           name: "initQuestion",
           message: "What would you like to do?",
           choices: ["Add Employee", "Add Role", "Add Department",
                "View Departments", "View Roles", "View Employees", "Update Employee Role"]
        }
    ]).then(answer => {
        console.log(answer.initQuestion);
    })
}