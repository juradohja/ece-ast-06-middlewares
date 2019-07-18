import { randomBytes } from "crypto";

const crypto = require('crypto');

export class User {
    public username: string
    public email: string
    private password: string

    protected salt: any;

    constructor(username: string, email: string, password: string, passwordHashed: boolean) {
        this.username = username
        this.email = email
        this.salt = "10"
        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    

    static fromDb(username: string, value: any): User {
        console.log(value)
        return new User(username, value.email, value.password, true)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        //this.password = this.hashPassword(toSet);
        this.password = toSet;
    }

    public getPassword(): string {
        return this.password
    }

    public getUsername(): string {
        return this.username
    }

    public validatePassword(toValidate: String): boolean {
        let hashed = this.hashPassword(toValidate);
        //return this.password === hashed;
        return this.password === toValidate;
    }

    private hashPassword(toHash: String): string {
        let hash = crypto.pbkdf2Sync(toHash, this.salt, 10000, 512, 'sha256').toString('hex');
        return hash;
    }
}

export class UserHandler {
    public db: any

    constructor(db: any) {
        this.db = db
    }

    public get(username: string, callback: (err: Error | null, result: User | null) => void) {
        const collection = this.db.collection('users')
        // Find some documents
        collection.findOne({username: username}, function (err: any, result: User) {
            if (err) return callback(err, result)
            if (result)
                callback(err, User.fromDb(username, result))
            else
                callback(err, null)
        })
    }

    public save(user: User, callback: (err: Error | null, result: any) => void) {
        const collection = this.db.collection('users')
        // Insert some document
        collection.insertOne(
            user,
            function(err: any, result: any) {
                if(err)
                    return callback(err, result)
                console.log("User inserted into the collection")
                callback(err, result)
            });
    }

    public delete(username: string, callback: (err: Error | null, result: User | null) => void){
        const collection = this.db.collection('users')
        // Find some documents
        collection.deleteOne({username: username}, function (err: any, result: any) {
            if (err) return callback(err, result)
            if (result)
                callback(err, User.fromDb(username, result))
            else
                callback(err, null)
        })

    }
}