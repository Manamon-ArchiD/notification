import { Express } from "express"

export class ServerApplication {
    constructor(private app: Express, private port: number) { }

    start = () => {
        this.app.listen(this.port, () => {
            console.log(`Express is listening at port ${this.port}`);
        })
    }
}