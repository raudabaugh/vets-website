/**
 * Template utils.
 */
import { unset } from 'lodash';
import registerFonts from '../registerFonts';

const pdfkit = require('pdfkit');

// Handle both node and browser environments.
const PDFDocument = pdfkit.default ?? pdfkit;

/**
 * Return the current X position, limited to the configured page margins.
 *
 * @param {Object} doc
 *
 * @returns {int} x position
 */
const getBoundedXPosition = doc => {
  if (doc.x < doc.page.margins.left) return doc.page.margins.left;

  const rightMargin = doc.page.width - doc.page.margins.right;
  if (doc.x > rightMargin) return rightMargin;

  return doc.x;
};

/**
 * Return the current Y position, limited to the configured page margins.
 *
 * @param {Object} doc
 *
 * @returns {int} y position
 */
const getBoundedYPosition = doc => {
  if (doc.y < doc.page.margins.top) return doc.page.margins.top;

  const bottomMargin = doc.page.height - doc.page.margins.bottom;
  if (doc.y > bottomMargin) return bottomMargin;

  return doc.y;
};

/**
 * Add a structure to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} struct
 * @param {string} font
 * @param {int} fontSize
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createStruct = (doc, struct, font, fontSize, text, options) => {
  const x = options.x ?? getBoundedXPosition(doc);
  const y = options.y ?? getBoundedYPosition(doc);
  unset(options.x);
  unset(options.y);
  return doc.struct(struct, () => {
    doc
      .font(font)
      .fontSize(fontSize)
      .text(text, x, y, options);
  });
};

/**
 * Add a horizontal rule to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {int} spaceFromEdge How far the right and left sides should be away from the edge (in px)
 * @param {int} linesAbove How much space should be above the HR (in lines)
 * @param {int} linesBelow How much space should be below the HR (in lines)
 *
 * @returns {Object}
 */
const addHorizontalRule = (
  doc,
  spaceFromEdge = 0,
  linesAbove = 0.5,
  linesBelow = 0.5,
) => {
  doc.moveDown(linesAbove);

  // TODO add alternative text.
  doc.markContent('Artifact', { type: 'Layout' });
  doc
    .moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesBelow);
  return doc;
};

/**
 * Add a span struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSpan = (doc, config, text, options) => {
  return createStruct(
    doc,
    'Span',
    config.text.font,
    config.text.size,
    text,
    options,
  );
};

/**
 * Add a text artifact struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createArtifactText = (doc, config, text, options) => {
  return createStruct(
    doc,
    'Artifact',
    config.text.font,
    config.text.size,
    text,
    options,
  );
};

/**
 * Generates Header Banner
 *
 * @param {Object} doc
 * @param {Object} header header struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateHeaderBanner = async (doc, header, data, config) => {
  doc.moveDown(1);
  const currentHeight = doc.y;

  // Calculate text width
  let width = 0;
  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font =
      element.weight === 'bold' ? config.text.boldFont : config.text.font;

    doc.font(font);
    doc.fontSize(config.text.size);
    width += doc.widthOfString(element.text);
  }

  // This math is based on US Letter page size and will have to be adjusted
  // if we ever offer document size as a parameter.
  const leftMargin = (612 - 32 - width) / 2 + config.margins.left;

  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font =
      element.weight === 'bold' ? config.text.boldFont : config.text.font;
    const paragraphOptions = {};
    if (i < data.headerBanner.length) {
      paragraphOptions.continued = true;
    }

    header.add(
      doc.struct('Span', () => {
        doc
          .font(font)
          .fontSize(config.text.size)
          .text(element.text, leftMargin, doc.y, paragraphOptions);
      }),
    );
  }

  const height = doc.y - currentHeight + 25;

  doc.rect(config.margins.left, currentHeight - 4, 580, height).stroke();

  doc.moveDown(3);

  // This is an ugly hack that resets the document X position
  // so that the document header is shown correctly.
  header.add(
    doc.struct('Artifact', () => {
      doc.text('', config.margins.left, doc.y);
    }),
  );
};

/**
 * Generates Initial Header Content
 *
 * @param {Object} doc
 * @param {Object} parent parent struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateInitialHeaderContent = async (doc, parent, data, config) => {
  // Adjust page margins so that we can write in the header/footer area.
  // eslint-disable-next-line no-param-reassign
  doc.page.margins = {
    top: 0,
    bottom: 0,
    left: config.margins.left,
    right: 16,
  };

  const header = doc.struct('Sect', {
    type: 'Pagination',
    title: 'Header',
    attached: 'Top',
  });
  parent.add(header);
  const leftOptions = { continued: true, x: config.margins.left, y: 12 };
  header.add(createSpan(doc, config, data.headerLeft, leftOptions));
  const rightOptions = { align: 'right' };
  header.add(createSpan(doc, config, data.headerRight, rightOptions));

  if (data.headerBanner) {
    generateHeaderBanner(doc, header, data, config);
  }

  header.end();

  // eslint-disable-next-line no-param-reassign
  doc.page.margins = config.margins;
};

/**
 * Generates Final Header Content
 *
 * @param {Object} doc
 * @param {Object} parent parent struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateFinalHeaderContent = async (doc, parent, data, config) => {
  const pages = doc.bufferedPageRange();
  for (let i = 1; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins so that we can write in the header/footer area.
    // eslint-disable-next-line no-param-reassign
    doc.page.margins = {
      top: 0,
      bottom: 0,
      left: config.margins.left,
      right: 16,
    };

    const header = doc.struct('Artifact', {
      type: 'Pagination',
      title: 'Header',
      attached: 'Top',
    });
    parent.add(header);
    const leftOptions = { continued: true, x: 16, y: 12 };
    header.add(createArtifactText(doc, config, data.headerLeft, leftOptions));
    const rightOptions = { align: 'right' };
    header.add(createArtifactText(doc, config, data.headerRight, rightOptions));
    header.end();
  }
};

/**
 * Generates Final Header Content
 *
 * @param {Object} doc
 * @param {Object} parent parent struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateFooterContent = async (doc, parent, data, config) => {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins so that we can write in the header/footer area.
    // eslint-disable-next-line no-param-reassign
    doc.page.margins = {
      top: 0,
      bottom: 0,
      left: config.margins.left,
      right: 16,
    };

    const groupingStruct = i === pages.count - 1 ? 'Struct' : 'Artifact';
    const footer = doc.struct(groupingStruct, {
      type: 'Pagination',
      title: 'Footer',
      attached: 'Bottom',
    });
    parent.add(footer);

    let footerRightText = data.footerRight.replace('%PAGE_NUMBER%', i + 1);
    footerRightText = footerRightText.replace('%TOTAL_PAGES%', pages.count);
    const footerLeftOptions = {
      continued: true,
      x: config.margins.left,
      y: 766,
    };
    const footerRightOptions = { align: 'right' };

    // Only allow the last footer element to be read by screen readers.
    if (i === pages.count - 1) {
      footer.add(createSpan(doc, config, data.footerLeft, footerLeftOptions));
      footer.add(createSpan(doc, config, footerRightText, footerRightOptions));
    } else {
      footer.add(
        createArtifactText(doc, config, data.footerLeft, footerLeftOptions),
      );
      footer.add(
        createArtifactText(doc, config, footerRightText, footerRightOptions),
      );
    }
    footer.end();
  }
};

/**
 * Add a details item to the given PDFKit structure element.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {int} Y position
 * @param {Object} item
 *
 * @returns {Object} doc
 */
const createDetailItem = async (doc, config, x, item) => {
  const paragraphOptions = { lineGap: 6 };
  let titleText = item.title ?? '';
  const content = [];
  if (item.inline === true) {
    paragraphOptions.continued = true;
    titleText += ': ';
    content.push(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text(titleText, x, doc.y, paragraphOptions);
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .text(item.value);
      }),
    );
  } else {
    const blockValueOptions = { lineGap: 6 };
    paragraphOptions.lineGap = 2;
    if (titleText) {
      titleText += ' ';
      content.push(
        doc.struct('P', () => {
          doc
            .font(config.text.boldFont)
            .fontSize(config.text.size)
            .text(titleText, x, doc.y, paragraphOptions);
        }),
      );
    }
    content.push(
      doc.struct('P', () => {
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .text(item.value, x, doc.y, blockValueOptions);
      }),
    );
  }

  return content;
};

/**
 * Add an image item to the given PDFKit structure element.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {Object} item
 *
 * @returns {Object}
 */
const createImageDetailItem = async (doc, config, x, item) => {
  let titleText = item.title ?? '';
  const content = [];

  if (titleText) {
    titleText += ' ';
    content.push(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text(titleText, x, doc.y, { lineGap: 2 });
      }),
    );
  }

  const image = await fetch(item.value.value);
  const contentType = image.headers.get('Content-type');
  const imageBuffer = await image.arrayBuffer();
  const base64 = `data:${contentType};base64,${Buffer.from(
    imageBuffer,
  ).toString('base64')}`;

  content.push(
    doc.struct('P', () => {
      doc.image(base64, x, doc.y);
    }),
  );

  return content;
};

/**
 * Add a heading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} headingLevel
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createHeading = (doc, headingLevel, config, text, options) => {
  return createStruct(
    doc,
    headingLevel,
    config.headings[headingLevel].font,
    config.headings[headingLevel].size,
    text,
    options,
  );
};

/**
 * Add a subHeading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSubHeading = (doc, config, text, options) => {
  return createStruct(
    doc,
    'P',
    config.subHeading.font,
    config.subHeading.size,
    text,
    options,
  );
};

/**
 * Estimate a text block's height.
 *
 * @param {Object} doc
 * @param {Object} item
 * @param {boolean} initialBlock Whether or not this is the first block in the list.
 *
 * @returns {int}
 */
const getTestResultBlockHeight = (doc, item, initialBlock = false) => {
  let height = 0;

  // Account for height of horizontal rule.
  if (!initialBlock) {
    height += 16;
  }

  if (item.header) {
    height += 36;
  }

  item.items.forEach(resultItem => {
    // This is a gross hack that's necessary because the heightOfString doesn't always
    // return the correct height. See e.g. https://github.com/foliojs/pdfkit/issues/1438
    // TODO: account for longer lines.
    height += 24;
    if (resultItem.inline === false) {
      height += 24;
    }
    /**
     * Potential improved solution if issues with heightOfString are fixed:
     *
    if (resultItem.inline === true) {
      height += doc.heightOfString(`${resultItem.title}: ${resultItem.value}`, 44, 0, {
        // Using regular weight is a bit of a fudge but should be
        // more accurate than using bold for the whole string.
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    } else {
      height += doc.heightOfString(`${resultItem.title}`, 44, 0, {
        font: 'SourceSansPro-Bold',
        fontSize: 16,
        lineGap: 0,
      });
      height += doc.heightOfString(resultItem.value, 44, 0, {
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    }
    */
  });

  return height;
};

/**
 * Create a PDFKit document with the correct parameters set for accessibility.
 *
 * @param {string} title
 *
 * @returns {Object}
 */
const createAccessibleDoc = (data, config) => {
  return new PDFDocument({
    pdfVersion: '1.7',
    lang: data.lang ?? 'en-US',
    tagged: true,
    displayTitle: true,
    info: {
      Author: data.author ?? 'Department of Veterans Affairs',
      Subject: data.subject ?? '',
      Title: data.title,
    },
    autoFirstPage: false,
    bufferPages: true,
    margins: config.margins,
  });
};

/**
 * Register the custom fonts used for VA.gov to the given PDFKit document.
 *
 * @param {Object} doc
 *
 * @returns {void}
 */
const registerVaGovFonts = async doc => {
  await registerFonts(doc, [
    'Bitter-Bold',
    'Bitter-Regular',
    'SourceSansPro-Bold',
    'SourceSansPro-Regular',
  ]);
};

export {
  addHorizontalRule,
  createAccessibleDoc,
  createArtifactText,
  createDetailItem,
  createHeading,
  createSpan,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
  createImageDetailItem,
  generateHeaderBanner,
  generateInitialHeaderContent,
  generateFinalHeaderContent,
  generateFooterContent,
};
