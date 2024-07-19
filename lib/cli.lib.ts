import fs from "fs";
const args = process.argv.slice(2);

const lowerCaseArray = args.map((item: any) => item.toLowerCase());
const service = lowerCaseArray.join("-");

try {
  fs.mkdirSync(`src/${service}`);

  fs.writeFileSync(`src/${service}/${service}.routes.ts`, "");
  fs.writeFileSync(`src/${service}/${service}.controller.ts`, "");
  fs.writeFileSync(`src/${service}/${service}.schema.ts`, "");
  fs.writeFileSync(`src/${service}/${service}.dto.ts`, "");
  fs.appendFileSync(`./src/index.ts`, "const demo = 'tst'");
} catch (err: any) {
  console.log(`${service} is already exists!`);
}
