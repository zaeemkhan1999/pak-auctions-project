const User = require("../models/User");
const SuspendAccount = require("../models/SuspendedAccounts");
const ReportMessage = require("../models/ReportMessages");

const router = require("express").Router();


router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await User.find().select("name email cnic phone isSuspended");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/addaccount", async (req, res) => {
  const suspendAccount = new SuspendAccount({
    user: req.body.user,
    reason: req.body.reason,
    sdate: req.body.sdate,
    edate: req.body.edate,
    lifetime: req.body.lifetime
  })

  console.log("Suspended Account : ", suspendAccount)
  try {
    const suspendAccountResult = await suspendAccount.save();

    let filter = { _id: req.body.user };
    let update = { isSuspended: true };

    updatedUser = await User.updateOne(filter, update, { new: true })

    res.status(201).json("Account Suspended");
  }
  catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/removeaccount", async (req, res) => {
  try {
    const deletedUser = await SuspendAccount.deleteOne({user : req.body.user});
    let filter = { _id: req.body.user };
    let update = { isSuspended: false };

    updatedUser = await User.updateOne(filter, update, { new: true });
    res.status(201).json("Status updated");
  }
  catch (err) {
    res.status(500).json(err);
    // return console.log(err)
  }
})

router.get("/findsuspendeduser/:id", async (req, res) => {
  try {
    const user = await SuspendAccount.find({user : req.params.id});
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/addreportmessage", async (req, res) => {
  const addMessage = new ReportMessage({
      sender: req.body.sender,
      profile : req.body.profile,
      message: req.body.message,
  })

  try {
      const res = await addMessage.save();

      res.status(201).json("Report Sent");
  }
  catch (err) {
      res.status(500).json(err);
  }
})

router.get("/allreports", async (req, res) => {
  try {
    const allReportedMessages = await ReportMessage.find().populate('sender', 'name').populate('profile', 'name isSuspended');;
    res.status(200).json(allReportedMessages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
