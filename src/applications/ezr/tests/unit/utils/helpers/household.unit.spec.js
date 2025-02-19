import { expect } from 'chai';
import {
  includeSpousalInformation,
  isOfCollegeAge,
  getDependentPageList,
} from '../../../../utils/helpers/household';

describe('ezr household information helpers', () => {
  context('when `includeSpousalInformation` executes', () => {
    context('when marital status is `never married`', () => {
      const formData = { maritalStatus: 'never married' };
      it('should return `false`', () => {
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    context('when marital status is `married`', () => {
      const formData = { maritalStatus: 'married' };
      it('should return `true`', () => {
        expect(includeSpousalInformation(formData)).to.be.true;
      });
    });

    context('when marital status is `separated`', () => {
      const formData = { maritalStatus: 'separated' };
      it('should return `true`', () => {
        expect(includeSpousalInformation(formData)).to.be.true;
      });
    });
  });

  context('when `isOfCollegeAge` executes', () => {
    context('when birthdate is greater than 23 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '1986-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    context('when birthdate is less than 18 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '2005-06-02';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    context('when birthdate is exactly 18 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2005-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    context('when birthdate is exactly 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2000-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    context('when birthdate is between 18 and 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2003-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });
  });

  context('when `getDependentPageList` executes', () => {
    const pages = [
      { id: 'page1', title: 'Page 1' },
      { id: 'page2', title: 'Page 2', depends: { key: 'key1', value: false } },
      { id: 'page3', title: 'Page 3' },
      { id: 'page4', title: 'Page 4', depends: { key: 'key2', value: true } },
      { id: 'page5', title: 'Page 5', depends: { key: 'key3', value: false } },
    ];

    context('when page entries do not have conditional dependencies', () => {
      it('should return a list of non-conditional pages when form data is omitted', () => {
        expect(getDependentPageList(pages)).to.have.lengthOf(2);
      });

      it('should return a list of non-conditional pages when form data is included', () => {
        const formData = {};
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(2);
      });
    });

    context('when two conditional dependencies do not match', () => {
      it('should return a list of three (3) pages', () => {
        const formData = { key1: true, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(3);
      });
    });

    context('when one conditional dependency does not match', () => {
      it('should return a list of four (4) pages', () => {
        const formData = { key1: false, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(4);
      });
    });

    context('when one conditional dependency contain a function value', () => {
      it('should return a list of four (5) pages', () => {
        const formData = { key1: false, key2: true, key3: false };
        const altPages = [
          ...pages,
          {
            id: 'page6',
            title: 'Page 6',
            depends: {
              key: 'key3',
              value: val => val === true,
            },
          },
        ];
        expect(getDependentPageList(altPages, formData)).to.have.lengthOf(5);
      });

      it('should return a list of all pages when the form data matches the function conditional', () => {
        const formData = { key1: false, key2: true, key3: false };
        const altPages = [
          ...pages,
          {
            id: 'page6',
            title: 'Page 6',
            depends: {
              key: 'key3',
              value: val => val === false,
            },
          },
        ];
        expect(getDependentPageList(altPages, formData)).to.have.lengthOf(6);
      });
    });

    context('when all conditional dependencies match', () => {
      it('should return a list of all pages', () => {
        const formData = { key1: false, key2: true, key3: false };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(5);
      });
    });
  });
});
