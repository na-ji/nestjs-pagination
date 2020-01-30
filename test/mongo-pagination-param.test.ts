import { BadRequestException } from '@nestjs/common';
import { expect } from 'chai';
import { Request } from 'express';
import { MongoPaginationParamDecorator } from '../src';
import { MongoQuery } from '../src/mongo-pagination-param.decorator';
import { getParamDecoratorFactory } from './helpers';

describe('Tests related to the MongoPagination ParamDecorator', () => {
  let factory: (_data: {}, req: Request) => MongoQuery;

  before(() => {
    factory = getParamDecoratorFactory(MongoPaginationParamDecorator);
  });

  it('MPPD01 - should successfully return default value on empty query', () => {
    const req: {} = { query: {} };

    const result: MongoQuery = factory({}, req as Request);

    expect(result).to.deep.equal({
      filter: {},
      limit: 10,
      skip: 0,
      sort: [],
    });
  });

  it('MPPD02 - should successfully handle another page', () => {
    const req: {} = { query: { page: '2', per_page: '20' } };

    const result: MongoQuery = factory({}, req as Request);

    expect(result).to.deep.equal({
      filter: {},
      limit: 20,
      skip: 20,
      sort: [],
    });
  });

  it('MPPD03 - should successfully parse filters', () => {
    const req: {} = { query: { page: '1', per_page: '20', filter: '{"key": "value"}', sort: '[]' } };

    const result: MongoQuery = factory({}, req as Request);

    expect(result).to.deep.equal({
      filter: { key: 'value' },
      limit: 20,
      skip: 0,
      sort: [],
    });
  });

  it('MPPD04 - should throw bad request exception on parse error', () => {
    const req: {} = { query: { filter: '{invalidJson}' } };

    expect(() => factory({}, req as Request)).to.throw(BadRequestException);
  });
});