describe(`VAOS MOVE request scheudle flow`, () => {
  describe('When more than one facility supports online scheduling', () => {
    describe('And more than one clinics support direct schedule', () => {
      describe('And veteran selects "I need a different clinic"', () => {
        it('should schedule appointment', () => {});
      });
    });

    describe('And no clinics support direct schedule', () => {
      it('should schedule appointment', () => {});
    });
  });

  describe('When one facility supports online scheudling', () => {
    describe('And more than one clinics support direct schedule', () => {
      describe('And veteran selects "I need a different clinic"', () => {
        it('should schedule appointment', () => {});
      });
    });

    describe('And no clinics support direct schedule', () => {
      it('should schedule appointment', () => {});
    });
  });

  describe('When more than one facility supports online scheduling and no home address', () => {
    describe('And more than one clinics support direct schedule', () => {
      describe('And veteran selects "I need a different clinic"', () => {
        it('should schedule appointment', () => {});
      });
    });

    describe('And no clinics support direct schedule', () => {
      it('should schedule appointment', () => {});
    });
  });
});
