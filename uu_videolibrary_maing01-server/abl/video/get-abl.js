const path = require("path");
const LibraryDao = require("../../dao/video-library-dao");
let dao = new LibraryDao(
  path.join(__dirname, "..", "..", "storage", "videos.json")
);

// get video - accepts only video.code parameter
async function GetAbl(req, res) {
  const videoCode = req.code;

  if (!videoCode) {
    return res
      .status(400)
      .json({ error_message: "Invalid input: code parameter is missing." });
  }

  const video = await dao.getVideo(videoCode);

  if (!video) {
    return res
      .status(400)
      .json({ error_message: `Video with code '${videoCode}' doesn't exist.` });
  }

  res.json(video);
}

module.exports = GetAbl;
