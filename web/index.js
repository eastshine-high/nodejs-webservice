const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("redis");

const app = express();

let client; // 전역 변수로 설정

async function run() {
  client = createClient({ url: 'redis://127.0.0.1:6379' });

  client.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
}

run();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post('/', (request, response)=>{
  console.log(request.body.key);
  client.lPush('list',request.body.id);
	return response.json(request.body.key); // or response.send(request.body);
});

const PORT = 5000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

// node file 1
// 1. post push 
// 2. get list

// new node file
// 3. db && redis connect
// 4. select redis and insert db(바뀐 부분을 무한루프를 돌면서 sync)
