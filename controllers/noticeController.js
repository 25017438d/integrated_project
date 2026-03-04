import Notice from "../models/Notice.js";

export const renderNoticeForm = (req, res) => {
  res.render("notice_form", {
    user: req.user,
    error: req.flash("error"),
    success: req.flash("success"),
  });
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
    console.error("Error in createNotice:", error);
    // bubble up error to user
    req.flash("error", "Error creating notice. " + (error.message || ""));
    res.redirect("/notices/new");
  }
};

export const getAllNotices = async (req, res) => {
  try {
    // Fetch notices sorted newest-first
    const notices = await Notice.find()
      .sort({ date: -1 })
      .populate("owner", "nickname")
      .populate("responses.user", "nickname");

    // Ensure each notice's responses are newest-first as well
    const normalized = notices.map((n) => {
      const notice = n.toObject ? n.toObject() : n;
      if (notice.responses && Array.isArray(notice.responses)) {
        notice.responses.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return notice;
    });

    res.render("notices", { notices: normalized, user: req.user });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).send("Error loading notices");
  }
};

export const getMyNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ owner: req.user._id })
      .sort({ date: -1 })
      .populate("owner", "nickname")
      .populate("responses.user", "nickname");

    res.render("notices", { notices, user: req.user });
  } catch (error) {
    console.error("Error fetching my notices:", error);
    res.status(500).send("Error loading my notices");
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    if (notice.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own notices" });
    }

    await Notice.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting notice" });
  }
};

export const replyToNotice = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      req.flash("error", "Reply message cannot be empty");
      return res.redirect("/notices");
    }

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      req.flash("error", "Notice not found");
      return res.redirect("/notices");
    }

    notice.responses.push({
      user: req.user._id,
      message: message,
    });

    await notice.save();
    req.flash("success", "Reply posted successfully");
    res.redirect("/notices");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error posting reply");
    res.redirect("/notices");
  }
};
