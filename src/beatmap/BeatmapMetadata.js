export class BeatmapMetadata {
  /**
   * @param {object} metadata
   * @param {string} metadata.title
   * @param {string} metadata.artist
   * @param {string} metadata.audioURI
   * @param {string} metadata.backgroundURI
   */
  constructor({ title, artist, audioURI, backgroundURI }) {
    /**
     * @type {?string}
     */
    this._title = title;

    /**
     * @type {?string}
     */
    this._artist = artist;

    /**
     * @type {?string}
     */
    this._audioURI = audioURI;

    /**
     * @type {?string}
     */
    this._backgroundURI = backgroundURI;
  }

  get title() {
    return this._title;
  }

  get artist() {
    return this._artist;
  }

  get audioURI() {
    return this._audioURI;
  }

  get backgroundURI() {
    return this._backgroundURI;
  }
}
