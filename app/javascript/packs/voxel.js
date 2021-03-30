export default class Voxel {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        //getters methods
        this.get_x = function () {
            return this.x;
        };

        this.get_y = function () {
            return this.y;
        };

        this.get_z = function () {
            return this.z;
        };

        //setter methods
        this.set_x = function (new_x) {
            this.x = new_x;
        };

        this.set_y = function (new_y) {
            this.y = new_y;
        };

        this.set_z = function (new_z) {
            this.z = new_z;
        };

        this.move_to = function (x_cor, y_cor, z_cor) {
            this.x = x_cor;
            this.y = y_cor;
            this.z = z_cor;
        };
    }
}
