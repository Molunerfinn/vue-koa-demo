import LBitmapFilter from './LBitmapFilter';
import LGlobal from '../utils/LGlobal';
class LColorMatrixFilter extends LBitmapFilter {
    constructor(matrix) {
        super();
        this.type = 'LColorMatrixFilter';
        this.matrix = matrix;
    }
    filter(olddata, w, c) {
        let s = this;
        c = LGlobal.enableWebGL ? LGlobal._context : (c || LGlobal.canvas);
        let oldpx = olddata.data;
        let newdata = c.createImageData(olddata);
        let newpx = newdata.data;
        let len = newpx.length;
        let a = s.matrix;
        for (let i = 0; i < len; i += 4) {
            newpx[i] = (a[0] * oldpx[i]) + (a[1] * oldpx[i + 1]) + (a[2] * oldpx[i + 2]) + (a[3] * oldpx[i + 3]) + a[4];
            newpx[i + 1] = (a[5] * oldpx[i]) + (a[6] * oldpx[i + 1]) + (a[7] * oldpx[i + 2]) + (a[8] * oldpx[i + 3]) + a[9];
            newpx[i + 2] = (a[10] * oldpx[i]) + (a[11] * oldpx[i + 1]) + (a[12] * oldpx[i + 2]) + (a[13] * oldpx[i + 3]) + a[14];
            newpx[i + 3] = (a[15] * oldpx[i]) + (a[16] * oldpx[i + 1]) + (a[17] * oldpx[i + 2]) + (a[18] * oldpx[i + 3]) + a[19];
        }
        return newdata;
    }
}
export default LColorMatrixFilter;