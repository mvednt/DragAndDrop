const imageContainer = document.querySelector('#image-container');
const images = imageContainer.querySelectorAll('img');

let dragSrcEl = null;

function handleDragStart(e) {
  e.target.style.opacity = '0.4';
  dragSrcEl = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl !== this) {
    if (dragSrcEl.compareDocumentPosition(this) & Node.DOCUMENT_POSITION_FOLLOWING) {
      // If the dragged element is after the drop target
      this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
    } else {
      // If the dragged element is before the drop target
      this.parentNode.insertBefore(dragSrcEl, this);
    }
    // Store the new order of the images in local storage
    const newOrder = Array.from(images).map(img => img.src);
    localStorage.setItem('imageOrder', JSON.stringify(newOrder));
  }
  return false;
}

function handleDragEnd(e) {
  e.target.style.opacity = '1';
}

images.forEach(img => {
  img.addEventListener('dragstart', handleDragStart);
  img.addEventListener('dragover', handleDragOver);
  img.addEventListener('drop', handleDrop);
  img.addEventListener('dragend', handleDragEnd);
});

// Restore the order of the images from local storage (if it exists)
const imageOrder = JSON.parse(localStorage.getItem('imageOrder'));
if (imageOrder) {
  imageOrder.forEach((src, index) => {
    const img = imageContainer.querySelector(`img[src="${src}"]`);
    imageContainer.insertBefore(img, imageContainer.children[index]);
  });
}