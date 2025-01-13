import * as signalR from "@microsoft/signalr";
import {HttpTransportType, LogLevel} from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl("https://localhost:7278/componentHub", {
                withCredentials: true,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
        })
            .build();
    }

    async startConnection(): Promise<void> {
        try {
            if (this.connection.state === "Connected") {
                console.log("SignalR is already connected.");
                return;
            }

            if (this.connection.state === "Connecting") {
                console.log("SignalR is already connecting. Waiting...");
                // Wait for the current connecting process to complete
                await this.waitForConnection();
                return;
            }

            await this.connection.start();
            console.log("SignalR connection established.");
        } catch (err) {
            console.error("Error establishing SignalR connection:", err);

            // Retry after a delay if the connection is still disconnected
            if (this.connection.state === "Disconnected") {
                setTimeout(() => this.startConnection(), 5000); // Retry in 5 seconds
            }
        }
    }

// Utility to wait for an ongoing connection process to complete
    private async waitForConnection(): Promise<void> {
        while (this.connection.state === "Connecting") {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
        }
    }

    onReceiveIdList(callback: (idList: string[]) => void): void {
        this.connection.on("ReceiveIdList", callback);
    }

    onReceiveComponentImage(callback: (id: string, image: string) => void): void {
        this.connection.on("ReceiveComponentImage", callback);
    }

    onReceiveComponentInfo(callback: (id: string, info: Record<string, string>) => void): void {
        this.connection.on("ReceiveComponentInfo", callback);
    }

    onReceiveError(callback: (error: string) => void): void {
        this.connection.on("ReceiveError", callback);
    }

    async sendIdList(): Promise<void> {
        await this.connection.invoke("SendIdList");
    }

    async sendComponentImage(id: string): Promise<void> {
        await this.connection.invoke("SendComponentImage", id);
    }

    async sendComponentInfo(id: string): Promise<void> {
        await this.connection.invoke("SendComponentInfo", id);
    }

    stopConnection(): void {
        this.connection.stop();
    }
}

export const signalRService = new SignalRService();