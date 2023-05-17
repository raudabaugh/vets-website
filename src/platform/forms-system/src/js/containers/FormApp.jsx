import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { isLoggedIn } from 'platform/user/selectors';

import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import { isInProgress, createPageList, createFormPageList } from '../helpers';
import { setGlobalScroll } from '../utilities/ui';

import { getPreviousPagePath } from '../routing';

const { Element } = Scroll;

/*
 * Primary component for a schema generated form app.
 */
class FormApp extends React.Component {
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    const { additionalRoutes } = this.props.formConfig;
    this.nonFormPages = [];
    if (additionalRoutes) {
      this.nonFormPages = additionalRoutes.map(route => route.path);
    }

    setGlobalScroll();

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  render() {
    const { currentLocation, formConfig, children, formData } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const lastPathComponent = currentLocation.pathname.split('/').pop();
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isNonFormPage = this.nonFormPages.includes(lastPathComponent);
    const Footer = formConfig.footerContent;
    const title =
      typeof formConfig.title === 'function'
        ? formConfig.title(this.props)
        : formConfig.title;

    let formBackButton = null;
    let formTitle;
    let formNav;
    let renderedChildren = children;
    // Show title only if:
    // 1. we're not on the intro page *or* one of the additionalRoutes
    //    specified in the form config
    // 2. there is a title specified in the form config
    if (!isIntroductionPage && !isNonFormPage && title) {
      formTitle = <FormTitle title={title} subTitle={formConfig.subTitle} />;
    }

    // Show nav only if we're not on the intro, form-saved, error, confirmation
    // page or one of the additionalRoutes specified in the form config
    // Also add form classes only if on an actual form page
    if (!isNonFormPage && isInProgress(trimmedPathname)) {
      const formPages = createFormPageList(formConfig);
      const pageList = createPageList(formConfig, formPages);
      const goBackPath = getPreviousPagePath(
        pageList,
        formData,
        currentLocation.pathname,
      );

      formBackButton = (
        <Link to={goBackPath} className="form-back-arrow">
          <img
            className="icon-back-arrow"
            src="/img/arrow-right-blue.svg"
            alt="go back"
            aria-hidden="true"
          />
          Back
        </Link>
      );

      formNav = (
        <FormNav
          formData={formData}
          formConfig={formConfig}
          currentPath={trimmedPathname}
          isLoggedIn={this.props.isLoggedIn}
          inProgressFormId={this.props.inProgressFormId}
        />
      );

      renderedChildren = (
        <div className="progress-box progress-box-schemaform">{children}</div>
      );
    }

    let footer;
    if (Footer && !isNonFormPage) {
      footer = (
        <Footer formConfig={formConfig} currentLocation={currentLocation} />
      );
    }

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <Element name="topScrollElement" />
            {formBackButton}
            {formTitle}
            {formNav}
            {renderedChildren}
          </div>
        </div>
        {footer}
        <span
          className="js-test-location hidden"
          data-location={trimmedPathname}
          hidden
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: isLoggedIn(state),
  inProgressFormId: state.form.loadedData?.metadata?.inProgressFormId,
});

FormApp.propTypes = {
  children: PropTypes.element,
  currentLocation: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  formConfig: PropTypes.shape({
    additionalRoutes: PropTypes.arrayOf([
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ]),
    footerContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    subTitle: PropTypes.string,
    title: PropTypes.string,
  }),
  formData: PropTypes.shape({}),
  inProgressFormId: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  route: PropTypes.shape({
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
};

export default connect(mapStateToProps)(FormApp);

export { FormApp };
