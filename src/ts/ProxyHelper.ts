export class ProxyHelper {
    static formatVar<T>(name: string, value: T): string {
        const formattedValue = typeof value === "string" ? `"${value}"` : value;
        return `${name}:\t${formattedValue}\r\n`;
    }
}