import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); // pug 뷰 템플릿을 사용 명시
app.set("views", process.cwd() + "/src/views");
app.use(logger);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use( //서버에 session 적용, 
  session({
    secret: process.env.COOKIE_SECRET, //세션 암호화 할 코드
    resave: false, //session 셋팅
    saveUninitialized: false, 
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), //session 이랑 통신할 mongoDB
  })
);

app.use(flash());
app.use(localsMiddleware);

//주소로도 접근할 수 있게 허용 (static <==> dynamic)
app.use("/uploads", express.static("uploads")); 
app.use("/static", express.static("assets"));
app.use("/public", express.static("public"));

//라우터 셋팅
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
