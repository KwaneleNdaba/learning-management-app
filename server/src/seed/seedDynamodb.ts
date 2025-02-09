import {
  DynamoDBClient,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import fs from "fs";
import path from "path";
import dynamoose from "dynamoose";
import pluralize from "pluralize";
import Transaction from "../models/transactionModel";
import Course from "../models/courseModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import dotenv from "dotenv";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
dotenv.config();
let client: DynamoDBClient;

/* DynamoDB Configuration */
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
  client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "us-east-2",
    credentials: {
      accessKeyId: "dummyKey123",
      secretAccessKey: "dummyKey123",
    },
  });
} else {
  client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
  });
}

/* DynamoDB Suppress Tag Warnings */
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
  if (
    !message.includes("Tagging is not currently supported in DynamoDB Local")
  ) {
    originalWarn(message, ...args);
  }
};

async function isTableActive(tableName: string): Promise<boolean> {
  try {
    const describeCommand = new DescribeTableCommand({ TableName: tableName });
    const response = await client.send(describeCommand);
    return response.Table?.TableStatus === "ACTIVE";
  } catch (error) {
    console.error(`Error checking status of table ${tableName}:`, error);
    return false;
  }
}

async function createTables() {
  const models = [Transaction, UserCourseProgress, Course];

  for (const model of models) {
    const tableName = model.name;

    try {
      // Check if the table already exists
      const tableExists = await client
        .send(new ListTablesCommand({}))
        .then((data) => data.TableNames?.includes(tableName))
        .catch(() => false);

      if (!tableExists) {
        console.log(`Creating table: ${tableName}`);
        const table = new dynamoose.Table(tableName, [model], {
          create: true,
          update: true,
          waitForActive: true,
          throughput: { read: 5, write: 5 },
        });

        await new Promise((resolve) => setTimeout(resolve, 15000)); // 15-second delay
        console.log(`Initializing table: ${tableName}`);
        await table.initialize();
        console.log(`Table created and initialized: ${tableName}`);

        // Wait until the table is active
        let isActive = false;
        while (!isActive) {
          isActive = await isTableActive(tableName);
          if (!isActive) {
            console.log(`Waiting for table ${tableName} to become active...`);
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
          }
        }
        console.log(`Table ${tableName} is now active`);
      } else {
        console.log(`Table already exists: ${tableName}`);
      }
    } catch (error: any) {
      console.error(
        `Error creating table ${tableName}:`,
        error.message,
        error.stack
      );
      // Continue to the next table even if this one fails
      continue;
    }
  }
}

async function seedData(tableName: string, filePath: string) {
  try {
    const data: { [key: string]: any }[] = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    const formattedTableName = pluralize.singular(
      tableName.charAt(0).toUpperCase() + tableName.slice(1)
    );

    console.log(`Seeding data to table: ${formattedTableName}, total items: ${data.length}`);

    for (const item of data) {
      try {
        await dynamoose.model(formattedTableName).create(item);
        console.log(`Added item to ${formattedTableName}:`, item);
      } catch (err) {
        console.error(`Error adding item to ${formattedTableName}:`, err);
      }
    }

    console.log(`Successfully seeded data to table: ${formattedTableName}`);
  } catch (error) {
    console.error(`Error seeding table ${tableName}:`, error);
  }
}

async function deleteTable(baseTableName: string) {
  let deleteCommand = new DeleteTableCommand({ TableName: baseTableName });
  try {
    await client.send(deleteCommand);
    console.log(`Table deleted: ${baseTableName}`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Table does not exist: ${baseTableName}`);
    } else {
      console.error(`Error deleting table ${baseTableName}:`, err);
    }
  }
}

async function deleteAllTables() {
  const listTablesCommand = new ListTablesCommand({});
  const { TableNames } = await client.send(listTablesCommand);

  if (TableNames && TableNames.length > 0) {
    for (const tableName of TableNames) {
      await deleteTable(tableName);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
    }
  }
}
export default async function seed() {
  try {
    await deleteAllTables();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait to avoid conflicts
    await createTables();

    const seedDataPath = path.join(process.cwd(), "src/seed");
    const files = fs
      .readdirSync(seedDataPath)
      .filter((file) => file.endsWith(".json"));

    for (const file of files) {
      const tableName = path.basename(file, ".json");
      const filePath = path.join(seedDataPath, file);
      await seedData(tableName, filePath);
    }
  } catch (error) {
    console.error("Error in seed function:", error);
  }
}
if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
  });
}
