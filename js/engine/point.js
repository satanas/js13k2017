var Point = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;

  // TODO: configure grid size
  _.toGrid = function() {
    return new Point(floor(_.x / GS), floor(_.y / GS));
  };
};
