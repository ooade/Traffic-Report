import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { exec } from "child_process";
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
      const fileDir = `data/${year}/${month}/${day}`;

      // Setup the directory
      mkdir(fileDir);

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

      const destFile = `${hour}:${minute} ${dayPeriod}.csv`;
      fs.writeFileSync(path.join(fileDir, destFile), csv);

      console.log(`Data for ${currentDate} written successfully`);
    });
}

function mkdir(dir) {
  const arr = dir.split("/");
  let prevPath = "";

  for (let path of arr) {
    exec(`mkdir ${prevPath + path}`, (err) => {
      // Skip showing file exists error =D
      if (err && !err.message.includes("File exists")) {
        console.error(err.message);
      }
    });
    prevPath += `${path}/`;
  }
}