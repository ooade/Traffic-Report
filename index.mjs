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
      const { year, day, month, hour, minute, dayPeriod } =
        getDateInParts(currentDate);

      const destDir = `data/${year}/${month}/${day.padStart(2, 0)}`;

      // Setup the directory, as required
      execSync(`mkdir -p ${destDir}`);

      createCSVAndWriteFile({
        data: obj2Arr(data),
        dest: path.join(destDir, `${hour}:${minute} ${dayPeriod}.csv`),
      });

      console.log(`Data for ${currentDate} written successfully`);
    });
}

function getDateInParts(date) {
  const dateInParts = Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
    hour12: true,
  }).formatToParts(date);

  return dateInParts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
}

function obj2Arr(data) {
  return Object.keys(data).reduce((acc, dataKey) => {
    const obj = { ...data[dataKey] };
    obj._key = dataKey;
    acc.push(obj);
    return acc;
  }, []);
}

function createCSVAndWriteFile({ data, dest }) {
  const csv = parse(data, {
    transforms: [transforms.flatten({ arrays: true, objects: true })],
  });

  fs.writeFileSync(dest, csv);
}
