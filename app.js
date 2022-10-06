const express = require("express");

const app = express();
app.use(express.json());
app.use(router);

app.listen(8080, () => console.log("Server listening on port 8080"));
