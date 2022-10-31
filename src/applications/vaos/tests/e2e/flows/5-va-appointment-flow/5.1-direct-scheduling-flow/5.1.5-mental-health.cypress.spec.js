describe(`VAOS mental health direct scheudle flow`, () => {
  describe('When more than one facility supports online scheduling', () => {
    describe('And one clinic supports direct scheduling', () => {
      it.skip('C30179: should schedule appointment', () => {});
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it.skip('C30180: should schedule appointment', () => {});
    });

    describe('And no clinic supports direct, clinic supports request scheduling', () => {
      it.skip('C30181: should schedule appointment', () => {});
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it.skip('C30182: should not schedule appointment', () => {});
    });

    describe('And veteran is Cerner user', () => {
      it.skip('C30183: should schedule appointment', () => {});
    });

    describe('And veteran has no home address', () => {
      it.skip('should schedule appointment', () => {});
    });
  });
});
