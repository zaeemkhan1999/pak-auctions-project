const Bid = require("../models/Bid");
const Product = require("../models/Product");
const Alert=require("../models/Alert");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const url = require('url');

const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 10
});


//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }

});
//Create Alert
router.post("/alert", async (req, res) => {
    try {
        const { email, product, categories } = req.body;
    
        const alert = new Alert({
          email,
          product,
          categories
        });
    
        const savedAlert = await alert.save();
    
        res.status(201).json(savedAlert);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET Product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Search Product
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'No search query provided' });
        }
        const products = await Product.find({
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { desc: { $regex: new RegExp(query, "i") } }
            ],
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
//GET ALL Products
router.get("/", async (req, res) => {
    //to get only top 5 new users
    const urlParts = url.parse(req.url, true)
    const qCategory = urlParts.path.slice(11).replaceAll("%20", " ");

    const qNew = req.query.new;
    // const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/myauctions/:id", async (req, res) => {

    try {
        let products;
        products = await Product.find({ userId : req.params.id}).sort({ createdAt: -1 })

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/productinfo/:id", async (req, res) => {

    try {
        let bidCount;
        bidCount = await Bid.countDocuments({ product : req.params.id})

        res.status(200).json(bidCount);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/getrecomendations",async(req,res)=>{

    try {
         let rd_products = ""

        
        const productIds = req.query.ids;
        
        let products = await Product.find({ _id: { $in: productIds } })
        .then(products => {
 
        console.log(products)
        res.status(200).json(products) 
        })
        
    
    } catch(err){

    }
    
});


module.exports = router;