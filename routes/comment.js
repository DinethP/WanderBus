
const express = require("express");
const Stop = require("../models/stopModel");
const User = require("../models/userModel");
const handleErr = require("../commonUtils").handleErr;
const router = express.Router();

// Add comment by stop_id
router.post("/api/comment", (req, res) => {
  let newComment = {
    username: req.body.username,
    content: req.body.content,
  };
  User.updateOne(
    { username: req.body.username },
    { $push: { comments: req.body.content } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        return res.json({ msg: "Username not found.", status: 204 });
      else {
        Stop.updateOne(
          { stop_id: req.body.stop_id },
          { $push: { comments: newComment } },
          (err, raw) => {
            if (err) return handleErr(err, res);
            if (raw.n == 0)
              res.json({ msg: "stop_id not found.", status: 204 });
            else res.json({ msg: "Comment added.", status: 200 });
          }
        );
      }
    }
  );
});

// Get comment by stop_id
router.get("/api/comment/:stop_id", (req, res) => {
  Stop.findOne({ stop_id: req.params.stop_id }, (err, stop) => {
    if (err) return handleErr(err, res);
    if (stop) {
      let data = [];
      for (let comment of stop.comments) {
        data.push(comment);
      }
      res.json({ data: data, status: 200 });
    } else res.json({ msg: "stop_id not found", status: 204 });
  });
});

// update comments by username & timestamp
router.put("/api/comment", (req, res) => {
  let field = "comments.$." + req.body.field;
  let value = req.body.value;
  let update = {};
  update[field] = value;
  update["comments.$.timestamp"] = new Date();
  Stop.updateOne(
    {
      $and: [
        { stop_id: req.body.stop_id },
        { "comments.username": req.body.username },
        { "comments.timestamp": req.body.timestamp },
      ],
    },
    { $set: update },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0) res.json({ msg: "comment not found.", status: 204 });
      else res.json({ msg: "Comment updated.", status: 200 });
    }
  );
});

// Delete all comments by stop_id
router.delete("/api/comment/:stop_id", (req, res) => {
  Stop.updateOne(
    { stop_id: req.params.stop_id },
    { $set: { comments: [] } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        res.json({
          msg: "stop_id not found or no comments to delete",
          status: 204,
        });
      else res.json({ msg: "Comment deleted.", status: 200 });
    }
  );
});

// Delete comment by stop_id & username & timestamp
router.delete("/api/comment/:stop_id/:username/:timestamp", (req, res) => {
  let comment = {
    username: req.params.username,
    timestamp: req.params.timestamp,
  };
  Stop.updateOne(
    { stop_id: req.params.stop_id },
    { $pull: { comments: comment } },
    (err, raw) => {
      console.log(req.params);
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        res.json({
          msg: "stop_id or username or timestamp not found.",
          status: 204,
        });
      else res.json({ msg: "Comment deleted.", status: 200 });
    }
  );
});

module.exports = router;
