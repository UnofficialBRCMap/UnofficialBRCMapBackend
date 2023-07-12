import { HttpStatus } from '@nestjs/common';
import { string } from 'pactum-matchers';
import * as pactum from 'pactum';

import { CampDto } from '../../src/camp/dto';

const campDto: CampDto = {
  uid: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  year: 2021,
  name: 'My first camp',
  description: 'Great Place',
  website: 'http://www.camp.com',
};

describe('Camps', () => {
  it('should create camp', async () => {
    await pactum
      .spec('createCamp', 'user1')
      .expectJsonMatchStrict({
        id: string('1'),
        name: string(),
        description: string(),
        website: string(),
      })
      .expectStatus(HttpStatus.CREATED);
  });

  it('should throw error when creating a second camp', async () => {
    await pactum
      .spec()
      .post('/v1/camps')
      .withHeaders({
        Authorization: `Bearer $S{accessToken-user1}`,
      })
      .withBody(campDto)
      .expectJsonMatch({
        statusCode: HttpStatus.CONFLICT,
        message: string(),
      })
      .expectStatus(HttpStatus.CONFLICT);
  });

  it('should get camps', async () => {
    await pactum
      .spec()
      .get('/v1/camps')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user1}',
      })
      .expectJsonMatchStrict([
        {
          id: string('1'),
          name: string(),
          description: string(),
          website: string(),
        },
      ])
      .expectStatus(HttpStatus.OK);
  });

  it('should get camp by id', async () => {
    await pactum
      .spec()
      .get('/v1/camps/1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user1}',
      })
      .expectJsonMatchStrict({
        id: '1',
        name: string(),
        description: string(),
        website: string(),
      })
      .expectStatus(HttpStatus.OK);
  });

  it('should throw error when editing if not manager', async () => {
    await pactum
      .spec()
      .patch('/v1/camps/1')
      .withPathParams('id', '1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user2}',
      })
      .withBody(campDto)
      .expectBody({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access to resources denied',
        error: 'Forbidden',
      })
      .expectStatus(HttpStatus.FORBIDDEN);
  });

  it('should edit camp', async () => {
    await pactum
      .spec()
      .patch('/v1/camps/1')
      .withPathParams('id', '1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user1}',
      })
      .withBody(campDto)
      .expectJsonMatchStrict({
        id: '1',
        name: campDto.name,
        description: campDto.description,
        website: campDto.website,
      })
      .expectStatus(HttpStatus.OK);
  });

  it('should throw error when deleting if not manager', async () => {
    await pactum
      .spec()
      .delete('/v1/camps/1')
      .withPathParams('id', '1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user2}',
      })
      .expectBody({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Access to resources denied',
        error: 'Forbidden',
      })
      .expectStatus(HttpStatus.FORBIDDEN);
  });

  it('should delete camp', async () => {
    await pactum
      .spec('deleteCamp', { campId: '1', user: 'user1' })
      .expectStatus(HttpStatus.NO_CONTENT);
  });

  it('should throw error when getting nonexistent camp', async () => {
    await pactum
      .spec()
      .get('/v1/camps/1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user1}',
      })
      .expectBody({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Camp not Found',
        error: 'Not Found',
      })
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('should throw error when editing nonexistent camp', async () => {
    await pactum
      .spec()
      .patch('/v1/camps/1')
      .withPathParams('id', '1')
      .withHeaders({
        Authorization: 'Bearer $S{accessToken-user1}',
      })
      .withBody(campDto)
      .expectBody({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Camp not Found',
        error: 'Not Found',
      })
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('should throw error when deleting nonexistent camp', async () => {
    await pactum
      .spec('deleteCamp', { campId: '1', user: 'user1' })
      .expectBody({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Camp not Found',
        error: 'Not Found',
      })
      .expectStatus(HttpStatus.NOT_FOUND);
  });
});
