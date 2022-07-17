import mongoose from "mongoose"; //Mongo DB와 통신을 해주는 라이브러리

mongoose.connect(process.env.DB_URL, {
  //MongoDB 연결
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection; //DB 객체 연결

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.once("open", handleOpen);
db.on("error", handleError);
