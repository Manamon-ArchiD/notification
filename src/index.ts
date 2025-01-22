import { Builder } from "./app-builder";

const init = async () => {
    console.log("===== Server =====");
    const port = parseInt(process.env.PORT || "3000");
    const builder = new Builder();
    const serverApp = await builder.build(port);
    serverApp.start();
};

init();