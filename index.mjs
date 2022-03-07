import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { execSync } from "child_process";
import { parse, transforms } from "json2csv";

fetchEnglandTrafficReport();
function fetchEnglandTrafficReport() {
  const currentDate = new Date();
  fetch(
    `https://www.trafficengland.com/api/network/getJunctionSections?roadName=M1&_=${+currentDate}`
  )
    .then((res) => res.json())
    .then((data) => {
      const dateInParts = Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "long",
        hour12: true,
      }).formatToParts(currentDate);

      const { year, day, month, hour, minute, dayPeriod } = dateInParts.reduce(
        (acc, part) => {
          acc[part.type] = part.value;
          return acc;
        },
        {}
      );
      const destDir = `data/${year}/${month}/${day}`;

      // Setup the directory, as required
      execSync(`mkdir -p ${destDir}`);

      // Convert JSON to Array and set the key in _key
      const arr = Object.keys(data).reduce((acc, dataKey) => {
        const obj = { ...data[dataKey] };
        obj._key = dataKey;
        acc.push(obj);
        return acc;
      }, []);

      // Parse Arr as CSV
      const csv = parse(arr, {
        transforms: [transforms.flatten({ arrays: true, objects: true })],
      });

      const destFile = `${hour}:${minute} ${dayPeriod}.csv`;
      fs.writeFileSync(path.join(destDir, destFile), csv);

      console.log(`Data for ${currentDate} written successfully`);
    });
}