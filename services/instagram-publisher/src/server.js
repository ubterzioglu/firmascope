import { createApp } from "./app.js";
import { getConfig } from "./config.js";

const app = createApp();
const { port } = getConfig();

app.listen(port, () => {
  console.log(`Instagram publisher service listening on port ${port}`);
});
