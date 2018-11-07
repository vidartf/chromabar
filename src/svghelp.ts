
export function getBBox(el: SVGGraphicsElement) {
  try {
    return el.getBBox();
  } catch {
    // Try to make a decent estimate if bbox fails for some reason.
    if (el.attributes['d']) {
      let xmin, xmax, ymin, ymax;
      let path = el.attributes['d'].value;

      path = path.replace(/[a-z].*/g," ").replace(/[\sA-Z]+/gi," ").trim();

      const coordinate_list = path.split(" ");

      for (let coordinate of coordinate_list) {
        if (coordinate.length > 1) {
          let initial_coordinate = coordinate.split(",");
          xmin = xmax = initial_coordinate[0];
          ymin = ymax = initial_coordinate[1];
          break;
        }
      }

      for (let coordinate of coordinate_list) {
        let xycoord = coordinate.split(",");
        if (!xycoord[1]) {
          // ignore relative movements
          xycoord[0] = xmin;
          xycoord[1] = ymin;
        }
        xmin = Math.min(xmin, xycoord[0]);
        xmax = Math.max(xmax, xycoord[0]);
        ymin = Math.min(ymin, xycoord[1]);
        ymax = Math.max(ymax, xycoord[1]);
      }
      return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
    }
    if (el.tagName === 'line') {
      let x1 = parseFloat(el.getAttribute('x1') || '0');
      let x2 = parseFloat(el.getAttribute('x2') || '0');
      let y1 = parseFloat(el.getAttribute('y1') || '0');
      let y2 = parseFloat(el.getAttribute('y2') || '0');
      let xmin = Math.min(x1, x2);
      let xmax = Math.max(x1, x2);
      let ymin = Math.min(y1, y2);
      let ymax = Math.max(y1, y2);
      return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
    }
    if (el.tagName === 'text') {
      // Would have to measure text size, set dims to 0
      let x = parseFloat(el.getAttribute('x') || '0');
      let y = parseFloat(el.getAttribute('y') || '0');
      return new DOMRect(x, y, 0, 0);
    }
    if (el.children.length) {
      let xmin, xmax, ymin, ymax;
      xmin = ymin = Infinity;
      xmax = ymax = -Infinity;
      let validChild = false;
      for (let child of Array.from(el.children)) {
        let cb = getBBox(child as SVGGraphicsElement);
        if (cb) {
          validChild = true;
          xmin = Math.min(xmin, cb.left);
          xmax = Math.max(xmax, cb.right);
          ymin = Math.min(ymin, cb.top);
          ymax = Math.max(ymax, cb.bottom);
        }
      }
      if (validChild) {
        return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
      }
    }
  }
  return new DOMRect(0, 0, 0, 0);
}
