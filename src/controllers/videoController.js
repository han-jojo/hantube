import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");

  if (!video) { //비디오 객체가 없다면 
    return res.render("404", { pageTitle: "Video not found." });
  }

  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  const { id } = req.params;
  const { title, description, hashtags } = req.body;

  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  const targetVideo = await Video.findById(id);

  if (String(targetVideo.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const maxFileSizeMB = 104857599;

  if (video.size >= maxFileSizeMB) {
    return res.status(400).render("upload", {
      pageTitle: "비디오 업로드",
      errorMessage: "영상 용량은 100MB 미만이어야 합니다.",
    });
  }

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(_id);

    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    console.log("ERROR: ", error);

    return res.status(400).render("upload", {
      pageTitle: "비디오 업로드",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    }).populate("owner");
  }

  console.log("videos: ", videos);

  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;

  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user }, //세션에 저장된 유저 정보 객체
    body: { text }, //댓글 내용
    params: { id }, //비디오 ID
  } = req;

  const video = await Video.findById(id);
  const commentUser = await User.findById(user._id);

  if (!video) { //비디오를 못찾았다면
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text: text,
    name: user.name,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();

  commentUser.comments.push(comment._id);
  commentUser.save();

  return res.status(201).json({ newCommentId: comment._id, name: user.name });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    body: { videoId },
    session: { user },
  } = req;

  const video = await Video.findById(videoId);
  const commentUser = await User.findById(user._id);

  if (commentUser.comments.indexOf(id) < 0) {
    return res.sendStatus(403);
  }

  commentUser.comments.splice(commentUser.comments.indexOf(id), 1);
  video.comments.splice(video.comments.indexOf(id), 1);

  await video.save();
  await commentUser.save();
  await Comment.findByIdAndDelete(id);

  return res.sendStatus(201);
};

export const getBoard = async (req, res) => {
  return res.render("board", { pageTitle: "한튜브 게시판" });
};
