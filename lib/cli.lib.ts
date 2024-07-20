import fs from "fs";
const args = process.argv.slice(2);
const lowerCaseArrray = args.map((item) => item.toLowerCase());
const service = lowerCaseArrray.join("-");

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

  // Writing login in route file
  const routeSample = [
    "import express from 'express'",
    "const router = express.Router()\n",
    "router.get('/', (req, res)=>{",
    "\t res.send('Welcome !')",
    "})\n",
    "export default router",
  ];
  fs.writeFileSync(
    `./src/${service}/${service}.routes.ts`,
    routeSample.join("\n")
  );
  console.log("Success !");
} catch (err: any) {
  console.log(`${service} is already exist !`);
}
