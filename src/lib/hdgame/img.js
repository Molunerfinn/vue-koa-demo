const g_rem = 20;

const Img = {
  MODE_SCALE_FILL: 1,
  MODE_SCALE_WIDTH: 2,
  MODE_SCALE_HEIGHT: 3,
  MODE_SCALE_DEFLATE_WIDTH: 4,
  MODE_SCALE_DEFLATE_HEIGHT: 5,
  MODE_SCALE_DEFLATE_FILL: 6,
  MODE_SCALE_DEFLATE_MAX: 7
};
Img.isNull = function(obj) {
  return (typeof obj == "undefined") || (obj == null)
};
Img.optimize = function(img, option, noRound) {
  let imgTmp = new Image();
  imgTmp.src = img.src;
  let imgWidth = imgTmp.width;
  let imgHeight = imgTmp.height;
  if (Img.isNull(imgWidth) || imgWidth == 0 || Img.isNull(imgHeight) || imgHeight == 0) {
    imgWidth = img.width;
    imgHeight = img.height
  }
  let size = Img.calcSize(imgWidth, imgHeight, option.width, option.height, option.mode, noRound);
  img.width = size.width;
  img.height = size.height;
  if (option.display == 1) {
    img.style.display = "inline"
  } else {
    if (option.display == 2) {
      img.style.display = "none"
    } else {
      img.style.display = "block"
    }
  }
  return {
    width: img.width,
    height: img.height
  }
};
Img.calcSize = function(width, height, maxWidth, maxHeight, mode, noRound) {
  if (isNaN(maxWidth)) {
    maxWidth = parseFloat(maxWidth) * g_rem
  }
  if (isNaN(maxHeight)) {
    maxHeight = parseFloat(maxHeight) * g_rem
  }
  let size = {
    width: width,
    height: height
  };
  if (mode == Img.MODE_SCALE_FILL) {
    let rateWidth = width / maxWidth;
    let rateHeight = height / maxHeight;
    if (rateWidth > rateHeight) {
      size.width = maxWidth;
      size.height = height / rateWidth
    } else {
      size.width = width / rateHeight;
      size.height = maxHeight
    }
  } else {
    if (mode == Img.MODE_SCALE_WIDTH) {
      let rateWidth = width / maxWidth;
      size.width = maxWidth;
      size.height = height / rateWidth
    } else {
      if (mode == Img.MODE_SCALE_HEIGHT) {
        let rateHeight = height / maxHeight;
        size.width = width / rateHeight;
        size.height = maxHeight
      } else {
        if (mode == Img.MODE_SCALE_DEFLATE_WIDTH) {
          let rateWidth = width / maxWidth;
          if (rateWidth > 1) {
            size.width = maxWidth;
            size.height = height / rateWidth
          }
        } else {
          if (mode == Img.MODE_SCALE_DEFLATE_HEIGHT) {
            let rateHeight = height / maxHeight;
            if (rateHeight > 1) {
              size.width = width / rateHeight;
              size.height = maxHeight
            }
          } else {
            if (mode == Img.MODE_SCALE_DEFLATE_FILL) {
              let rateWidth = width / maxWidth;
              let rateHeight = height / maxHeight;
              if (rateWidth > rateHeight) {
                if (rateWidth > 1) {
                  size.width = maxWidth;
                  size.height = height / rateWidth
                }
              } else {
                if (rateHeight > 1) {
                  size.width = width / rateHeight;
                  size.height = maxHeight
                }
              }
            } else {
              if (mode == Img.MODE_SCALE_DEFLATE_MAX) {
                if (width > maxWidth && height > maxHeight) {
                  let rateWidth = width / maxWidth;
                  let rateHeight = height / maxHeight;
                  if (rateWidth < rateHeight) {
                    size.width = maxWidth;
                    size.height = height / rateWidth
                  } else {
                    size.width = width / rateHeight;
                    size.height = maxHeight
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (!noRound) {
    size.width = Math.floor(size.width);
    size.height = Math.floor(size.height)
  }
  if (size.width == 0) {
    size.width = 1
  }
  if (size.height == 0) {
    size.height = 1
  }
  return size
}
export default Img
