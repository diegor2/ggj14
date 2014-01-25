var Abstract = GameObject.extend({

    _isSensor: true,

    _setProperties: function(properties) {

        this._super(properties);

        this._width = parseFloat(properties["width"]);
        this._height = parseFloat(properties["height"]);

    },

    init: function(b2world, properties) {

        this._super(b2world, properties);

        this.b2body.SetGravityScale(0);
        this._addRectangularFixture(this._width, this._height);
    }

});