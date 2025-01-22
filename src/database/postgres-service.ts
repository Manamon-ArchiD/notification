import { Client } from "ts-postgres";

export class PostgresService {
    constructor(private database: Client) {}
}