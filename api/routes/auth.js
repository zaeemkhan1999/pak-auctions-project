const router = require("express").Router();
const User = require("../models/User");
const multer = require('multer');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/images')
    },
    filename: function (req, file, cb) { // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const upload = multer({storage: storage})
// REGISTER
router.post("/register", upload.single('myFile'), async (req, res) => {
    let profile = (req.file) ? req.file.filename : null;
    console.log("CHECK")
    let {
        username,
        email,
        cnic,
        phone,
        password
    } = req.body;

    let user = await User.findOne({email: req.body.email});
    if (user) 
        return res.status(409).send({message: "User with given email already Exist!"});
     else {

        const newUser = new User({
            name: username,
            email: email,
            cnic: cnic,
            phone: phone,
            password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
            profile: profile
        });

        // console.log(newUser);
        const savedUser = await newUser.save();
        user = savedUser
        console.log(savedUser)
        const token = await new Token({userId: user._id, token: crypto.randomBytes(32).toString("hex")}).save();

        const url = `${
            process.env.BASE_URL
        }users/${
            user.id
        }/verify/${
            token.token
        }`;
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({message: "An Email sent to your account please verify"});
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (! user) {
            res.status(401).json("Wrong credentials!");
        } else {

            if (! user.verified) {
                console.log("NOT VERIFIED")
                res.status(401).json("User Not Verified");
            } else {

                const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
                const Password = hashedPassword.toString(CryptoJS.enc.Utf8);
                if (Password !== req.body.password) {
                    res.status(401).json("Wrong credentials!");
                } else {
                    const accessToken = jwt.sign({
                        id: user._id,
                        isAdmin: user.isAdmin
                    }, process.env.JWT_SEC, {expiresIn: "1d"});
                    const {
                        password,
                        ...others
                    } = user._doc;
                    res.status(200).json({
                        ...others,
                        accessToken
                    });
                }

            }

        }

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id/verify/:token/", async (req, res) => {
    try {

        const user = await User.findOne({_id: req.params.id});

        const token = await Token.findOne({userId: user._id, token: req.params.token});

        if (! token) 
            return res.status(400).send({message: "Invalid link"});
        

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $set: {
                verified: true
            }
        }, {new: true});

        // const tkn = await Token.deleteOne({userId:user._id},function (err) {
        //     if (err) console.log(err);
        // });

        //const tkn = await Token.deleteOne({userId: user._id});
        // if (tkn.deletedCount === 0) {
        // return res.status(500).send({ message: "Error deleting token" });
        // }


        res.status(200).send({message: "Email verified successfully"});
    } catch (error) {
        res.status(500).send({message: "Internal Server Error"});
    }

});


module.exports = router;
