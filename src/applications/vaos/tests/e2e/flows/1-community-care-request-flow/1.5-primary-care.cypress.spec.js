describe('VAOS primary care community care flow using VAOS services', () => {
  describe('When one facility where veteran is registered supports CC', () => {
    describe('And veteran does have a home address', () => {
      it('C26204: should request appointment', () => {});
    });
    describe('And veteran does not have a home address', () => {
      it('C26203: should request appointment', () => {});
    });
  });

  describe('When more than one facility where veteran is registered supports CC', () => {
    describe('And veteran does have a home address', () => {
      it('C26202: should request appointment', () => {});
    });
    describe('And veteran does not have a home address', () => {
      it('C26201: should request appointment', () => {});
    });
  });
});
