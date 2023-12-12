import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import { SERVER_PORT, IP } from "./configs/config.js";
import mongoose from "./dbs/mongodb.js";
import parse from "nodemon/lib/cli/parse.js";

// 创建模型
const InfoSchema=new mongoose.Schema({
    id:{
        type:Number
    },
    secret:{
        type:String,
    },
    url:{
        type:String,
    },  
    isclick:{
        type:Boolean,
    },
    iserror:{
        type:Boolean,
    },
    isfinsh:{
        type:Boolean,
    },
})
const InfoModel = mongoose.model("InfoModel", InfoSchema, "info");
const app = express();
// 全局中间件挂载
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get("/getdata", async (req, res) => {
    let page = Number(req.query.page);
    let perPage = Number(req.query.perPage)
    page = page?page:1;
    const pageNumber = page > 0 ? page : 1;
    const startIndex = (pageNumber - 1) * perPage;
    let total = (await InfoModel.find()).length;
    let datalist = await InfoModel.find().skip(startIndex).limit(perPage);
    res.send({
        status: 200,
        data: {
            total: total,
            page:page,
            perPage:perPage,
            datalist: datalist
        },
        msg: "获取数据成功"
    })
})
app.get("/click", async (req, res) => {
    let id = req.query.id;
    let info = await InfoModel.updateOne({ id: id-0 },{isclick:true})
    res.send({
        status: 200,
        data:[],
        msg:"点击成功"
    })


})
app.get("/error", async (req, res) => {
    let id = req.query.id;
    await InfoModel.updateOne({ id: id-0 },{iserror:true})
    res.send({
        status: 200,
        data:[],
        msg:"错误"
    })
})
app.get("/finsh", async (req, res) => {
    let id = req.query.id;
    await InfoModel.updateOne({ id: id-0 },{isfinsh:true})
    res.send({
        status: 200,
        data:[],
        msg:"完成"
    })
})
app.get("/geterror",async(req,res)=>{
    let page = Number(req.query.page);
    let perPage = Number(req.query.perPage)
    page = page?page:1;
    const pageNumber = page > 0 ? page : 1;
    const startIndex = (pageNumber - 1) * perPage;
    let total = (await InfoModel.find({iserror:true})).length;
    let datalist = await InfoModel.find({iserror:true}).skip(startIndex).limit(perPage);
    res.send({
        status: 200,
        data: {
            total: total,
            page:page,
            perPage:perPage,
            datalist: datalist
        },
        msg: "获取数据成功"
    })
})
app.get("/cancelerror",async(req,res)=>{
    let id = req.query.id;
    await InfoModel.updateOne({ id: id-0 },{iserror:false})
    res.send({
        status: 200,
        data:[],
        msg:"取消错误"
    })
})



app.listen(SERVER_PORT, IP, () => {
    console.log(`server is running at http://${IP}:${SERVER_PORT}`)
})