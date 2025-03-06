import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Finds a document using the provided Mongoose model and query.
 * If the document is not found, throws a NotFoundException with the given message.
 *
 * @template T - The type of the document.
 * @param model - The Mongoose model to query.
 * @param query - A partial query object to find the document.
 * @param notFoundMessage - The message to use if the document is not found.
 * @returns A promise that resolves with the found document.
 * @throws NotFoundException if no document is found.
 */
export async function findOneOrThrow<T>(
  model: Model<T>,
  query: Partial<T>,
  notFoundMessage: string,
): Promise<T> {
  const doc = await model.findOne(query).exec();
  if (!doc) {
    throw new NotFoundException(notFoundMessage);
  }
  return doc;
}
