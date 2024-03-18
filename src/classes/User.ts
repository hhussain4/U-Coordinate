export class User {
    private username: string;
    private displayName: string;
    private theme: string;
    private timezone: string;
    private privilege: boolean;

    constructor(username:string, displayName: string, theme: string, timezone:string, privilege:boolean = false) {
        this.username = username;
        this.displayName = displayName;
        this.theme = theme;
        this.timezone = timezone;
        this.privilege = privilege;
    }
    
    toJSON() {
        return {
            username: this.username,
            displayName: this.displayName,
            theme: this.theme,
            timezone: this.timezone,
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

    getTheme(): string {
        return this.theme;
    }

    getTimezone(): string {
        return this.timezone;
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

    setTheme(theme: string) {
        this.theme = theme;
    }

    setTimezone(timezone: string) {
        this.timezone = timezone;
    }

    setPrivilege(privilege: boolean) {
        this.privilege = privilege;
    }
}

module.exports = User;