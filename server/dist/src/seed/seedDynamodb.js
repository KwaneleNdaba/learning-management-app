"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seed;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dynamoose_1 = __importDefault(require("dynamoose"));
const pluralize_1 = __importDefault(require("pluralize"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client;
/* DynamoDB Configuration */
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    dynamoose_1.default.aws.ddb.local();
    client = new client_dynamodb_1.DynamoDBClient({
        endpoint: "http://localhost:8000",
        region: "us-east-2",
        credentials: {
            accessKeyId: "dummyKey123",
            secretAccessKey: "dummyKey123",
        },
    });
}
else {
    client = new client_dynamodb_1.DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-2",
    });
}
/* DynamoDB Suppress Tag Warnings */
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
    if (!message.includes("Tagging is not currently supported in DynamoDB Local")) {
        originalWarn(message, ...args);
    }
};
async function createTables() {
    const models = [transactionModel_1.default, userCourseProgressModel_1.default, courseModel_1.default];
    for (const model of models) {
        const tableName = model.name;
        const table = new dynamoose_1.default.Table(tableName, [model], {
            create: true,
            update: true,
            waitForActive: true,
            throughput: { read: 5, write: 5 },
        });
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await table.initialize();
            console.log(`Table created and initialized: ${tableName}`);
        }
        catch (error) {
            console.error(`Error creating table ${tableName}:`, error.message, error.stack);
        }
    }
}
async function seedData(tableName, filePath) {
    const data = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
    const formattedTableName = pluralize_1.default.singular(tableName.charAt(0).toUpperCase() + tableName.slice(1));
    console.log(`Seeding data to table: ${formattedTableName}`);
    for (const item of data) {
        try {
            await dynamoose_1.default.model(formattedTableName).create(item);
        }
        catch (err) {
            console.error(`Unable to add item to ${formattedTableName}. Error:`, JSON.stringify(err, null, 2));
        }
    }
    console.log("\x1b[32m%s\x1b[0m", `Successfully seeded data to table: ${formattedTableName}`);
}
async function deleteTable(baseTableName) {
    let deleteCommand = new client_dynamodb_1.DeleteTableCommand({ TableName: baseTableName });
    try {
        await client.send(deleteCommand);
        console.log(`Table deleted: ${baseTableName}`);
    }
    catch (err) {
        if (err.name === "ResourceNotFoundException") {
            console.log(`Table does not exist: ${baseTableName}`);
        }
        else {
            console.error(`Error deleting table ${baseTableName}:`, err);
        }
    }
}
async function deleteAllTables() {
    const listTablesCommand = new client_dynamodb_1.ListTablesCommand({});
    const { TableNames } = await client.send(listTablesCommand);
    if (TableNames && TableNames.length > 0) {
        for (const tableName of TableNames) {
            await deleteTable(tableName);
            await new Promise((resolve) => setTimeout(resolve, 800));
        }
    }
}
async function seed() {
    await deleteAllTables();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createTables();
    const seedDataPath = path_1.default.join(__dirname, "./data");
    const files = fs_1.default
        .readdirSync(seedDataPath)
        .filter((file) => file.endsWith(".json"));
    for (const file of files) {
        const tableName = path_1.default.basename(file, ".json");
        const filePath = path_1.default.join(seedDataPath, file);
        await seedData(tableName, filePath);
    }
}
if (require.main === module) {
    seed().catch((error) => {
        console.error("Failed to run seed script:", error);
    });
}
