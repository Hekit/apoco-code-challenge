import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { findOneOrThrow } from './utils';

interface TestDoc {
  id: number;
  name: string;
}

describe('findOneOrThrow', () => {
  let fakeModel: Partial<Model<TestDoc>>;

  beforeEach(() => {
    fakeModel = {
      findOne: jest.fn(),
    };
  });

  it('should return the document if found', async () => {
    const expectedDoc: TestDoc = { id: 1, name: 'Test' };

    // Mock findOne to return an object with exec that resolves to expectedDoc
    (fakeModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(expectedDoc),
    });

    // Call the utility function
    const result = await findOneOrThrow(
      fakeModel as Model<TestDoc>,
      { id: 1 },
      'Not Found',
    );

    expect(result).toEqual(expectedDoc);
    expect(fakeModel.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if document is not found', async () => {
    // Mock findOne to return an object with exec that resolves to null
    (fakeModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      findOneOrThrow(
        fakeModel as Model<TestDoc>,
        { id: 1 },
        'Document not found',
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
