import express from "express";
import { readDB, writeDB } from "../../utils/helper.js";
import {v4 as uuid} from "uuid";

const router = express.Router();

// USER APIS

// GET all users
router.get("/getallusers", async (req, res)=>{
    try {
        let allUsers = await readDB();
        console.log(allUsers);
        res.status(200).json(allUsers); 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

// get user by id
router.get("/getuser", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        if(!user)
        {
            return res.status(400).json({msg:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

// update user
router.put("/updateuser", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        if(!user)
        {
            return res.status(400).json({msg:"User not found"});
        }
        Object.assign(user, req.body);
        await writeDB(DB);
        res.status(200).json({msg: "User data updated successfully"});
    } catch (error) {
         console.log(error);
        res.status(500).json({msg:error});
    }
});

//delete user
router.delete("/deleteuser", async (req, res)=>{
    try {
        let DB = await readDB();
        DB = DB.filter((x)=> x.id !== req.user.id);
        await writeDB(DB);
        res.status(200).json({msg: "Shabash beta hamare hi app se jana tha!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

// delete all users
router.delete("/deleteallusers", async (req, res)=>{
    try {
        let DB = await readDB();
        DB.splice(0, DB.length);
        await writeDB(DB);
        res.status(200).json({msg: "Shabash beta hamare hi app se jana tha!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});




//create task
router.post("/createtask", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        if(!user)
        {
            return res.status(400).json({msg:"User not found! Cannot add task."})
        }
        let newTask = {
            id: uuid(),
            task: req.body.task,
            description: req.body.description,
            deadline: req.body.deadline,
            createdAt: new Date().toISOString(),
        }
        user.task.push(newTask);
        await writeDB(DB);
        res.status(201).json({
            msg: "Task added successfully",
            task: newTask
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

//update task
router.put("/updatetask/:id", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        let task = user.task.find((x)=> x.id === req.params.id);
        Object.assign(task, req.body);
        task.updatedAt = new Date().toISOString();
        await writeDB(DB);
        res.status(202).json({msg:"Task updated successfully", updatedTask: task});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

//delete task
router.delete("/deletetask/:id", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        user.task = user.task.filter((x)=> x.id !== req.params.id);
        await writeDB(DB);
        res.status(200).json({msg: "Task deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

//delete all tasks
router.delete("/deletealltasks", async (req, res)=>{
    try {
        let DB = await readDB();
        let user = DB.find((x)=> x.id === req.user.id);
        user.task.splice(0, user.task.length);
        await writeDB(DB);
        res.status(200).json({msg: "All the tasks were deleted!!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});



export default router;