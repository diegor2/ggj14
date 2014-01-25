//Having to type 'Box2D.' in front of everything makes porting
//existing C++ code a pain in the butt. This function can be used
//to make everything in the Box2D namespace available without
//needing to do that.
function using(ns, pattern) {
    if (pattern == undefined) {
        // import all
        for (var name in ns) {
            this[name] = ns[name];
        }
    } else {
        if (typeof(pattern) == 'string') {
            pattern = new RegExp(pattern);
        }
        // import only stuff matching given pattern
        for (var name in ns) {
            if (name.match(pattern)) {
                this[name] = ns[name];
            }
        }
    }
}

//using(Box2D, "^b2.+");