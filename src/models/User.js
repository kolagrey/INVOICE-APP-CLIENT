export class UserProfile {
  constructor({
    id,
    firstName,
    lastName,
    email,
    telephone = ''
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.firstName) throw new Error('firstName property is required');
    if (!this.lastName) throw new Error('lastName property is required');
    if (!this.email) throw new Error('email property is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      telephone: this.telephone
    };
  }
}

export class UserAvatar {
  constructor({ id, file, fileName }) {
    this.id = id;
    this.file = file;
    this.fileName = fileName;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.file) throw new Error('file property is required');
    if (!this.fileName) throw new Error('fileName property is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      file: this.file,
      fileName: this.fileName
    };
  }
}

export class UserAuth {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  sanitize() {
    if (!this.email) throw new Error('email property is required');
    if (!this.password) throw new Error('password property is required');
    return this;
  }

  get credentials() {
    return {
      email: this.email,
      password: this.password
    };
  }
}
