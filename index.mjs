import fetch from "node-fetch";
import { parse, transforms } from "json2csv";
import fs from "fs";

fetchEnglandTrafficReport();
function fetchEnglandTrafficReport() {
  const currentDate = new Date();
  fetch(
    `https://www.trafficengland.com/api/network/getJunctionSections?roadName=M1&_=${+currentDate}`
  )
    .then((res) => res.json())
    .then((data) => {
      const csv = parse(data, {
        transforms: transforms.flatten({ objects: true, arrays: true }),
      });
      fs.writeFileSync(`data/${currentDate.toGMTString()}.csv`, csv);
      console.log(`Data for ${currentDate} written successfully`);
    });
}
