const url = './docs/pdf.pdf';

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

var scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

// render page
const renderPage = num => {
  pageIsRendering = true;

  // get page
  pdfDoc.getPage(num).then(page => {
    // set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// show prev page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// show next page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

const zoomIn = (e) => {
  if(pdfDoc == null){
    return;
  }
  scale += 0.5;
  renderPage(pageNum);
};

const zoomOut = (e) => {
  if(pdfDoc == null){
    return;
  }
  if(scale > 0.5){
    scale -= 0.5;
  }
  renderPage(pageNum);
};

// get document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch(err => {
    // display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
document.querySelector('#zoom-in').addEventListener('click', zoomIn);
document.querySelector('#zoom-out').addEventListener('click', zoomOut);