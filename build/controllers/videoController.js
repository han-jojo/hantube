"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComment = exports.registerView = exports.search = exports.deleteVideo = exports.postUpload = exports.getUpload = exports.postEdit = exports.getEdit = exports.watch = exports.home = void 0;

var _Video = _interopRequireDefault(require("../models/Video"));

var _Comment = _interopRequireDefault(require("../models/Comment"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var home = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var videos;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Video["default"].find({}).sort({
              createdAt: "desc"
            }).populate("owner");

          case 2:
            videos = _context.sent;
            return _context.abrupt("return", res.render("home", {
              pageTitle: "Home",
              videos: videos
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function home(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.home = home;

var watch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var id, video;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.next = 3;
            return _Video["default"].findById(id).populate("owner").populate("comments");

          case 3:
            video = _context2.sent;

            if (video) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.render("404", {
              pageTitle: "Video not found."
            }));

          case 6:
            return _context2.abrupt("return", res.render("watch", {
              pageTitle: video.title,
              video: video
            }));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function watch(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.watch = watch;

var getEdit = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var id, _id, video;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _id = req.session.user._id;
            _context3.next = 4;
            return _Video["default"].findById(id);

          case 4:
            video = _context3.sent;

            if (video) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 7:
            if (!(String(video.owner) !== String(_id))) {
              _context3.next = 10;
              break;
            }

            req.flash("error", "Not authorized");
            return _context3.abrupt("return", res.status(403).redirect("/"));

          case 10:
            return _context3.abrupt("return", res.render("edit", {
              pageTitle: "Edit: ".concat(video.title),
              video: video
            }));

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getEdit(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _id, id, _req$body, title, description, hashtags, video;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _id = req.session.user._id;
            id = req.params.id;
            _req$body = req.body, title = _req$body.title, description = _req$body.description, hashtags = _req$body.hashtags;
            _context4.next = 5;
            return _Video["default"].exists({
              _id: id
            });

          case 5:
            video = _context4.sent;

            if (video) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 8:
            if (!(String(video.owner) !== String(_id))) {
              _context4.next = 11;
              break;
            }

            req.flash("error", "You are not the the owner of the video.");
            return _context4.abrupt("return", res.status(403).redirect("/"));

          case 11:
            _context4.next = 13;
            return _Video["default"].findByIdAndUpdate(id, {
              title: title,
              description: description,
              hashtags: _Video["default"].formatHashtags(hashtags)
            });

          case 13:
            req.flash("success", "Changes saved.");
            return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postEdit(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload Video"
  });
};

exports.getUpload = getUpload;

var postUpload = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _id, _req$files, video, thumb, _req$body2, title, description, hashtags, isHeroku, newVideo, user;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _id = req.session.user._id;
            _req$files = req.files, video = _req$files.video, thumb = _req$files.thumb;
            _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags;
            isHeroku = process.env.NODE_ENV === "production";
            _context5.prev = 4;
            _context5.next = 7;
            return _Video["default"].create({
              title: title,
              description: description,
              fileUrl: isHeroku ? video[0].location : video[0].path,
              thumbUrl: isHeroku ? thumb[0].location : video[0].path,
              owner: _id,
              hashtags: _Video["default"].formatHashtags(hashtags)
            });

          case 7:
            newVideo = _context5.sent;
            _context5.next = 10;
            return _User["default"].findById(_id);

          case 10:
            user = _context5.sent;
            user.videos.push(newVideo._id);
            user.save();
            return _context5.abrupt("return", res.redirect("/"));

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](4);
            console.log(_context5.t0);
            return _context5.abrupt("return", res.status(400).render("upload", {
              pageTitle: "Upload Video",
              errorMessage: _context5.t0._message
            }));

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 16]]);
  }));

  return function postUpload(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postUpload = postUpload;

var deleteVideo = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var id, _id, video;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _id = req.session.user._id;
            _context6.next = 4;
            return _Video["default"].findById(id);

          case 4:
            video = _context6.sent;

            if (video) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 7:
            if (!(String(video.owner) !== String(_id))) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", res.status(403).redirect("/"));

          case 9:
            _context6.next = 11;
            return _Video["default"].findByIdAndDelete(id);

          case 11:
            return _context6.abrupt("return", res.redirect("/"));

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function deleteVideo(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteVideo = deleteVideo;

var search = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var keyword, videos;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            keyword = req.query.keyword;
            videos = [];

            if (!keyword) {
              _context7.next = 6;
              break;
            }

            _context7.next = 5;
            return _Video["default"].find({
              title: {
                $regex: new RegExp("".concat(keyword, "$"), "i")
              }
            }).populate("owner");

          case 5:
            videos = _context7.sent;

          case 6:
            return _context7.abrupt("return", res.render("search", {
              pageTitle: "Search",
              videos: videos
            }));

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function search(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.search = search;

var registerView = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var id, video;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            _context8.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context8.sent;

            if (video) {
              _context8.next = 6;
              break;
            }

            return _context8.abrupt("return", res.sendStatus(404));

          case 6:
            video.meta.views = video.meta.views + 1;
            _context8.next = 9;
            return video.save();

          case 9:
            return _context8.abrupt("return", res.sendStatus(200));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function registerView(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.registerView = registerView;

var createComment = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var user, text, id, video, comment;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            user = req.session.user, text = req.body.text, id = req.params.id;
            _context9.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context9.sent;

            if (video) {
              _context9.next = 6;
              break;
            }

            return _context9.abrupt("return", res.sendStatus(404));

          case 6:
            _context9.next = 8;
            return _Comment["default"].create({
              text: text,
              owner: user._id,
              video: id
            });

          case 8:
            comment = _context9.sent;
            video.comments.push(comment._id);
            video.save();
            return _context9.abrupt("return", res.status(201).json({
              newCommentId: comment._id
            }));

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function createComment(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.createComment = createComment;