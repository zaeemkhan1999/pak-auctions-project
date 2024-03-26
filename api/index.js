const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
var nodemailer = require('nodemailer');
const Product = require("./models/Product");
const Alert = require("./models/Alert");
const adminRoute = require("./routes/admin");
const Bid = require("./models/Bid");
const productRoute = require("./routes/product");
const stripeRoute = require("./routes/stripe");

const cors = require("cors");

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
dotenv.config();
mongoose.connect(
  process.env.MONGO_URL
)
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.log(err);
  });

async function myFunc() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'auctionpak@gmail.com',
      pass: 'rzfxfjdqomdopmyf'
    }
  });
  try {
    const now = new Date();
    const isoString = now.toISOString();
    size = await Product.find().count()
    products = await Product.find();
    for (let i = 0; i < size; ++i) {
      if (products[i].emailflag == false) {
        if (products[i].edate <= now) {
          const bid = await Bid.find({ product: products[i]._id }).limit(1).sort({ amount: -1 }).populate("user");
          console.log(bid);
          user_email = bid[0].user.email;
          if (user_email) {
            var mailOptions = {
              from: 'auctionpak@gmail.com',
              to: user_email,
              subject: 'Congratulations on Winning the Auction',
              html: `
                        <p>Dear [Customer Name],</p>
                        <p>We are pleased to inform you that you have won the auction for [Item Name]! Congratulations on
                         your successful bid and thank you for participating.</p>
                        <p>If you have any questions or concerns, please do not hesitate to 
                        contact us at [Company Contact Information]. Once again, congratulations on
                         your winning bid and we look forward to your continued participation in future auctions.</p>
                        <p>Best regards,</p>
                        <p>Pak Auction</p> 
                    `
            };
            transporter.sendMail(mailOptions, async function (error, info) {
              flag = 0
              if (error) {
                console.log(error);
              } else {
                flag = 1
                console.log('Email sent: ' + info.response);
                flag=await Product.findByIdAndUpdate(products[i]._id, {
                  $set: {
                    emailflag: true
                  }
                },{ new: true })
              }
            });
            if (flag == 1) {
              flag = await Product.findByIdAndUpdate(products[i]._id, {
                $set: {
                  emailflag: true
                }
              }, { new: true })
            }
          }
          else {
            console.log("NoBidder")
          }
        }
      }
    }
  }
  catch (err) {
    console.log(err)
  }


  //   //   transporter.sendMail(mailOptions, function(error, info){
  //   //     if (error) {
  //   //       console.log(error);
  //   //     } else {
  //   //       console.log('Email sent: ' + info.response);
  //   //     }
  //   //   }); 
}
const autoBidInterval = 10000; // 10 seconds
setInterval(async () => {
  const now = new Date();
  const products = await Product.find({ endDate: { $gt: now } });
  for (const product of products) {
    const maxBid = await Bid.findOne({ product: product._id })
      .sort({ amount: -1 })
      .limit(1)
      .populate('user');
    let maxUser;
    let maxAmount;
    if (maxBid) {
      maxAmount = maxBid.amount;
      maxUser = maxBid.user._id.toString();
      console.log(maxAmount);
      console.log(maxUser);
    }
    const maxAuto = await Bid.find({ product: product._id, maxAutoBid: { $ne: null } })
    if (maxAuto) {
      for (const max of maxAuto) {
        let userAuto = max.user;
        let user = userAuto.toString();
        let userMax = max.maxAutoBid;
        if (user != maxUser && userMax > maxAmount) {
          max.amount = maxAmount + 1;
          await max.save();
        }
      }
    }

  }
}, autoBidInterval);

const alertInterval = 10000; // 2 minutes

// Function to start sending alerts at regular intervals
function sendAlerts() {
  setTimeout(async () => {
    try {
      // Get all alerts from the database
      const alerts = await Alert.find();

      // Iterate through each alert
      for (const alert of alerts) {
        const { email, product, categories } = alert;

        // Search for matching products based on the alert criteria
        const matchingProducts = await Product.find({
          $or: [
            { title: {  $eq: product } },
            { categories: { $eq: categories } }
          ]
        });

        if (matchingProducts.length > 0) {
          // Send email notification to the user
          await sendEmailNotification(email, matchingProducts);
          console.log("sendEmailNOtification")
          await Alert.deleteOne({ _id: alert._id });
        }
      }

      console.log('Email notifications sent successfully.');

      // Call the function recursively after the specified interval
      sendAlerts();
    } catch (error) {
      console.error(error);
    }
  }, alertInterval);
}

// Function to send email notification
async function sendEmailNotification(email, products) {
  // Configure your email service provider settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'auctionpak@gmail.com',
      pass: 'rzfxfjdqomdopmyf'
    }
  });

  // Compose the email content
  const mailOptions = {
    from: 'auctionpak@gmail.com',
    to: email,
    subject: 'Matching Products Alert',
    text: 'Matching products found based on your alert:\n\n' + products.map(p => p.title).join('\n')
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

// Start sending alerts
sendAlerts();

myFunc();
app.use(express.json());
app.use('/routes', express.static('routes'));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", adminRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!")
})