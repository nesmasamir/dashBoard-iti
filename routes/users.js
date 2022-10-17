const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-password");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});
 
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) { 
    res.status(500).json({
      message: "The user with the given ID was not found.",
    });
  }
  res.status(200).send(user);
});
// const salt = bcrypt.genSaltSync(10)
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hash(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created");

  res.send(user);
});

router.put("/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);

  let newPassword;

  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.password;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    },
    {
      new: true,
    }
  );

  if (!user) return res.status(400).send("the user cannot be created");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
        userName: user.name,
      },
      secret
    );

    res.status(200).send({
      user: user.email,
      token: token,
      userName: user.name,
      userId: user.id,
    });
  } else {
    res.status(400).send("Password is wrong!");
  }
});
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  }); 
  try {
    user = await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send({
      message: "Email Must Be Unique",
    });
  }

  // if (!user) return res.status(400).send("the user cannot be created");
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments({});
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "the user is deleted",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: " user is not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
