const crypto = require('crypto');

export class User {
    public username: string
    public email: string
    private password: string = ""

    protected salt: any;

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username
        this.email = email
        this.salt = crypto.randomBytes(16).toString('hex');
        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    static fromDb(username: string, value: any): User {
        console.log(value)
        return new User(username, value.email, value.password)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        this.password = this.hashPassword(toSet);
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        let hashed = this.hashPassword(toValidate);
        console.log("validating pass");
        console.log(hashed.localeCompare(this.password));
        console.log(this);
        return this.password === hashed;
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
        collection.findOne({username: username}, function (err: any, result: any) {
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