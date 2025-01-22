import { Client } from "ts-postgres";
import { DatabaseService } from "./database-service";

export class PostgresService implements DatabaseService {
    constructor(private database: Client) {}
}