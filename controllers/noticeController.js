import Notice from "../models/Notice.js";

export const renderNoticeForm = (req, res) => {
  res.render("notice_form");
};

export const createNotice = async (req, res) => {
  try {
    const { type, venue, contact, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Notice.create({
      type,
      venue,
      contact,
      description,
      image,
      owner: req.user._id,
    });

    res.redirect("/notices");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating notice");
  }
};

export const getAllNotices = async (req, res) => {
  const notices = await Notice.find().populate("owner", "nickname");
  res.render("notices", { notices });
};