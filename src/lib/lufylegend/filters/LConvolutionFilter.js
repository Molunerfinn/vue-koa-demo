import LBitmapFilter from './LBitmapFilter';
import LGlobal from '../utils/LGlobal';
class LConvolutionFilter extends LBitmapFilter {
    constructor(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
        super();
        this.type = 'LConvolutionFilter';
        this.matrixX = matrixX ? matrixX : 0;
        this.matrixY = matrixY ? matrixY : 0;
        this.matrix = matrix;
        if (!divisor) {
            divisor = matrix.reduce(function(a, b) {
                return a + b;
            }) || 1;
        }
        this.divisor = divisor;
        this.bias = bias ? bias : 0;
    }
    filter(olddata, w, c) {
        let s = this, res;
        c = LGlobal.enableWebGL ? LGlobal._context : (c || LGlobal.canvas);
        let oldpx = olddata.data;
        let newdata = c.createImageData(olddata);
        let newpx = newdata.data;
        let len = newpx.length;
        for (let i = 0; i < len; i++) {
            if ((i + 1) % 4 === 0) {
                newpx[i] = oldpx[i];
                continue;
            }
            res = 0;
            let these = [
                oldpx[i - w * 4 - 4] || oldpx[i],
                oldpx[i - w * 4] || oldpx[i],
                oldpx[i - w * 4 + 4] || oldpx[i],
                oldpx[i - 4] || oldpx[i],
                oldpx[i],
                oldpx[i + 4] || oldpx[i],
                oldpx[i + w * 4 - 4] || oldpx[i],
                oldpx[i + w * 4] || oldpx[i],
                oldpx[i + w * 4 + 4] || oldpx[i]
            ];
            for (let j = 0; j < 9; j++) {
                res += these[j] * s.matrix[j];
            }
            res /= s.divisor;
            if (s.bias) {
                res += s.bias;
            }
            newpx[i] = res;
        }
        return newdata;
    }
}
export default LConvolutionFilter;