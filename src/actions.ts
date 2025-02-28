import inquirer from "inquirer";
import { pool } from './connection.js';
import Table from 'cli-table3';

class DataQueries {
    exit: boolean = false;

    async viewCompanyInfo() {
        // Implement logic to view company information
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'ViewInfo',
              message:
                'What would you like to view?',
              choices: ['Departments', 'Roles', 'Employees', 'Exit'],
            },
          ])
          .then((answers) => {
            // check if the user wants to create a new vehicle or select an existing vehicle
            if (answers.ViewInfo === 'Departments') {
              this.viewDepartmentInfo();
            } else if (answers.ViewInfo === 'Roles') {
              this.viewRoleInfo();
            } else if (answers.ViewInfo === 'Employees') {
              this.viewEmployeeInfo();
            } else if (answers.ViewInfo === 'Exit') {
              // Leave management mode and return to main menu
              this.startActions();
            }
          });
    }

    async viewDepartmentInfo() {
      try {
        const result = await pool.query('SELECT * FROM department;');
        console.table(result.rows);
        this.startActions();
        return result.rows;
      } catch (err) {
        console.error('Error executing query', err);
        throw err;
      }
    }

    async viewRoleInfo() {
      try {
        const result = await pool.query('SELECT * FROM role JOIN department ON role.department_id = department.id;');
        console.table(result.rows);
        this.startActions();
        return result.rows;
      } catch (err) {
        console.error('Error executing query', err);
        throw err;
      }
    }

    async viewEmployeeInfo() {
      try {
        const result = await pool.query(`SELECT 
            e.id AS "Employee ID",
            e.first_name AS "First Name",
            e.last_name AS "Last Name",
            r.title AS "Job Title",
            d.name AS "Department",
            r.salary AS "Salary",
            m.first_name || ' ' || m.last_name AS "Manager"
          FROM 
            employee e
          JOIN 
            role r ON e.role_id = r.id
          JOIN 
            department d ON r.department_id = d.id
          LEFT JOIN 
            employee m ON e.manager_id = m.id
        ;`);
        const table = new Table({
          head: ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
          colWidths: [5, 15, 15, 20, 10, 10, 20]
        });

        // Add rows to the table
        result.rows.forEach(row => {
          table.push([
            row['Employee ID'],
            row['First Name'],
            row['Last Name'],
            row['Job Title'],
            row['Department'],
            row['Salary'],
            row['Manager']
          ]);
        });

        // Display the table
        console.log(table.toString());

        this.startActions();
        return result.rows;
      } catch (err) {
        console.error('Error executing query', err);
        throw err;
      }
    }

    manCompanyInfo(): void {
        // Implement logic to view company information
        console.log("Managing company information...");
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'ManagementActions',
              message:
                'What would you like to do?',
              choices: ['Add department', 'Add role', 'Add employee', 'Update employee role', 'Exit'],
            },
          ])
          .then((answers) => {
            // check if the user wants to create a new vehicle or select an existing vehicle
            if (answers.ManagementActions === 'Add department') {
              this.addDepartment();
            } else if (answers.ManagementActions === 'Add role') {
              this.addRole();
            } else if (answers.ManagementActions === 'Add employee') {
              this.addEmployee();
            } else if (answers.ManagementActions === 'Update employee role') {
              this.updateEmployeeRole();
            } else if (answers.ManagementActions === 'Exit') {
              // Leave management mode and return to main menu
              this.startActions();
            }
          });
    }

    async addDepartment() {
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter department name:',
        }
      ])
      .then((answers) => {
          const result = pool.query(`INSERT INTO department (name) VALUES ($1) RETURNING * `, [answers.title]);
          //console.log(result);
          this.startActions();
          return result;
      });
    }

    async addRole() {
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter role title:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter role salary:',
        },
        {
          type: 'input',
          name: 'department',
          message: 'Enter department:',
        },
      ])
      .then(async (answers) => {
        try {
            // Find the department ID based on the department name
            const depResult = await pool.query('SELECT id FROM department WHERE name = $1', [answers.department]);
            if (depResult.rows.length === 0) {
                console.error('Department not found');
                this.startActions();
                return;
            }
            const departmentId = depResult.rows[0].id;

            // Insert the new role using the retrieved department ID
            const result = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [answers.title, answers.salary, departmentId]);
            console.table(result.rows);
            this.startActions();
            return result.rows;
        } catch (err) {
            console.error('Error executing query', err);
            throw err;
        }
    });

    }

    async addEmployee() {
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter first name:',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter last name:',
        },
        {
          type: 'input',
          name: 'role',
          message: 'Enter role title:',
        },
        {
          type: 'input',
          name: 'manager_name',
          message: 'Enter manager first name:',
        },
      ])
      .then(async (answers) => {
        try {
            // Find the department ID based on the department name
            const roleResult = await pool.query('SELECT id FROM role WHERE title = $1', [answers.role]);
            if (roleResult.rows.length === 0) {
                console.error('Department not found');
                this.startActions();
                return;
            }
            const roleId = roleResult.rows[0].id;

            const managerResult = await pool.query('SELECT id FROM employee WHERE first_name = $1', [answers.manager_name]);
            if (managerResult.rows.length === 0) {
                console.error('Department not found');
                this.startActions();
                return;
            }
            const managerId = managerResult.rows[0].id;

            // Insert the new role using the retrieved department ID
            const result = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [answers.first_name, answers.last_name, roleId, managerId]);
            console.table(result.rows);
            this.startActions();
            return result.rows;
        } catch (err) {
            console.error('Error executing query', err);
            throw err;
        }
    });
    }

    async updateEmployeeRole() {
      const employeeResult = await pool.query('SELECT first_name, last_name FROM employee');
        const employeeNames = employeeResult.rows.map(row => `${row.first_name} ${row.last_name}`);

      inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_name',
          message: 'Select an employee to modify:',
          choices: employeeNames,
        },
        {
          type: 'input',
          name: 'new_role',
          message: 'Enter new role title:',
        },
      ])
      .then(async (answers) => {
        try{
          const roleResult = await pool.query('SELECT id FROM role WHERE title = $1', [answers.new_role]);
          if (roleResult.rows.length === 0) {
              console.error('Role not found');
              this.startActions();
              return;
          }
          const roleId = roleResult.rows[0].id;
          const [firstName, lastName] = answers.employee_name.split(' ');
          const result = await pool.query('UPDATE employee SET role_id = $1 WHERE first_name = $2 AND last_name = $3 RETURNING *', [roleId, firstName, lastName]);
              console.table(result.rows);
              this.startActions();
              return result.rows;
          } catch (err) {
              console.error('Error executing query', err);
              throw err;
          }
        });
    }

    startActions(): void {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'ViewOrMan',
              message:
                'Would you like to view or manage your company information?',
              choices: ['View company information', 'Manage company information', 'Exit'],
            },
          ])
          .then((answers) => {
            // check if the user wants to create a new vehicle or select an existing vehicle
            if (answers.ViewOrMan === 'View company information') {
              this.viewCompanyInfo();
            } else if (answers.ViewOrMan === 'Manage company information') {
              this.manCompanyInfo();
            } else {
              // Exit the application
              this.exit = true;
              process.exit(0);
            }
          });
      }
}

export default DataQueries;