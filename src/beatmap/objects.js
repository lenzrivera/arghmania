/**
 * @abstract
 */
export class TimedObject {
  constructor(atTime) {
    this.atTime = atTime;
  }
}

/**
 * @abstract
 */
export class MovingObject extends TimedObject {
  constructor(atTime, velocity) {
    super(atTime);

    this.velocity = velocity;
  }
}
