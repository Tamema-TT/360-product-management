"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("../knexfile"));
const db = (0, knex_1.default)(knexfile_1.default.development);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// app.get('/users', async (req: Request, res: Response) => {
//   try {
//     const users = await db.select('*').from('users');
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
exports.default = app;
// import express, { Application, Request, Response } from "express";
// import bodyParser from "body-parser";
// import knex from "knex";
// import knexfile from "../knexfile";
// const app: Application = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const db = knex(knexfile.development);
// app.get("/", async (req: Request, res: Response) => {
//   try {
//     const result = await db.select("*").from("mytable");
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
//# sourceMappingURL=app.js.map