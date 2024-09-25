const express = require('express');
const cors = require('cors')
const {intiliazeDatabase} = require('./database.js');

const app = express()
app.use(cors())

app.use(express.json());
let db = null;

const intiliazeServer = async () => {
    try{
        db = await intiliazeDatabase();
        app.listen(3001, () => console.log("Server Started At Port 3001"));
    }
    catch(err){
        console.log(`Error Occured: ${err}`);
        process.exit(1);
    }

    //To Know Wheather the server is running or not
    app.get("/", (req, res) => {
        res.send("Server Started On port 3001.....")
    })

    //GET ALL Tasks
    app.get('/tasks/', async (req, res) => {
        const query = `
        SELECT 
            *
        FROM
        tasks
        `;
        const taskData = await db.all(query)
        res.send(taskData)
    });

    //Add new Task to the DataBase
    app.post("/tasks/", async (req, res) => {
        const {description} = req.body;
        const query = `
            INSERT INTO tasks(description)
            VALUES('${description}')
        `
        await db.run(query, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID, description, completed: false });
            }
        });
    })

    //Delete a Task from Database
    app.delete('/tasks/:id', async (req, res) => {
        const {id} = req.params;
        const query = `
            DELETE FROM tasks WHERE id = ${id}
        `
        await db.run(query, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(204).send();
            }
        });
    });

    //Update the Task Status
    app.put('/tasks/:id', async (req, res) => {
        const {id} = req.params;
        const {completed} = req.body;
        const query = `
            UPDATE tasks SET completed = ${completed} WHERE id = ${id};
        `;
        await db.run(query, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ id: parseInt(id), completed });
            }
        });
    });
    
    //Update Task Description
    app.put("/tasks/update/:id", async (req, res) => {
        const {id} = req.params;
        const {description} = req.body;
        const query =  `
            UPDATE tasks SET description = "${description}" WHERE id = ${id}
        `;
        await db.run(query, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ id: parseInt(id), description });
            }
        })
    })

};

intiliazeServer();







