export class User {
    username: string;
    displayName: string;
    timezone: string;
    theme: string;
    privilege: boolean;

    constructor(username: string = "", displayName: string = "", timezone: string = "", theme: string = "light", privilege: boolean = false) {
        this.username = username;
        this.displayName = displayName;
        this.timezone = timezone;
        this.theme = theme;
        this.privilege = privilege;
    }
}