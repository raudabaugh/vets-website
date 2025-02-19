import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

describe('Start a new message With Attacments and Errors', () => {
  it('start a new message with attachment', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage
      .getCategory('COVID')
      .first()
      .click();

    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.verifyAttachmentErrorMessage(
      'You have already attached this file.',
    );

    composePage.attachMessageFromFile('test_image_10mb.jpg');
    composePage.verifyAttachmentErrorMessage(
      'Your file is too large. Try attaching a file smaller than 6MB.',
    );

    composePage.attachMessageFromFile('sample_pdf.pdf');
    composePage.attachMessageFromFile('sample_docx.docx');
    composePage.attachMessageFromFile('sample_XLS.xls');
    composePage.attachMessageFromFile('test_image.gif');
    // logic has changed here. After attaching 4th file, Attach File button becomes hidden
    cy.get('[data-testid="attach-file-input"]').should('not.exist');
    // composePage.verifyAttachmentErrorMessage(
    //   'You may only attach up to 4 files',
    // );
    composePage.getMessageSubjectField().type('Test Subject');
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true, waitforanimations: true });
    composePage.sendMessage();
  });
});
