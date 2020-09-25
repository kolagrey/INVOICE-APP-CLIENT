export class Settings {
  constructor(settings) {
    this.id = settings.id;
    this.companyName = settings.companyName;
    this.vat = settings.vat;
    this.telephone = settings.telephone;
    this.email = settings.email;
    this.address = settings.address;
    this.city = settings.city;
    this.state = settings.state;
    this.country = settings.country;
    this.serviceChargeActiveDiscount = settings.serviceChargeActiveDiscount;
    this.serviceChargeInActiveDiscount = settings.serviceChargeInActiveDiscount;
    this.invoiceNote = settings.invoiceNote;
    this.receiptNote = settings.receiptNote;
    this.paymentAccount = settings.paymentAccount;
    this.baseServiceCharge = settings.baseServiceCharge;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.companyName) throw new Error('companyName property is required');
    if (!this.vat) throw new Error('vat property is required');
    if (!this.telephone) throw new Error('telephone property is required');
    if (!this.email) throw new Error('email property is required');
    if (!this.address) throw new Error('address property is required');
    if (!this.city) throw new Error('city property is required');
    if (!this.state) throw new Error('state property is required');
    if (!this.country) throw new Error('country property is required');
    if (!this.baseServiceCharge)
      throw new Error('base service charge property is required');
    if (!this.paymentAccount)
      throw new Error('payment account property is required');
    if (!this.serviceChargeActiveDiscount)
      throw new Error('active discount property is required');
    if (!this.serviceChargeInActiveDiscount)
      throw new Error('in active discount property is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      companyName: this.companyName,
      vat: this.vat,
      email: this.email,
      telephone: this.telephone,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      invoiceNote: this.invoiceNote,
      receiptNote: this.receiptNote,
      paymentAccount: this.paymentAccount,
      baseServiceCharge: this.baseServiceCharge,
      serviceChargeActiveDiscount: this.serviceChargeActiveDiscount,
      serviceChargeInActiveDiscount: this.serviceChargeInActiveDiscount
    };
  }
}
