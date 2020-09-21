export class Avatar {
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
