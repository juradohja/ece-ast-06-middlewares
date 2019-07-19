import { randomBytes } from "crypto";

const crypto = require('crypto');

/**
 * User class defines a user object and the methods for password encryption
 */
export class User {
    public username: string
    public email: string
    private password: string

    protected salt: any;

    constructor(username: string, email: string, password: string, passwordHashed: boolean) {
        this.username = username
        this.email = email
        this.salt = "10" //this should be changed at some point
        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    /**
     * Creates a user object from a database query
     * @param username the username
     * @param value the body of the request (email and password)
     */
    static fromDb(username: string, value: any): User {
        console.log(value)
        return new User(username, value.email, value.password, true)
    }

    /**
     * Sets the user password
     * @param toSet  password to be hashed and stored
     */
    public setPassword(toSet: string): void {
        // Hash and set password
        this.password = this.hashPassword(toSet);
    }

    /**
     * Getter for username, used for testing
     */
    public getUsername(): string {
        return this.username
    }

    /**
     * Compare the hashes to validate passwords for login
     * @param toValidate user entered password
     */
    public validatePassword(toValidate: String): boolean {
        let hashed = this.hashPassword(toValidate);
        return this.password === hashed;
    }

    /**
     * Returns a hashed and salted  password
     * @param toHash password to be encrypted
     */
    private hashPassword(toHash: String): string {
        let hash = crypto.pbkdf2Sync(toHash, this.salt, 10000, 512, 'sha256').toString('hex');
        return hash;
    }
}

/**
 * UserHandler class contains the methods for fetching, storing and
 * deleting users from the database
 */
export class UserHandler {
    public db: any

    constructor(db: any) {
        this.db = db
    }

    /**
     * Get a user from the database
     * @param username user to search
     * @param callback return user object or error
     */
    public get(username: string, callback: (err: Error | null, result: User | null) => void) {
        const collection = this.db.collection('users')
        // Find some documents
        collection.findOne({ username: username }, function (err: any, result: User) {
            if (err) return callback(err, result)
            if (result)
                callback(err, User.fromDb(username, result))
            else
                callback(err, null)
        })
    }

    /**
     * Save a user object to the database
     * @param user user to save
     * @param callback returns a success or error
     */

    public save(user: User, callback: (err: Error | null, result: any) => void) {
        const collection = this.db.collection('users')
        // Insert some document
        collection.insertOne(
            user,
            function (err: any, result: any) {
                if (err)
                    return callback(err, result)
                callback(err, result)
            });
    }

    /**
     * Delete a user from the database
     * @param username user to be deleted
     * @param callback returns 
     */
    public delete(username: string, callback: (err: Error | null, result: User | null) => void) {
        const collection = this.db.collection('users')
        collection.deleteOne({ username: username }, function (err: any, result: any) {
            if (err) return callback(err, result)
            if (result)
                //this is creating a new user object from deleted details...should be changed
                callback(err, User.fromDb(username, result))
            else
                callback(err, null)
        })

    }
}