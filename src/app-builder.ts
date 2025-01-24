import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { connect } from 'ts-postgres';
import { DatabaseService } from './database/database-service';
import { PostgresService } from './database/postgres-service';
import { MockService } from './database/mock-service';
import { ServerApplication } from './app-server';
import amqp from 'amqplib';
import HelloController from './controllers/hello';
import EventService from './event/event-service';
import RabbitService from './event/rabbit-service';
import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

export class Builder {
    private database!: DatabaseService;
    private events!: EventService;

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
            const getDatabase = async () => {
                return new PostgresService(await connect({
                    host: process.env.POSTGRES_HOST || 'localhost',
                    port: parseInt(process.env.POSTGRES_PORT || "5432"),
                    database: process.env.POSTGRES_DB || 'postgres',
                    user: process.env.POSTGRES_USER || 'postgres',
                    password: process.env.POSTGRES_PASSWORD || 'postgres'
                }));
            }
            while (this.database == undefined){
                try {
                    this.database = await getDatabase();
                    console.log("Database init!");
                } catch (e) {
                    console.error(e);
                    console.error("Database init failed, retrying in 5 seconds");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        }
        return this;
    }

    configureEvents = async (mock = false ) => {
        if(mock) {

        }else{
            console.log("Using RabbitMQTT events stream");
            const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
            const QUEUE_NAME = 'events_queue';

            const getStream = async () => {
                const connection = await amqp.connect(RABBITMQ_URL);
                const channel = await connection.createChannel();

                await channel.assertQueue(QUEUE_NAME, {durable: true});

                return new RabbitService(QUEUE_NAME, channel);
            }
            while (this.events == undefined){
                try {
                    this.events = await getStream();
                    console.log("Event stream init!");
                } catch (e) {
                    console.error(e);
                    console.error("Event stream failed, retrying in 5 seconds");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        }
    }

    configureRoutes = () => {
        this.app.get("/", (new HelloController(this.database, this.events)).handle);
        return this;
    }

    configureSwagger = () => {
        const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    build = async (port: number, mock = false) => {
        await this.configureDatabase(mock);
        await this.configureEvents(mock);
        this.configureExpress();
        this.configureRoutes();
        this.configureSwagger();
        return new ServerApplication(this.app, port);
    }

    
    public get App() : Express {
        return this.app
    }

    public get Database() : DatabaseService {
        return this.database;
    }

    public get Events() : EventService {
        return this.events;
    }

}