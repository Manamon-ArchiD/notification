import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { Client, connect } from 'ts-postgres';
import { DatabaseService } from './database/database-service';
import { PostgresService } from './database/postgres-service';
import { MockService } from './database/mock-service';
import { ServerApplication } from './app-server';
import HelloController from './controllers/hello';

export class Builder {
    private database!: DatabaseService;

    constructor(private app: Express = express()) {}

    configureExpress = () => {
        this.app.use(bodyParser.json());
        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
        return this;
    }

    configureDatabase = async (mock = false) => {
        if (mock) { 
            console.log("Using mocked database");
            this.database = new MockService();
        } else {
            console.log("Using Postgres database");
            this.database = new PostgresService(await connect({
                host: process.env.POSTGRES_HOST || 'localhost',
                port: parseInt(process.env.POSTGRES_PORT || "5432"),
                database: process.env.POSTGRES_DB || 'postgres',
                user: process.env.POSTGRES_USER || 'postgres',
                password: process.env.POSTGRES_PASSWORD || 'postgres'
            }));
        }
        return this;
    }

    configureRoutes = () => {
        this.app.get("/", (new HelloController(this.database)).handle);
        return this;
    }

    build = async (port: number, useMemoryDB = false) => {
        await this.configureDatabase(useMemoryDB);
        this.configureExpress();
        this.configureRoutes();
        return new ServerApplication(this.app, port);
    }

    
    public get App() : Express {
        return this.app
    }

    public get Database() : DatabaseService {
        return this.database;
    }

}