import path from "node:path";
import fs from "node:fs/promises";
import { Readable } from "node:stream";
import ftp from "basic-ftp";

const defaults = {
  directory: "",
  verbose: true,
};

export const LocalStore = class {
  constructor(options = {}) {
    this.id = "local";
    this.name = "Local store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { directory } = this.options;

    return {
      name: `${directory} directory on local machine`,
      uid: `file://${directory}`,
    };
  }

  async client() {
    const { host, user, password, port, verbose } = this.options;
    const client = new ftp.Client();
    client.ftp.verbose = verbose;
    await client.access({ host, user, password, port, secure: true });
    return client;
  }

  /**
   * Create readable stream
   *
   * @private
   * @param {string} content File content
   * @returns {string} Readable stream
   */
  #createReadableStream(content) {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(content, "utf-8");
    readableStream.push(null); // eslint-disable-line unicorn/no-array-push-push
    return readableStream;
  }

  /**
   * Get absolute file path
   *
   * @private
   * @param {string} filePath Path to file
   * @returns {string} Absolute file path
   */
  #getAbsolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file
   *
   * @param {string} filePath Path to file
   * @param {string} content File content
   * @returns {true} Successful result
   */
  async createFile(filePath, content) {
    try {
      // const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);
      const dirname = path.dirname(absolutePath);

      await fs.mkdir(dirname).catch((err) => {
        if (err && err.code === "EEXIST") {
          return;
        }
        throw err;
      });
      await fs.writeFile(absolutePath, content);
    } catch (error) {
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Update file
   *
   * @param {string} filePath Path to file
   * @param {string} content File content
   * @returns {true} Successful result
   */
  async updateFile(filePath, content) {
    try {
      // const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);

      await fs.writeFile(absolutePath, content);
    } catch (error) {
      throw new Error(error);
    }

    return true;
  }

  /**
   * Delete file
   *
   * @param {string} filePath Path to file
   * @returns {true} Successful result
   */
  async deleteFile(filePath) {
    const absolutePath = this.#getAbsolutePath(filePath);

    try {
      await fs.rm(absolutePath);
    } catch (error) {
      throw new Error(error);
    }

    return true;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default LocalStore;
