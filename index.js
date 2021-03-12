// Imports
const sha1 = require("./utils/hash.js");
const fetch = require("node-fetch");

// Constants
const { FILECHUNK, DOMAIN } = require("./constants");

// Varies with Video
const ID = "41952142990";
const CHANNEL = "criticalrole";

const getTimeStampFromResponse = async (channel, id) => {
  // Send Get Request
  const data = await fetch(
    `https://twitchtracker.com/${channel}/streams/${id}`
  );
  const text = await data.text();

  // Get Timestamp
  const index = text.indexOf("stream on ") + 10;
  const timestamp = text.substring(index, index + 19);

  return new Promise(function (resolve, reject) {
    if (timestamp) {
      resolve(timestamp);
    } else {
      reject("Time Stamp Not Found");
    }
  });
};

const getUnixTime = (date) => {
  const time = date + " UTC";
  return new Date(time).getTime() / 1000;
};

const hashAndTruncate = (str) => {
  return sha1(str).substring(0, 20);
};

const getFile = (name, vodID, domain, fileChunk, date) => {
  let timestamp = getUnixTime(date);
  const baseString = name + "_" + vodID.toString() + "_" + timestamp.toString();
  try {
    let hash = hashAndTruncate(baseString);
    let finalString = hash + "_" + baseString;
    return domain + "/" + finalString + fileChunk;
  } catch {
    console.log("An Error has occured");
  }
};

const main = async () => {
  const timestamp = await getTimeStampFromResponse(CHANNEL, ID);
  const link = getFile(CHANNEL, ID, DOMAIN, FILECHUNK, timestamp);
  return link;
};

main().then((link) => console.log(link));
