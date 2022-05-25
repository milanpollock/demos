import {
  DUMMY_MONGODB_ID,
  EntityType,
} from '@dark-rush-photography/shared/types';
import { getAuthHeaders } from '../../../../support/commands/api/auth-headers.functions';

describe('Find one Public Entities', () => {
  beforeEach(() => cy.login().then(() => cy.deleteTestData(getAuthHeaders())));

  it('should return application/json', () =>
    cy
      .createTestAdminEntities(getAuthHeaders())
      .its('body.id')
      .then((entityId) =>
        cy
          .updateAdminEntities(getAuthHeaders(), entityId, {
            isPublic: true,
            seoKeywords: [],
            starredImageIsCentered: false,
          })
          .then(() => cy.findOnePublicEntities(entityId))
          .its('headers')
          .its('content-type')
          .should('include', 'application/json')
      ));

  it('should find a public entity', () =>
    cy
      .createTestAdminEntities(getAuthHeaders())
      .its('body.id')
      .then((entityId) =>
        cy
          .updateAdminEntities(getAuthHeaders(), entityId, {
            isPublic: true,
            seoKeywords: [],
            starredImageIsCentered: false,
          })
          .then(() => cy.findOnePublicEntities(entityId))
          .its('body.publicEntity.type')
          .should('equal', EntityType.Test)
      ));

  it('should return a status of 200 when find an entity', () =>
    cy
      .createTestAdminEntities(getAuthHeaders())
      .its('body.id')
      .then((entityId) =>
        cy
          .updateAdminEntities(getAuthHeaders(), entityId, {
            isPublic: true,
            seoKeywords: [],
            starredImageIsCentered: false,
          })
          .then(() => cy.findOnePublicEntities(entityId))
          .its('status')
          .should('equal', 200)
      ));

  it('should return a not found request status when cannot find an entity', () =>
    cy
      .findOnePublicEntities(DUMMY_MONGODB_ID)
      .its('status')
      .should('equal', 404));

  it('should return a not found request status when entity is not public', () =>
    cy
      .createTestAdminEntities(getAuthHeaders())
      .its('body.id')
      .then((entityId) => cy.findOnePublicEntities(entityId))
      .its('status')
      .should('equal', 404));
});