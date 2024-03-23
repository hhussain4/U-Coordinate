import { User } from "./User";

export class Group {
    private name: string;
    private members: User[];
    private admins: User[];

    constructor(name:string, admins?: User[], members?: User[]) {
        this.name = name;
        this.admins = admins || [];
        this.members = members || [];
    }

    addAdmin(admin: User) {
        if(!this.admins.includes(admin)) this.admins.push(admin);
        if (this.members.includes(admin)) this.removeMember(admin);
    }

    removeAdmin(admin: User) {
        if(this.admins.includes(admin)) this.admins.splice(this.admins.indexOf(admin), 1);
    }

    addMember(member: User) {
        if(!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if(this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    // getters
    getName() {
        return this.name;
    }

    getAdmins() {
        return this.admins;
    }
    
    getMembers() {
        return this.members;
    }

    // setters
    setName(name:string) {
        this.name = name;
    }

    setAdmins(admins: User[]) {
        this.admins = admins;
    }

    setMembers(members: User[]) {
        this.members = members;
    }

}