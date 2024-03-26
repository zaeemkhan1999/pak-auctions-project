require('dotenv').config();
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);


router.post("/payment", async (req, res) => {
  try {
    const { tokenId, amount, userId, productID } = req.body;

    const charge = await stripe.charges.create({
      source: tokenId,
      amount: amount,
      currency: "pkr",
      metadata: {
        userId: userId,
        productID: productID,
      },
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});

router.get('/getpayments/:userId/:productId', async (req, res) => {
  try {
    const payments = await stripe.charges.search({
      query: `metadata['userId']:"${req.params.userId}" AND metadata['productId']:"${req.params.productId}"`,
    });

    res.json(payments.data.length);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});



module.exports = router;
