var Wall = function(x, y) {
  var _ = this;

  _.inherits(Sprite);
  Sprite.call(_, x, y, 32, 32);

  _.r = function(p) {
    $.x.s();
    $.x.fs('#ffff00');
    $.x.fr(p.x, p.y, _.w, _.h);
    $.x.r();
  }
};