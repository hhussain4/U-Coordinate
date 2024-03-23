export class User {
    private username: string;
    private displayName: string;
    private timezone: string;
    private theme: string;
    private privilege: boolean;

    constructor(username:string, displayName: string, timezone:string = "", theme: string = "light", privilege:boolean = false) {
        this.username = username;
        this.displayName = displayName;
        this.timezone = timezone;
        this.theme = theme;
        this.privilege = privilege;
    }
    
    toJSON() {
        return {
            username: this.username,
            displayName: this.displayName,
            timezone: this.timezone,
            theme: this.theme,
            privilege: this.privilege
        }
    }

    // getters
    getUsername(): string {
        return this.username;
    }

    getDisplayName(): string {
        return this.displayName;
    }

    getTimezone(): string {
        return this.timezone;
    }

    getTheme(): string {
        return this.theme;
    }

    getPrivilege(): boolean {
        return this.privilege;
    }

    // setters
    setUsername(username: string) {
        this.username = username;
    }

    setDisplayName(displayName: string) {
        this.displayName = displayName;
    }

    setTimezone(timezone: string) {
        this.timezone = timezone;
    }

    setTheme(theme: string) {
        this.theme = theme;
    }

    setPrivilege(privilege: boolean) {
        this.privilege = privilege;
    }
}