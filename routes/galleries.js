const {Gallery, validateGallery} = require("../models/gallery");
const {Catalog, validateCatalog} = require("../models/catalog");
const {Photo, validatePhoto} = require("../models/photo");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.post("/catalogs", auth, async (req, res) => {
    const {error} = validateCatalog(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const gallery = await Gallery.findById(req.user.galleryId);
    if (!gallery) return res.status(404).send("The catalog could not be added to your gallery.");


    let catalog = new Catalog({
        title: req.body.title
    });

    gallery.catalogs.push(catalog);

    await gallery.save();

    res.send(catalog);
});

router.post("/catalogs/:id/photos", [auth, validateObjectId], async (req, res) => {
    const {error} = validatePhoto(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const gallery = await Gallery.findById(req.user.galleryId);
    if (!gallery) return res.status(404).send("The photo could not be added to your catalog.");

    let catalog = gallery.catalogs.id(req.params.id);
    if (!catalog) return res.status(404).send("Invalid catalog.");

    const photo = new Photo({
        link: req.body.link
    });
    catalog.photos.push(photo);

    await gallery.save();

    res.send(gallery);
});

router.get("/", async (req, res) => {
    const galleries = await Gallery.find().select("-__v");

    if (!galleries)
        return res.status(404).send("There are no galleries in the database.");

    res.send(galleries);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const gallery = await Gallery.findById(req.params.id).select("-__v");

    if (!gallery)
        return res.status(404).send("The gallery with the given ID was not found.");

    res.send(gallery);
});

module.exports = router;
