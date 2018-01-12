/**
 * Created by Finatwork on 14-02-2017.
 */
function finatworkImageController(){
    window.onload = function () {
        var ImageMap = function (map, img) {
                var n,
                    areas = map.getElementsByTagName('area'),
                    len = areas.length,
                    coords = [],
                    previousWidth = 1324;
                for (n = 0; n < len; n++) {
                    coords[n] = areas[n].coords.split(',');
                }
                this.resize = function () {
                    var n, m, clen,
                        x = img.offsetWidth / previousWidth;
                    for (n = 0; n < len; n++) {
                        clen = coords[n].length;
                        for (m = 0; m < clen; m++) {
                            coords[n][m] *= x;
                        }
                        areas[n].coords = coords[n].join(',');
                    }
                    previousWidth = document.body.clientWidth;
                    return true;
                };
                window.onresize = this.resize;
            },
            imageMap = new ImageMap(document.getElementById('my_image'), document.getElementById('img_id'));
        imageMap.resize();
        return;
    }
}
angular.module('finatwork').controller('finatworkImageController', finatworkImageController);