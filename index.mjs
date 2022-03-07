import fs from "fs";
import fetch from "node-fetch";
import { parse, transforms } from "json2csv";

fetchEnglandTrafficReport();
function fetchEnglandTrafficReport() {
  const currentDate = new Date();
  fetch(
    `https://www.trafficengland.com/api/network/getJunctionSections?roadName=M1&_=${+currentDate}`
  )
    .then((res) => res.json())
    .then((data) => {
      const destFile = `data/${currentDate.toGMTString()}.csv`;

      // Convert JSON to Array and set the key in _key
      const arr = Object.keys(data).reduce((acc, dataKey) => {
        const obj = { ...data[dataKey] };
        obj._key = dataKey;
        acc.push(obj);
        return acc;
      }, []);

      const csv = parse(arr, {
        transforms: [transforms.flatten({ arrays: true, objects: true })],
      });

      fs.writeFileSync(destFile, csv);

      console.log(`Data for ${currentDate} written successfully`);
    });
}
