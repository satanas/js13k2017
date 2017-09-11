var GameScene = function() {
  var _ = this;
  _.maxBlur = 5;
  _.c = $.byId("c"); // Canvas ref
  _.be = 0; // Bite effect flag
  _.end = 0; // Ending flag. 1 = game over, 2 = win
  _.zn = 0; // Zone flag. 0 = intro, 1 = lab
  _.tries = 0;

  _.inherits(Scene);
  Scene.call(_);

  $.ss = new ScreenShake();
  $.hud = new HUD();

  _.init = function() {
    _.be = 0;
    _.end = 0;
    $.msg = 0;

    // If intro
    if (!_.zn) {
      Object.keys($.g).forEach(function(g) { $.g[g].clr() })
      _.ww = 1024;
      _.wh = 576;
      $.lvl.iroom(_.ww, _.wh);
    } else {
      // Clear all groups before start
      Object.keys($.g).forEach(function(g) { $.g[g].clr() })
      _.ww = 3200;
      _.wh = 3200;
      if (!_.tries) {
        $.lvl.gen(_.ww, _.wh);
      } else {
        $.lvl.reload();
      }
    }
    $.cam.setWorldSize(_.ww, _.wh);
    $.hud.sws(_.ww, _.wh); // Set world size
    $.cam.setTarget($.player);
  }

  // Next floor
  _.nz = function() {
    _.zn += 1;
    _.reset();
    _.init();
  }

  _.update = function() {
    $.x.clr('#787878');
    $.msg = 0; // Clearing the msg buffer

    _.be = iir(_.be - $.e, 0);
    // Update
    $.g.w.u();
    $.g.s.u();
    $.g.z.u();
    $.g.i.u();
    $.g.h.u();
    $.g.x.u();
    $.player.u();
    $.g.n.u();
    $.g.b.u();
    $.cam.u();
    $.hud.u();
    $.ss.u();

    // Render
    $.g.s.r(); // spawners
    $.g.d.r(); // floor and decorations
    $.g.h.r(); // zones
    $.g.w.r(); // walls
    $.g.z.r(); // zombies
    $.g.i.r(); // items
    $.cam.r($.player);
    $.g.n.r(); // NPCs
    $.g.x.r(); // vaccine
    $.g.b.r(); // bullets
    $.player.dAim();
    $.hud.r();
    _.fx();
    _.gm();

    if (!_.zn) _.pi();
    _.mod();
  };

  _.fx = function() {
    var h = $.player.hum,
        g = 0,
        b = 0;

    g = iir((100 - h) * 2, 0, 100);
    if (h <= 70 && h > 0) {
      b = iir((70 - h) * 2, 0, 100);
    }
    _.c.style.filter = "grayscale(" + g + "%) blur(" + (b * _.maxBlur / 100) + "px)";

    if (_.be) {
      //$.x.fs("rgba(255,0,0," + lim(_.t.fo / t, 1) +")");
      $.x.fs("rgba(255,0,0,0.4)");
      $.x.fr(0, 0, $.vw, $.vh);
    }
  };

  // Print instructions method
  _.pi = function() {
    $.x.fs('rgba(0,0,0,0.5)');
    $.x.fr(300, 460, 430, 70);
    $.x.ct('WASD, ZQSD and ARROWS to move', 20, 490, WH, FN);
    $.x.ct('MOUSE to aim and shoot', 20, 515, WH, FN);
  }

  // To be called on game over
  _.over = function() {
    _.end = 1;
    $.sn.p('go');
  }

  // To be called when the player reaches the goal
  _.win = function() {
    _.end = 2;
  }

  // Print global message
  _.gm = function() {
    if ($.msg) {
      $.x.ct($.msg, 30, 200, WH, FN);
    }
  }

  // Render modal for gameover/win
  _.mod = function() {
    if (!_.end) return;

    var w = 600,
        h = 500,
        c = WH,
        s = FN,
        x = ($.vw - w) / 2,
        y = ($.vh - h) / 2;

    _.rstfx();
    $.x.ga(0.9);
    $.x.fs(c);
    $.x.fr(x, y, w, h);
    if (_.end === 1) {
      $.x.fs('#111');
      $.x.fr(x + 30, y, w - 60, h);

      Zombie.d(410, y + 160, DIR.DOWN);
      Vaccine.d(430, y + 245);

      $.x.ft('x  100', 30, 500, y + 200, c, s);
      $.x.ft('x  1', 30, 500, y + 270, c, s);

      // You still have soldiers left
      if (_.tries < MAX_SOLD) {
        $.x.ct('YOU DIED', 50, y + 80, c, s);
        $.x.ct('ENTER to send another soldier. ESC to exit.', 20, y + 450, c, s);

        if ($.in.p(IN.E)) {
          _.zn = 0
          _.tries += 1;
          _.init();
        }
      } else {
        $.x.ct('GAME OVER', 50, y + 80, c, s);
        //$.x.ct('You could not save the human race.', 18, y + 350, c, s);
        if ($.in.p(IN.E)) {
          _.goToMenu();
        }
      }
    } else if (_.end === 2) {
      $.x.fs('#f80');
      $.x.fr(x + 30, y, w - 60, h);

      $.x.ct('WELL DONE!', 50, y + 80, c, s);
      $.x.ct('You delivered the vaccine to the safe zone at the cost', 18, y + 150, c, s);
      $.x.ct('of your own life to save the human race. You are A HERO', 18, y + 175, c, s);

      Zombie.d(420, y + 220, DIR.DOWN);
      $.x.ft('x  100', 30, 510, y + 260, c, s);

      $.x.ct('Thanks for playing!', 25, y + 360, c, s);
      $.x.ct('ENTER to continue.', 20, y + 450, c, s);
      if ($.in.p(IN.E)) {
        _.goToMenu();
      }
    }
    $.x.ga(1);
  }

  _.rstfx = function() {
    _.c.style.filter = ""; // reset fx
  }

  _.goToMenu = function() {
    _.tries = 0;
    _.zn = 0;
    _.exit();
    _.rstfx();
    $.scn.menu.start();
  }
}
