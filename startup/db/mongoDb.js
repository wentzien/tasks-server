const logger = require("../logger");
const MongoClient = require("mongodb").MongoClient;
const config = require("config");

let mongoDb;

module.exports = {
    connectToDb: () => {
        console.log("hall", config.get("db.mongoDb.url"));
        const client = new MongoClient(config.get("db.mongoDb.url"), {useUnifiedTopology: true});
        client.connect(err => {
            if (err) {
                logger.error(err.message);
            } else {
                logger.info("Connected successfully to MongoDB Server.");
            }
        });
        mongoDb = client.db(config.get("db.mongoDb.name"));
        return mongoDb;
    },
    getDb: () => {
        return mongoDb;
    }
};
