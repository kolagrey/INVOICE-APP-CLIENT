export class Settings {
  constructor(settings) {
    this.id = settings.id;
    this.companyName = settings.companyName;
    this.vat = settings.vat;
    this.address = settings.address;
    this.city = settings.city;
    this.state = settings.state;
    this.country = settings.country;
    this.invoiceNote = settings.invoiceNote;
    this.receiptNote = settings.receiptNote;
  }

  sanitize() {
    if (!this.id) throw new Error('id property is required');
    if (!this.companyName) throw new Error('companyName property is required');
    if (!this.vat) throw new Error('vat property is required');
    if (!this.address) throw new Error('address property is required');
    if (!this.city) throw new Error('city property is required');
    if (!this.state) throw new Error('state property is required');
    if (!this.country) throw new Error('country property is required');
    return this;
  }

  get credentials() {
    return {
      id: this.id,
      companyName: this.companyName,
      vat: this.vat,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      invoiceNote: this.invoiceNote,
      receiptNote: this.receiptNote
    };
  }
}
