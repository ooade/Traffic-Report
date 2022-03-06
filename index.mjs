import fetch from "node-fetch";
import { parse, transforms } from "json2csv";
import fs from "fs";
import { execSync } from "child_process";

fetchEnglandTrafficReport();
function fetchEnglandTrafficReport() {
  const currentDate = new Date();
  fetch(
    `https://www.trafficengland.com/api/network/getJunctionSections?roadName=M1&_=${+currentDate}`
  )
    .then((res) => res.json())
    .then((data) => {
      const destFile = `data/${currentDate.toGMTString()}.csv`;
      const csv = parse(data, {
        transforms: transforms.flatten({ objects: true, arrays: true }),
      });
      execSync(`touch ${destFile}`);
      fs.writeFileSync(destFile, csv);
      console.log(`Data for ${currentDate} written successfully`);
    });
}