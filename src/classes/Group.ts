import { User } from "./User";

export class Group {
    private name: string;
    private members: User[];
    private admins: User[];

    constructor(name:string, members?: User[], admins?: User[]) {
        this.name = name;
        this.members = members || [];
        this.admins = admins || [];
    }

    addMember(member: User) {
        if(!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if(this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    addAdmin(admin: User) {
        if(!this.admins.includes(admin)) this.admins.push(admin);
        if (!this.members.includes(admin)) this.members.push(admin);
    }

    removeAdmin(admin: User) {
        if(this.admins.includes(admin)) this.admins.splice(this.admins.indexOf(admin), 1);
    }

    // getters
    getName() {
        return this.name;
    }

    getMembers() {
        return this.members;
    }

    getAdmins() {
        return this.admins;
    }

    // setters
    setName(name:string) {
        this.name = name;
    }

    setMembers(members: User[]) {
        this.members = members;
    }

    setAdmins(admins: User[]) {
        this.admins = admins;
    }

}

module.exports = Group;