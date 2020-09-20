export class UserProfile {
  constructor({
    id,
    staffId,
    firstName,
    lastName,
    email,
    telephone = '',
    role = ''
  }) {
    this.id = id;
    this.staffId = staffId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
    this.role = role;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.staffId) throw new Error('staffId property is required');
    if (!this.firstName) throw new Error('firstName property is required');
    if (!this.lastName) throw new Error('lastName property is required');
    if (!this.email) throw new Error('email property is required');
    if (!this.role) throw new Error('role is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      staffId: this.staffId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      telephone: this.telephone,
      role: this.role
    };
  }
}

export class UserAccount {
  constructor({ firstName, email, password, role = '' }) {
    this.firstName = firstName;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  sanitize() {
    if (!this.firstName) throw new Error('firstName property is required');
    if (!this.email) throw new Error('email property is required');
    if (!this.password) throw new Error('password property is required');
    if (!this.role) throw new Error('role is required');
    return this;
  }

  get credentials() {
    return {
      firstName: this.firstName,
      email: this.email,
      password: this.password,
      role: this.role
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
