const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");
const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100, //flight_numnber
  mission: "Kepler X", //name
  rocket: "explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //X
  customers: ["NASA", "ZTM"], //payload.customers
  upcoming: true, //bool upcoming
  success: true, //bool success
};

saveLaunch(launch);

const SPACEX_DB_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading Launch Data...");
  const response = await axios.post(SPACEX_DB_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200){
    console.log('Problem downloading launch data');
    throw new Error('Launch data Download Fail');
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDb.findOne(filter);
}
async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}
async function getAllLaunches() {
  return await launchesDb.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}
async function saveLaunch(launch) {
  await launchesDb.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function secheduleNewLaunch(launch) {
  const planet = await planets.findOneAndReplace({
    kepler_name: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}
async function abortLaunchById(launchId) {
  const aborted = await launchesDb.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}
module.exports = {
  getAllLaunches,
  secheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
