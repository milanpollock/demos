import { DUMMY_CRON_PROCESS_ROW_KEY } from '@dark-rush-photography/shared/types';
import { getAuthHeaders } from '../../../../support/commands/api/auth-headers.functions';

describe('Find One Admin Cron Processes', () => {
  beforeEach(() => cy.login().then(() => cy.deleteTestData(getAuthHeaders())));

  it('should return application/json', () =>
    cy
      .findOneAdminCronProcesses(getAuthHeaders(), DUMMY_CRON_PROCESS_ROW_KEY)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json'));

  it('should return an unauthorized status when not authenticated', () =>
    cy
      .findOneAdminCronProcesses(
        { Authorization: '' },
        DUMMY_CRON_PROCESS_ROW_KEY
      )
      .its('status')
      .should('equal', 401));

  it('should return an unauthorized message when not authenticated', () =>
    cy
      .findOneAdminCronProcesses(
        { Authorization: '' },
        DUMMY_CRON_PROCESS_ROW_KEY
      )
      .its('body.message')
      .should('equal', 'Unauthorized'));
});