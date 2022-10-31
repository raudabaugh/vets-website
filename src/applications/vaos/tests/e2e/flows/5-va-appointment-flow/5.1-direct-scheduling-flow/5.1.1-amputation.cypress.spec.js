import { vaosSetup } from '../../../vaos-cypress-helpers';

describe(`VAOS amputation direct scheudle flow`, () => {
  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      vaosSetup();
    });

    describe('And one clinic supports direct scheduling', () => {
      it('C23809: should schedule appointment', () => {});
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it('C30170: should schedule appointment', () => {});
    });

    describe('And no clinic supports direct, clinic supports request scheduling', () => {
      it('C30171: should schedule appointment', () => {});
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it('C30172: should not schedule appointment', () => {});
    });

    describe('And veteran is Cerner user', () => {
      it('C30173: should schedule appointment', () => {});
    });

    describe('And veteran has no home address', () => {
      it('should schedule appointment', () => {});
    });
  });
});
