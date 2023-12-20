/**
 * an input represents data incoming from the transport layer
 * it has only one responsability: validate input data,
 * therefore most of error handling after an input validation should be a translated later to a Bad Request (400)
 */
export interface Input {
  validate(): void | Promise<void>;
}
