"use strict";

class User {    
    constructor(name, email, password, role, sex, image) {
        this.uid = User.generateUid(10);
        this.name = name
        this.email = email
        this.role = role
        this.sex = sex
        this.password = password
        this.image = image != undefined ? image : User.generateImgUrl(this.uid, this.sex);
    }

    get uid() {
        return this._uid;
    }
    set uid(val) {
        this._uid = val;
    }

    get name() {
        return this._name;
    }
    set name(val) {
        this._name = val;
    }

    get email() {
        return this._email;
    }
    set email(val) {
        this._email = val;
    }

    get password() {
        return this._password;
    }
    set password(val) {
        this._password = val;
    }

    get role() {
        return this._role;
    }
    set role(val) {
        this._role = val;
    }

    get sex() {
        return this._sex;
    }

    set sex(val) {
        this._sex = val;
    }

    get image() {
        return this._image;
    }
    set image(val) {
        this._image = val;
    }

    static generateUser(user) {
        let firstName = user.firstName != undefined ? user.firstName : user._firstName;
        let lastName = user.lastName != undefined ? user.lastName : user._lastName;
        let email = user.email != undefined ? user.email : user._email;
        let password = user.password != undefined ? user.password : user._password;
        let date = user.date != undefined ? user.date : user._date;
        let sex = user.sex != undefined ? user.sex : user._sex;
        let image = user.image != undefined ? user.image : user._image;

        return new User(firstName, lastName, email, password, date, sex, image);
    }
    
    static generateUid(len) {
        let uid = '';
        for (let i = 0; i < len; i++) {
            uid += Math.trunc(Math.random() * 10);
        }
        return uid;
    }
    
    static generateImgUrl(uid, sex) {
        if (sex == 'H') {
            return 'https://randomuser.me/api/portraits/men/' + (uid % 100) + '.jpg';
        } else {
            return 'https://randomuser.me/api/portraits/women/' + (uid % 100) + '.jpg';
        }
    }
}
