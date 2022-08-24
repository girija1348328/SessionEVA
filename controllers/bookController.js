const bookModel = require("../models/bookModel");
const validator = require("../validator/validate")
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient(
    18240,
    "redis-18240.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    // "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("BEUofXQDvNIoc9FNAcChK5VRgjLYlZIN", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createBook = async function (req, res) {
    try {
        let requestBody = req.body
   
        let { name, author, category} = requestBody;

        //book
        if (!validator.valid(name)) return res.status(400).send({ status: false, message: "name is required...!" })

        //author
        if (!validator.valid(author)) return res.status(400).send({ status: false, message: "author in required...!" })

        //category
        if (!validator.valid(category)) return res.status(400).send({ status: false, message: "category is required...!" })

         let saveBook = await bookModel.create(requestBody);
        return res.status(201).send({ status: true, message: "Success", data: saveBook })


    } catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}

const getBooksById = async function (req, res) {

    try {

        let filter = req.params.bookId

        let checkBookName = await bookModel.findOne({ _id: filter, isDeleted: false }).select({ __v: 0 }) //Check book Name From DB/
        

        if (checkBookName) {
            return res.redirect(JSON.parse(checkBookName))
        }
        else {
            
            while(checkBookName > 5){
                await SET_ASYNC(`${filter}`, JSON.stringify(checkBookName))
                return res.redirect(checkBookName)

            }
        }

        return res.status(200).send({ status: true, message: "Books list", data: checkBookName });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
module.exports ={createBook,getBooksById}
