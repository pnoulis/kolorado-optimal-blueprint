import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello kolorado!",
    }),
  );
});

server.listen(process.env.URL_PORT, () => {
  console.log(`listening on port: '${process.env.URL_PORT}'`);
});
