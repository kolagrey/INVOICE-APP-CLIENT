export class UserProfile {
  constructor({ id, firstName, lastName, email, telephone = '', role = '' }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
    this.role = role;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.firstName) throw new Error('firstName property is required');
    if (!this.lastName) throw new Error('lastName property is required');
    if (!this.email) throw new Error('email property is required');
    if (!this.role) throw new Error('role is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      telephone: this.telephone,
      role: this.role
    };
  }
}

export class InvoiceCustomer {
  constructor({
    customerFirstName,
    customerLastName,
    customerEmail,
    customerCompanyName,
    customerAddress,
    customerCity,
    customerState,
    customerCountry,
    customerTelephone
  }) {
    this.customerFirstName = customerFirstName || '';
    this.customerLastName = customerLastName || '';
    this.customerEmail = customerEmail || '';
    this.customerCompanyName = customerCompanyName || '';
    this.customerAddress = customerAddress || '';
    this.customerCity = customerCity || '';
    this.customerState = customerState || '';
    this.customerCountry = customerCountry || '';
    this.customerTelephone = customerTelephone || '';
  }

  get credentials() {
    return {
      customerFirstName: this.customerFirstName,
      customerLastName: this.customerLastName,
      customerEmail: this.customerEmail,
      customerCompanyName: this.customerCompanyName,
      customerAddress: this.customerAddress,
      customerCity: this.customerCity,
      customerState: this.customerState,
      customerCountry: this.customerCountry,
      customerTelephone: this.customerTelephone
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
