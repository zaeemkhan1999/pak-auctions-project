const User = require("../models/User");
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const Comments = require("../models/Comments");
const Message = require("../models/Message");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
//update
router.put("/profile/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});
const multer = require('multer');
const { json } = require("react-router-dom");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/images')
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage })
router.post("/upload", upload.array('uploadedImages', 10), async (req, res) => {
    let img = (req.files);
    const { title, desc, category, price, sdate, edate, userId } = req.body;

    const product = new Product({
        title: title,
        desc: desc,
        categories: category,
        price: price,
        sdate: sdate,
        edate: edate,
        userId: userId,
        image: img
    })

    try {
        const prduct = product.save();
        res.status(201).json(prduct);
    }
    catch (err) {
        res.status(500).json(err);
        // return console.log(err)
    }
})

// submit a bid on an product
// router.post("/bid", async(req,res)=>{
    
//     const {amount, date, user, product} = req.body

    
//     const bid =  new Bid({
//         amount : amount,
//         date : date,
//         user : user,
//         product : product
//     })

//     try {
//      const SubmitBid = bid.save();
//     //res.status(201).json(prduct);   
//     }   
//     catch(err) {
//         res.status(500).json(err);
//         // return console.log(err)
//     }
// })
router.post('/bid', async (req, res) => {
    const { amount, date, user, product, maxAutoBid } = req.body;
  
    let bidAmount = amount;
  
    const bid = new Bid({
      amount: bidAmount,
      date,
      user,
      product,
      maxAutoBid
    });
  
    try {
      const newBid = await bid.save();
      res.status(201).json(newBid);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get max bid of a product
router.get("/bid/:id", async (req, res) => {

    try {
        const bid = await Bid.find({ product: req.params.id })
            .limit(1)
            .sort({ amount: -1 })
            .select("amount")
            ;
        res.status(200).json(bid);
    } catch (err) {
        res.status(500).json(err);
    }
})
router.get("/user/bids/:id",async(req,res)=>{

    try {
        
        const product_ids = await Bid.find({user: req.params.id}).distinct("product");
        const product_data = await Product.find({ _id: { $in: product_ids } }).select("title categories")
        res.status(200).json(product_data)

 } catch(err){
    res.status(500).json(err);
    
}
    
})

//count no of bids placed
router.get("/countbid/:id", async (req, res) => {

    try {
        const bidCount = await Bid.find({ product: req.params.id })
            .count()
            ;
        res.status(200).json(bidCount);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});
//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    //to get only top 5 new users
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/topbidder/:id", async (req, res) => {

    try {
        const bid = await Bid.find({ product: req.params.id }).limit(3).sort({ amount: -1 }).populate("user");
        // console.log(bid[0].user.name)
        // console.log(bid[1].user.name)
        // console.log(bid[2].user.name)
        res.status(200).json(bid);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/finduser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/addcomment", async (req, res) => {
    const addComment = new Comments({
        receiver: req.body.receiver,
        sender: req.body.sender,
        comment: req.body.comment,
        date: req.body.date,
    })

    try {
        const res = await addComment.save();

        res.status(201).json("Comment Added");
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.get("/getcomments/:id", async (req, res) => {
    try {
        const comments = await Comments.find({ receiver: req.params.id }).populate("sender");
        res.status(200).json(comments);

    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/addmessage", async (req, res) => {
    const addMessage = new Message({
        receiver: req.body.receiver,
        sender: req.body.sender,
        product: req.body.product,
        message: req.body.message,
    })

    try {
        const res = await addMessage.save();

        res.status(201).json("Message Sent");
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.get("/getmessages", async (req, res) => {

    const productID = req.query.id;
    const userID = req.query.userID;

    try {
        const messages = await Message.find({ product: productID }).sort({ createdAt: 1 });
        if (messages.length > 0) {
            let updatedMessages = [];
            for (let i = 1; i < messages.length; i++) {

                if (messages[i].sender == userID || messages[i].receiver == userID) {

                    updatedMessages.push({
                        _id: messages[i]._id,
                        receiver : messages[i].receiver,
                        sender: messages[i].sender,
                        message: messages[i].message,
                        createdAt: messages[i].createdAt
                    });
                }
            }
            res.status(200).json(updatedMessages);

        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/getallmessages", async (req, res) => {

    const productID = req.query.id;

    try {

        // const messages = await Message.find({product : productID}).sort({sender : -1, createdAt : 1}).populate("sender receiver");

        const messages = await Message.find({ product: productID })
            .sort({ sender: 1, createdAt: -1 })
            .select('_id sender message createdAt')
            .populate('sender', 'name')
            .populate('receiver', 'name');

        // console.log("Message length : ", messages.length);

        if (messages.length > 0) {
            let updatedMessages = [];

            updatedMessages.push({
                _id: messages[0]._id,
                sender: messages[0].sender,
                message: messages[0].message,
                createdAt: messages[0].createdAt
            });

            for (let i = 1; i < messages.length; i++) {

                if (messages[i].sender == messages[i - 1].sender) {
                    continue
                }
                else {
                    updatedMessages.push({
                        _id: messages[i]._id,
                        sender: messages[i].sender,
                        message: messages[i].message,
                        createdAt: messages[i].createdAt
                    });
                }

            }

            res.status(200).json(updatedMessages);
        }

        else {

            res.status(200).json([]);
        }

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/countauctions/:id", async (req, res) => {

    try {
        const auctionCount = await Product.find({ userId: req.params.id })
            .count()
            ;
        res.status(200).json(auctionCount);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
