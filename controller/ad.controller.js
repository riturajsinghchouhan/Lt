import Ad from "../model/ad.model.js";

// 👉 Create Ad
export const createAd = async (req, res) => {
  try {
    const { title, description, link, type } = req.body;
    let image = null;

    if (req.files && req.files.image) {
      const file = req.files.image;
      const uploadPath = "uploads/ads/" + Date.now() + "-" + file.name;
      await file.mv(uploadPath); // save file
      image = uploadPath;
    }

    const ad = new Ad({ title, description, link, type, image });
    await ad.save();

    res.status(201).json({ success: true, message: "Ad created", ad });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 👉 Get All Ads
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json({ success: true, ads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 👉 Update Ad
export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files && req.files.image) {
      const file = req.files.image;
      const uploadPath = "uploads/ads/" + Date.now() + "-" + file.name;
      await file.mv(uploadPath);
      updateData.image = uploadPath;
    }

    const ad = await Ad.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, message: "Ad updated", ad });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 👉 Delete Ad
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    await Ad.findByIdAndDelete(id);
    res.json({ success: true, message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
