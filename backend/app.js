const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// const port = 3000;

app.get('/getTasks', (req, res) => {
    db.getDB().collection('tasks').find().toArray((err, docs) => {
        if(err){
            console.log(err);
        }
        else{
            res.json(docs);
        }
    });
});

app.get('/getLabels', (req, res) => {
    db.getDB().collection('labels').find().toArray((err, docs) => {
        if(err){
            console.log(err);
        }
        else{
            res.json(docs);
        }
    });
});

app.get('/getStatus', (req, res) => {
    db.getDB().collection('status').find().toArray((err, docs) => {
        if(err){
            console.log(err);
        }
        else{
            res.json(docs);
        }
    });
});

app.put('/tasks/:id', (req, res) => {
    const taskID = db.getPrimaryKey(req.params.id);
    const updatedTask = req.body.updatedTask;

    db.getDB().collection('tasks').findOneAndUpdate(
        { _id: taskID },
        {$set: {
            'task' : updatedTask.task,
            'dueDate': updatedTask.dueDate,
            'label' : updatedTask.label ? updatedTask.label : 'Other',
            'status' : updatedTask.status ? updatedTask.status : null
        }}, 
        (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    );
});

app.put('/label/:id', (req, res) => {
    const labelID = db.getPrimaryKey(req.params.id);
    const updatedLabel = req.body.updatedLabel;
    var prevLabel = ''

    db.getDB().collection('labels').find(
        { _id: labelID }).
        toArray((err, doc) => {
            if(err){
                console.log(1)
            }
            else{
                prevLabel = doc[0].label;
                db.getDB().collection('tasks').updateMany(
                    { label: prevLabel }, 
                    { $set: {
                        label: updatedLabel
                    }},
                    (err, result) => {
                        if(err){
                            console.log("1task")
                        }
                        else{
                            console.log("Success");
                        }
                    }
                );
            }
        });

    db.getDB().collection('labels').findOneAndUpdate(
        { _id: labelID },
        { $set : {
            label : updatedLabel
        }},
        (err, result) => {
            if(err){
                console.log(3);
            }
            else{
                console.log("THis too");
                res.json(result);
            }
        }
    );

    
});

app.put('/status/:id', (req, res) => {
    const statusID = db.getPrimaryKey(req.params.id);
    const updatedStatus = req.body.updatedStatus;

    db.getDB().collection('status').findOneAndUpdate(
        { _id: statusID },
        { $set : {
            status : updatedStatus
        }},
        (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    );
});

app.post('/tasks', (req, res) => {
    const newTask = req.body.newTask;
    
    db.getDB().collection('tasks').insertOne( newTask , (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.json({result: result, doc: result.ops[0]});
        }
    });
});

app.post('/label', (req, res) => {
    const newLabel = req.body.newLabel;

    db.getDB().collection('labels').insertOne( newLabel, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.json(
                {
                    result: result,
                    doc : result.ops[0]
                }
            );
        }
    });
});

app.post('/status', (req, res) => {
    const newStatus = req.body.newStatus;

    db.getDB().collection('status').insertOne( newStatus, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.json(
                {
                    result: result,
                    doc : result.ops[0]
                }
            );
        }
    });
});

app.delete('/tasks/:id', (req, res) => {
    const _ = req.params.id;
    const taskID = db.getPrimaryKey(_);

    db.getDB().collection('tasks').findOneAndDelete(
        {_id: taskID},
        (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.json(result);
            }
        }
    );
});

app.delete('/label/:id', (req, res) => {
    const _ = req.params.id;
    const labelID = db.getPrimaryKey(_);
    db.getDB().collection('labels').findOneAndDelete(
        {_id: labelID},
        (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    );
});

app.delete('/status/:id', (req, res) => {
    const _ = req.params.id;
    const statusID = db.getPrimaryKey(_);
    db.getDB().collection('status').findOneAndDelete(
        {_id: statusID},
        (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    );
});



db.connect((err) => {
    if(err){
        console.log("Unable to connect to database!");
        process.exit(1);
    }else{
        app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
            console.log('Connected!')
        });
    }
});
