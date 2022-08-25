/**
 * Convert Pixels to relative unit
 * @param pixel
 * @param root - toggle between 'rem' and 'em', defaults to true
 * @example
 *  use browsers fontsize => true = 'rem'
 *  use parent fontsize => false = 'em'
 */
export const pxToEm = (pixel: string | number, root = true) => {
  if (pixel) {
    const px = +pixel
      .toString()
      .trim()
      .replace(/[a-zA-z]/gi, "");
    return `${0.0625 * px || 1}${root ? "rem" : "em"}`;
  }
  return `1${root ? "rem" : "em"}`;
};
