import fs from "fs";
const beautify = require("js-beautify");

const args = process.argv.slice(2);
const lowerCaseArrray = args.map((item) => item.toLowerCase());
const service = lowerCaseArrray.join("-");

const getCollectionName = () => {
  const modified = service.split("-").join("");
  const firstLatter = modified[0].toUpperCase();
  const collection = `${firstLatter}${modified.slice(1)}`;
  return collection;
};

try {
  fs.mkdirSync(`./src/${service}`);
  fs.writeFileSync(`./src/${service}/${service}.routes.ts`, "");
  fs.writeFileSync(`./src/${service}/${service}.controller.ts`, "");
  fs.writeFileSync(`./src/${service}/${service}.schema.ts`, "");
  fs.writeFileSync(`./src/${service}/${service}.dto.ts`, "");
  const serverFile = fs.readFileSync("./src/index.ts", "utf8");
  const fileArray = serverFile.split("\n");

  const statements: any[] = [];

  for (let data of fileArray) {
    statements.push(data);
    if (data === "// Routes\r")
      statements.push(
        `import ${service
          .split("-")
          .join("")}Router from './${service}/${service}.routes'`
      );
  }

  // Setup endpoint
  statements.push(
    `app.use('/${service}', ${service.split("-").join("")}Router)`
  );

  const original = statements.join("\n");
  fs.writeFileSync("./src/index.ts", original, "utf8");

  // adding basic code architecture example to controller
  const schemaSample = beautify.js(
    `
      import {Schema, model} from "mongoose"

      const modelSchema = new Schema({

      }, {timestamps: true});

      const ${getCollectionName()}Schema = model("${getCollectionName()}", modelSchema)
      export default ${getCollectionName()}Schema
    `,
    { indentSize: 2 }
  );

  fs.writeFileSync(`./src/${service}/${service}.schema.ts`, schemaSample);

  // adding basic code architecture example to controller
  const controllerSample = beautify.js(
    `
      import {Request, Response} from "express"
      import Catch from '../../lib/catch.lib'
      import ${getCollectionName()}Schema from './${service}.schema'

      export const fetch = Catch(async (req: Request, res: Response)=>{
        res.status(200).json({success: true})
      })
    `,
    { indentSize: 2 }
  );

  fs.writeFileSync(
    `./src/${service}/${service}.controller.ts`,
    controllerSample
  );

  // Writing login in route file
  const routeSample = beautify.js(
    `
      import express from "express"
      import {${service}Fetch} from "./${service}.controller"
      const router = express.Router()

      router.get("/", ${service}Fetch)

      export default router
    `,
    { indentSize: 2 }
  );

  fs.writeFileSync(`./src/${service}/${service}.routes.ts`, routeSample);
  console.log("Success !");
} catch (err: any) {
  console.log(`${service} is already exist !`);
}
