import { vaosSetup } from '../../../vaos-cypress-helpers';

describe(`VAOS social work direct scheudle flow`, () => {
  beforeEach(() => {
    vaosSetup();
  });

  describe('When more than one facility supports online scheduling', () => {
    describe('And one clinic supports direct scheduling', () => {
      it.skip('C30199: should schedule appointment', () => {});
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it.skip('C30200: should schedule appointment', () => {});
    });

    describe('And no clinic supports direct, clinic supports request scheduling', () => {
      it.skip('C30201: should schedule appointment', () => {});
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it.skip('C30202: should not schedule appointment', () => {});
    });

    describe('And veteran is Cerner user', () => {
      it.skip('C30203: should schedule appointment', () => {});
    });

    describe('And veteran has no home address', () => {
      it.skip('should schedule appointment', () => {});
    });
  });
});
