/* INDEX
-----------------*/
if (getCurentFileName() == "index.html" || getCurentFileName() == "") {
    $.Ping("74.91.123.186:27015").done(function(success, url, time, on) {
        $("#status").css("color", "#27ae60");
        $("#status").text("Online");
    }).fail(function(failure, url, time, on) {
        $("#connectButton").css("background-color", "#bdc3c7");
        $("#status").css("color", "#c0392b");
        $("#status").text("Offline");
    });
}

/* LOADING
-----------------*/
if (getCurentFileName() == "loading.html") {
    (function($) {
        var ProgressCircle = function(element, options) {
            var settings = $.extend({}, $.fn.progressCircle.defaults, options);
            var thicknessConstant = 0.02;
            var nRadian = 0;

            computePercent();
            setThickness();

            var border = (settings.thickness * thicknessConstant) + 'em';
            var offset = (1 - thicknessConstant * settings.thickness * 2) + 'em';
            var circle = $(element);
            var progCirc = circle.find('.prog-circle');
            var circleDiv = progCirc.find('.bar');
            var circleSpan = progCirc.children('.percenttext');
            var circleFill = progCirc.find('.fill');
            var circleSlice = progCirc.find('.slice');

            if (settings.nPercent == 0) {
                circleSlice.hide();
            } else {
                resetCircle();
                transformCircle(nRadians, circleDiv);
            }
            setBorderThickness();
            updatePercentage();
            setCircleSize();

            function computePercent() {
                settings.nPercent > 100 || settings.nPercent < 0 ? settings.nPercent = 0 : settings.nPercent;
                nRadians = (360 * settings.nPercent) / 100;
            }

            function setThickness() {
                if (settings.thickness > 10) {
                    settings.thickness = 10;
                } else if (settings.thickness < 1) {
                    settings.thickness = 1;
                } else {
                    settings.thickness = Math.round(settings.thickness);
                }
            }

            function setCircleSize() {
                progCirc.css('font-size', settings.circleSize + 'px');
            }

            function transformCircle(nRadians, cDiv) {
                var rotate = "rotate(" + nRadians + "deg)";
                cDiv.css({
                    "-webkit-transform": rotate,
                    "-moz-transform": rotate,
                    "-ms-transform": rotate,
                    "-o-transform": rotate,
                    "transform": rotate
                });
                if (nRadians > 180) {
                    transformCircle(180, circleFill);
                    circleSlice.addClass(' clipauto ');
                }
            }

            function setBorderThickness() {
                progCirc.find(' .slice > div ').css({
                    'border-width': border,
                    'width': offset,
                    'height': offset
                })
                progCirc.find('.after').css({
                    'top': border,
                    'left': border,
                    'width': offset,
                    'height': offset
                })
            }

            function resetCircle() {
                circleSlice.show();
                circleSpan.text('');
                circleSlice.removeClass('clipauto')
                transformCircle(20, circleDiv);
                transformCircle(20, circleFill);
                return this;
            }

            function updatePercentage() {
                settings.showPercentText && circleSpan.text(settings.nPercent + '%');
            }
        };

        $.fn.progressCircle = function(options) {
            return this.each(function(key, value) {
                var element = $(this);
                if (element.data('progressCircle')) {
                    var progressCircle = new ProgressCircle(this, options);
                    return element.data('progressCircle');
                }
                $(this).append('<div class="prog-circle">' +
                    '   <div class="percenttext"> </div>' +
                    '   <div class="slice">' +
                    '       <div class="bar"> </div>' +
                    '       <div class="fill"> </div>' +
                    '   </div>' +
                    '   <div class="after"> </div>' +
                    '</div>');
                var progressCircle = new ProgressCircle(this, options);
                element.data('progressCircle', progressCircle);
            });
        };
        $.fn.progressCircle.defaults = {
            nPercent: 0,
            showPercentText: true,
            circleSize: 100,
            thickness: 2
        };
    })(jQuery);

    var FilesNeeded = 0;
    var FilesTotal = 0;

    var CurrentFile = "";
    var IsDownloadingFile = false;

    var Icons = new Array();

    function DownloadingFile(filename) {
        if (IsDownloadingFile) {
            DownloadedFile();
        }

        IsDownloadingFile = true;
        CurrentFile = filename;
    }

    function DownloadedFile() {
        IsDownloadingFile = false;

        FilesNeeded--
        RefreshFiles();

        for (var i = 0; i < Icons.length; i++) {
            var f = Icons[i];
            if (f == null || f.Div == null) {
                continue;
            }

            if (f.getid() == CurrentFile) {
                f.goaway();
            }
        }
    }

    function SetFilesNeeded(Needed) {
        FilesNeeded = Needed;
        RefreshFiles();
    }

    function SetFilesTotal(Total) {
        FilesTotal = Total;
        RefreshFiles();
    }

    function SetStatusChanged(status) {
        if (IsDownloadingFile) {
            DownloadedFile();
        }
        RefreshFiles();
    }

    function RefreshFiles() {
        var Diff = Math.round(FilesTotal - FilesNeeded);

        $('#circle').progressCircle({
            nPercent: Math.round(Diff / FilesTotal * 100)
        });
    }

    var libbcmath = {
        PLUS: "+",
        MINUS: "-",
        BASE: 10,
        scale: 0,
        bc_num: function() {
            this.n_sign = null;
            this.n_len = null;
            this.n_scale = null;
            this.n_value = null;
            this.toString = function() {
                var b, a;
                a = this.n_value.join("");
                b = ((this.n_sign == libbcmath.PLUS) ? "" : this.n_sign) + a.substr(0, this.n_len);
                if (this.n_scale > 0) {
                    b += "." + a.substr(this.n_len, this.n_scale)
                }
                return b
            }
        },
        bc_new_num: function(b, c) {
            var a;
            a = new libbcmath.bc_num();
            a.n_sign = libbcmath.PLUS;
            a.n_len = b;
            a.n_scale = c;
            a.n_value = libbcmath.safe_emalloc(1, b + c, 0);
            libbcmath.memset(a.n_value, 0, 0, b + c);
            return a
        },
        safe_emalloc: function(c, b, a) {
            return Array((c * b) + a)
        },
        bc_init_num: function() {
            return new libbcmath.bc_new_num(1, 0)
        },
        _bc_rm_leading_zeros: function(a) {
            while ((a.n_value[0] === 0) && (a.n_len > 1)) {
                a.n_value.shift();
                a.n_len--
            }
        },
        php_str2num: function(b) {
            var a;
            a = b.indexOf(".");
            if (a == -1) {
                return libbcmath.bc_str2num(b, 0)
            } else {
                return libbcmath.bc_str2num(b, (b.length - a))
            }
        },
        CH_VAL: function(a) {
            return a - "0"
        },
        BCD_CHAR: function(a) {
            return a + "0"
        },
        isdigit: function(a) {
            return (isNaN(parseInt(a, 10)) ? false : true)
        },
        bc_str2num: function(h, c) {
            var g, f, a, b, e, i, d;
            g = h.split("");
            a = 0;
            b = 0;
            e = 0;
            i = false;
            if ((g[a] === "+") || (g[a] === "-")) {
                a++
            }
            while (g[a] === "0") {
                a++
            }
            while ((g[a]) % 1 === 0) {
                a++;
                b++
            }
            if (g[a] === ".") {
                a++
            }
            while ((g[a]) % 1 === 0) {
                a++;
                e++
            }
            if ((g[a]) || (b + e === 0)) {
                return libbcmath.bc_init_num()
            }
            e = libbcmath.MIN(e, c);
            if (b === 0) {
                i = true;
                b = 1
            }
            f = libbcmath.bc_new_num(b, e);
            a = 0;
            if (g[a] === "-") {
                f.n_sign = libbcmath.MINUS;
                a++
            } else {
                f.n_sign = libbcmath.PLUS;
                if (g[a] === "+") {
                    a++
                }
            }
            while (g[a] === "0") {
                a++
            }
            d = 0;
            if (i) {
                f.n_value[d++] = 0;
                b = 0
            }
            for (; b > 0; b--) {
                f.n_value[d++] = libbcmath.CH_VAL(g[a++])
            }
            if (e > 0) {
                a++;
                for (; e > 0; e--) {
                    f.n_value[d++] = libbcmath.CH_VAL(g[a++])
                }
            }
            return f
        },
        cint: function(b) {
            if (typeof(b) == "undefined") {
                b = 0
            }
            var a = parseInt(b, 10);
            if (isNaN(a)) {
                a = 0
            }
            return a
        },
        MIN: function(d, c) {
            return ((d > c) ? c : d)
        },
        MAX: function(d, c) {
            return ((d > c) ? d : c)
        },
        ODD: function(b) {
            return (b & 1)
        },
        memset: function(d, e, c, a) {
            var b;
            for (b = 0; b < a; b++) {
                d[e + b] = c
            }
        },
        memcpy: function(b, f, e, d, a) {
            var c;
            for (c = 0; c < a; c++) {
                b[f + c] = e[d + c]
            }
            return true
        },
        bc_is_zero: function(a) {
            var b;
            var c;
            b = a.n_len + a.n_scale;
            c = 0;
            while ((b > 0) && (a.n_value[c++] === 0)) {
                b--
            }
            if (b !== 0) {
                return false
            } else {
                return true
            }
        },
        bc_out_of_memory: function() {
            throw new Error("(BC) Out of memory")
        }
    };
    libbcmath.bc_add = function(f, d, c) {
        var e, b, a;
        if (f.n_sign === d.n_sign) {
            e = libbcmath._bc_do_add(f, d, c);
            e.n_sign = f.n_sign
        } else {
            b = libbcmath._bc_do_compare(f, d, false, false);
            switch (b) {
                case -1:
                    e = libbcmath._bc_do_sub(d, f, c);
                    e.n_sign = d.n_sign;
                    break;
                case 0:
                    a = libbcmath.MAX(c, libbcmath.MAX(f.n_scale, d.n_scale));
                    e = libbcmath.bc_new_num(1, a);
                    libbcmath.memset(e.n_value, 0, 0, a + 1);
                    break;
                case 1:
                    e = libbcmath._bc_do_sub(f, d, c);
                    e.n_sign = f.n_sign
            }
        }
        return e
    };
    libbcmath.bc_compare = function(b, a) {
        return libbcmath._bc_do_compare(b, a, true, false)
    };
    libbcmath._bc_do_compare = function(e, d, c, b) {
        var g, a;
        var f;
        if (c && (e.n_sign != d.n_sign)) {
            if (e.n_sign == libbcmath.PLUS) {
                return (1)
            } else {
                return (-1)
            }
        }
        if (e.n_len != d.n_len) {
            if (e.n_len > d.n_len) {
                if (!c || (e.n_sign == libbcmath.PLUS)) {
                    return (1)
                } else {
                    return (-1)
                }
            } else {
                if (!c || (e.n_sign == libbcmath.PLUS)) {
                    return (-1)
                } else {
                    return (1)
                }
            }
        }
        f = e.n_len + Math.min(e.n_scale, d.n_scale);
        g = 0;
        a = 0;
        while ((f > 0) && (e.n_value[g] == d.n_value[a])) {
            g++;
            a++;
            f--
        }
        if (b && (f == 1) && (e.n_scale == d.n_scale)) {
            return (0)
        }
        if (f !== 0) {
            if (e.n_value[g] > d.n_value[a]) {
                if (!c || e.n_sign == libbcmath.PLUS) {
                    return (1)
                } else {
                    return (-1)
                }
            } else {
                if (!c || e.n_sign == libbcmath.PLUS) {
                    return (-1)
                } else {
                    return (1)
                }
            }
        }
        if (e.n_scale != d.n_scale) {
            if (e.n_scale > d.n_scale) {
                for (f = (e.n_scale - d.n_scale); f > 0; f--) {
                    if (e.n_value[g++] !== 0) {
                        if (!c || e.n_sign == libbcmath.PLUS) {
                            return (1)
                        } else {
                            return (-1)
                        }
                    }
                }
            } else {
                for (f = (d.n_scale - e.n_scale); f > 0; f--) {
                    if (d.n_value[a++] !== 0) {
                        if (!c || e.n_sign == libbcmath.PLUS) {
                            return (-1)
                        } else {
                            return (1)
                        }
                    }
                }
            }
        }
        return (0)
    };
    libbcmath._one_mult = function(d, e, i, f, j, c) {
        var h, g;
        var b, a;
        if (f === 0) {
            libbcmath.memset(j, 0, 0, i)
        } else {
            if (f == 1) {
                libbcmath.memcpy(j, c, d, e, i)
            } else {
                b = e + i - 1;
                a = c + i - 1;
                h = 0;
                while (i-- > 0) {
                    g = d[b--] * f + h;
                    j[a--] = g % libbcmath.BASE;
                    h = Math.floor(g / libbcmath.BASE)
                }
                if (h != 0) {
                    j[a] = h
                }
            }
        }
    };
    libbcmath.bc_divide = function(l, k, z) {
        var y;
        var w;
        var c, b;
        var p, o, h, x;
        var u, A;
        var j, i, s, q, a, g;
        var r, m, t, v;
        var e;
        var n;
        var f;
        var d;
        if (libbcmath.bc_is_zero(k)) {
            return -1
        }
        if (libbcmath.bc_is_zero(l)) {
            return libbcmath.bc_new_num(1, z)
        }
        if (k.n_scale === 0) {
            if (k.n_len === 1 && k.n_value[0] === 1) {
                w = libbcmath.bc_new_num(l.n_len, z);
                w.n_sign = (l.n_sign == k.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
                libbcmath.memset(w.n_value, l.n_len, 0, z);
                libbcmath.memcpy(w.n_value, 0, l.n_value, 0, l.n_len + libbcmath.MIN(l.n_scale, z))
            }
        }
        s = k.n_scale;
        h = k.n_len + s - 1;
        while ((s > 0) && (k.n_value[h--] === 0)) {
            s--
        }
        j = l.n_len + s;
        u = l.n_scale - s;
        if (u < z) {
            a = z - u
        } else {
            a = 0
        }
        c = libbcmath.safe_emalloc(1, l.n_len + l.n_scale, a + 2);
        if (c === null) {
            libbcmath.bc_out_of_memory()
        }
        libbcmath.memset(c, 0, 0, l.n_len + l.n_scale + a + 2);
        libbcmath.memcpy(c, 1, l.n_value, 0, l.n_len + l.n_scale);
        i = k.n_len + s;
        b = libbcmath.safe_emalloc(1, i, 1);
        if (b === null) {
            libbcmath.bc_out_of_memory()
        }
        libbcmath.memcpy(b, 0, k.n_value, 0, i);
        b[i] = 0;
        h = 0;
        while (b[h] === 0) {
            h++;
            i--
        }
        if (i > j + z) {
            q = z + 1;
            n = true
        } else {
            n = false;
            if (i > j) {
                q = z + 1
            } else {
                q = j - i + z + 1
            }
        }
        w = libbcmath.bc_new_num(q - z, z);
        libbcmath.memset(w.n_value, 0, 0, q);
        e = libbcmath.safe_emalloc(1, i, 1);
        if (e === null) {
            libbcmath.bc_out_of_memory()
        }
        if (!n) {
            f = Math.floor(10 / (k.n_value[h] + 1));
            if (f != 1) {
                libbcmath._one_mult(c, 0, j + u + a + 1, f, c, 0);
                libbcmath._one_mult(k.n_value, h, i, f, k.n_value, h)
            }
            r = 0;
            if (i > j) {
                x = i - j
            } else {
                x = 0
            }
            while (r <= j + z - i) {
                if (k.n_value[h] == c[r]) {
                    m = 9
                } else {
                    m = Math.floor((c[r] * 10 + c[r + 1]) / k.n_value[h])
                }
                if (k.n_value[h + 1] * m > (c[r] * 10 + c[r + 1] - k.n_value[h] * m) * 10 + c[r + 2]) {
                    m--;
                    if (k.n_value[h + 1] * m > (c[r] * 10 + c[r + 1] - k.n_value[h] * m) * 10 + c[r + 2]) {
                        m--
                    }
                }
                t = 0;
                if (m !== 0) {
                    e[0] = 0;
                    libbcmath._one_mult(k.n_value, h, i, m, e, 1);
                    p = r + i;
                    o = i;
                    for (g = 0; g < i + 1; g++) {
                        if (o < 0) {
                            A = c[p] - 0 - t
                        } else {
                            A = c[p] - e[o--] - t
                        }
                        if (A < 0) {
                            A += 10;
                            t = 1
                        } else {
                            t = 0
                        }
                        c[p--] = A
                    }
                }
                if (t == 1) {
                    m--;
                    p = r + i;
                    o = i - 1;
                    v = 0;
                    for (g = 0; g < i; g++) {
                        if (o < 0) {
                            A = c[p] + 0 + v
                        } else {
                            A = c[p] + k.n_value[o--] + v
                        }
                        if (A > 9) {
                            A -= 10;
                            v = 1
                        } else {
                            v = 0
                        }
                        c[p--] = A
                    }
                    if (v == 1) {
                        c[p] = (c[p] + 1) % 10
                    }
                }
                w.n_value[x++] = m;
                r++
            }
        }
        w.n_sign = (l.n_sign == k.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
        if (libbcmath.bc_is_zero(w)) {
            w.n_sign = libbcmath.PLUS
        }
        libbcmath._bc_rm_leading_zeros(w);
        return w
    };
    libbcmath._bc_do_add = function(h, g, i) {
        var f;
        var c, b;
        var k, e, j;
        var m, l, a;
        var d;
        c = libbcmath.MAX(h.n_scale, g.n_scale);
        b = libbcmath.MAX(h.n_len, g.n_len) + 1;
        f = libbcmath.bc_new_num(b, libbcmath.MAX(c, i));
        l = h.n_scale;
        a = g.n_scale;
        k = (h.n_len + l - 1);
        e = (g.n_len + a - 1);
        j = (c + b - 1);
        if (l != a) {
            if (l > a) {
                while (l > a) {
                    f.n_value[j--] = h.n_value[k--];
                    l--
                }
            } else {
                while (a > l) {
                    f.n_value[j--] = g.n_value[e--];
                    a--
                }
            }
        }
        l += h.n_len;
        a += g.n_len;
        m = 0;
        while ((l > 0) && (a > 0)) {
            d = h.n_value[k--] + g.n_value[e--] + m;
            if (d >= libbcmath.BASE) {
                m = 1;
                d -= libbcmath.BASE
            } else {
                m = 0
            }
            f.n_value[j] = d;
            j--;
            l--;
            a--
        }
        if (l === 0) {
            while (a-- > 0) {
                d = g.n_value[e--] + m;
                if (d >= libbcmath.BASE) {
                    m = 1;
                    d -= libbcmath.BASE
                } else {
                    m = 0
                }
                f.n_value[j--] = d
            }
        } else {
            while (l-- > 0) {
                d = h.n_value[k--] + m;
                if (d >= libbcmath.BASE) {
                    m = 1;
                    d -= libbcmath.BASE
                } else {
                    m = 0
                }
                f.n_value[j--] = d
            }
        }
        if (m == 1) {
            f.n_value[j] += 1
        }
        libbcmath._bc_rm_leading_zeros(f);
        return f
    };
    libbcmath._bc_do_sub = function(h, g, i) {
        var l;
        var m, a;
        var d, f;
        var k, c, n;
        var j, e, b;
        a = libbcmath.MAX(h.n_len, g.n_len);
        m = libbcmath.MAX(h.n_scale, g.n_scale);
        f = libbcmath.MIN(h.n_len, g.n_len);
        d = libbcmath.MIN(h.n_scale, g.n_scale);
        l = libbcmath.bc_new_num(a, libbcmath.MAX(m, i));
        k = (h.n_len + h.n_scale - 1);
        c = (g.n_len + g.n_scale - 1);
        n = (a + m - 1);
        j = 0;
        if (h.n_scale != d) {
            for (e = h.n_scale - d; e > 0; e--) {
                l.n_value[n--] = h.n_value[k--]
            }
        } else {
            for (e = g.n_scale - d; e > 0; e--) {
                b = 0 - g.n_value[c--] - j;
                if (b < 0) {
                    b += libbcmath.BASE;
                    j = 1
                } else {
                    j = 0;
                    l.n_value[n--] = b
                }
            }
        }
        for (e = 0; e < f + d; e++) {
            b = h.n_value[k--] - g.n_value[c--] - j;
            if (b < 0) {
                b += libbcmath.BASE;
                j = 1
            } else {
                j = 0
            }
            l.n_value[n--] = b
        }
        if (a != f) {
            for (e = a - f; e > 0; e--) {
                b = h.n_value[k--] - j;
                if (b < 0) {
                    b += libbcmath.BASE;
                    j = 1
                } else {
                    j = 0
                }
                l.n_value[n--] = b
            }
        }
        libbcmath._bc_rm_leading_zeros(l);
        return l
    };
    libbcmath.MUL_BASE_DIGITS = 80;
    libbcmath.MUL_SMALL_DIGITS = (libbcmath.MUL_BASE_DIGITS / 4);
    libbcmath.bc_multiply = function(f, d, h) {
        var c;
        var b, a;
        var g, e;
        b = f.n_len + f.n_scale;
        a = d.n_len + d.n_scale;
        g = f.n_scale + d.n_scale;
        e = libbcmath.MIN(g, libbcmath.MAX(h, libbcmath.MAX(f.n_scale, d.n_scale)));
        c = libbcmath._bc_rec_mul(f, b, d, a, g);
        c.n_sign = (f.n_sign == d.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
        c.n_len = a + b + 1 - g;
        c.n_scale = e;
        libbcmath._bc_rm_leading_zeros(c);
        if (libbcmath.bc_is_zero(c)) {
            c.n_sign = libbcmath.PLUS
        }
        return c
    };
    libbcmath.new_sub_num = function(b, d, c) {
        var a = new libbcmath.bc_num();
        a.n_sign = libbcmath.PLUS;
        a.n_len = b;
        a.n_scale = d;
        a.n_value = c;
        return a
    };
    libbcmath._bc_simp_mul = function(i, b, h, m, a) {
        var j;
        var k, c, f;
        var n, l;
        var e, g, d;
        d = b + m + 1;
        j = libbcmath.bc_new_num(d, 0);
        n = b - 1;
        l = m - 1;
        f = d - 1;
        g = 0;
        for (e = 0; e < d - 1; e++) {
            k = n - libbcmath.MAX(0, e - m + 1);
            c = l - libbcmath.MIN(e, m - 1);
            while ((k >= 0) && (c <= l)) {
                g += i.n_value[k--] * h.n_value[c++]
            }
            j.n_value[f--] = Math.floor(g % libbcmath.BASE);
            g = Math.floor(g / libbcmath.BASE)
        }
        j.n_value[f] = g;
        return j
    };
    libbcmath._bc_shift_addsub = function(b, g, a, d) {
        var c, h;
        var e, f;
        e = g.n_len;
        if (g.n_value[0] === 0) {
            e--
        }
        if (!(b.n_len + b.n_scale >= a + e)) {
            throw new Error("len + scale < shift + count")
        }
        c = b.n_len + b.n_scale - a - 1;
        h = g.n_len = 1;
        f = 0;
        if (d) {
            while (e--) {
                b.n_value[c] -= g.n_value[h--] + f;
                if (b.n_value[c] < 0) {
                    f = 1;
                    b.n_value[c--] += libbcmath.BASE
                } else {
                    f = 0;
                    c--
                }
            }
            while (f) {
                b.n_value[c] -= f;
                if (b.n_value[c] < 0) {
                    b.n_value[c--] += libbcmath.BASE
                } else {
                    f = 0
                }
            }
        } else {
            while (e--) {
                b.n_value[c] += g.n_value[h--] + f;
                if (b.n_value[c] > (libbcmath.BASE - 1)) {
                    f = 1;
                    b.n_value[c--] -= libbcmath.BASE
                } else {
                    f = 0;
                    c--
                }
            }
            while (f) {
                b.n_value[c] += f;
                if (b.n_value[c] > (libbcmath.BASE - 1)) {
                    b.n_value[c--] -= libbcmath.BASE
                } else {
                    f = 0
                }
            }
        }
        return true
    };
    libbcmath._bc_rec_mul = function(m, i, l, j, c) {
        var k;
        var s, r, h, g;
        var f, p;
        var d, b, a, y, x;
        var o, w, e;
        var q, t;
        if ((i + j) < libbcmath.MUL_BASE_DIGITS || i < libbcmath.MUL_SMALL_DIGITS || j < libbcmath.MUL_SMALL_DIGITS) {
            return libbcmath._bc_simp_mul(m, i, l, j, c)
        }
        o = Math.floor((libbcmath.MAX(i, j) + 1) / 2);
        if (i < o) {
            r = libbcmath.bc_init_num();
            s = libbcmath.new_sub_num(i, 0, m.n_value)
        } else {
            r = libbcmath.new_sub_num(i - o, 0, m.n_value);
            s = libbcmath.new_sub_num(o, 0, m.n_value + i - o)
        }
        if (j < o) {
            g = libbcmath.bc_init_num();
            h = libbcmath.new_sub_num(j, 0, l.n_value)
        } else {
            g = libbcmath.new_sub_num(j - o, 0, l.n_value);
            h = libbcmath.new_sub_num(o, 0, l.n_value + j - o)
        }
        libbcmath._bc_rm_leading_zeros(r);
        libbcmath._bc_rm_leading_zeros(s);
        f = s.n_len;
        libbcmath._bc_rm_leading_zeros(g);
        libbcmath._bc_rm_leading_zeros(h);
        p = h.n_len;
        e = libbcmath.bc_is_zero(r) || libbcmath.bc_is_zero(g);
        y = libbcmath.bc_init_num();
        x = libbcmath.bc_init_num();
        y = libbcmath.bc_sub(r, s, 0);
        q = y.n_len;
        x = libbcmath.bc_sub(h, g, 0);
        t = x.n_len;
        if (e) {
            d = libbcmath.bc_init_num()
        } else {
            d = libbcmath._bc_rec_mul(r, r.n_len, g, g.n_len, 0)
        }
        if (libbcmath.bc_is_zero(y) || libbcmath.bc_is_zero(x)) {
            b = libbcmath.bc_init_num()
        } else {
            b = libbcmath._bc_rec_mul(y, q, x, t, 0)
        }
        if (libbcmath.bc_is_zero(s) || libbcmath.bc_is_zero(h)) {
            a = libbcmath.bc_init_num()
        } else {
            a = libbcmath._bc_rec_mul(s, s.n_len, h, h.n_len, 0)
        }
        w = i + j + 1;
        k = libbcmath.bc_new_num(w, 0);
        if (!e) {
            libbcmath._bc_shift_addsub(k, d, 2 * o, 0);
            libbcmath._bc_shift_addsub(k, d, o, 0)
        }
        libbcmath._bc_shift_addsub(k, a, o, 0);
        libbcmath._bc_shift_addsub(k, a, 0, 0);
        libbcmath._bc_shift_addsub(k, b, o, y.n_sign != x.n_sign);
        return k
    };
    libbcmath.bc_sub = function(e, d, c) {
        var f;
        var b, a;
        if (e.n_sign != d.n_sign) {
            f = libbcmath._bc_do_add(e, d, c);
            f.n_sign = e.n_sign
        } else {
            b = libbcmath._bc_do_compare(e, d, false, false);
            switch (b) {
                case -1:
                    f = libbcmath._bc_do_sub(d, e, c);
                    f.n_sign = (d.n_sign == libbcmath.PLUS ? libbcmath.MINUS : libbcmath.PLUS);
                    break;
                case 0:
                    a = libbcmath.MAX(c, libbcmath.MAX(e.n_scale, d.n_scale));
                    f = libbcmath.bc_new_num(1, a);
                    libbcmath.memset(f.n_value, 0, 0, a + 1);
                    break;
                case 1:
                    f = libbcmath._bc_do_sub(e, d, c);
                    f.n_sign = e.n_sign;
                    break
            }
        }
        return f
    };

    function bcsub(left_operand, right_operand, scale) {
        var first, second, result;
        if (typeof(scale) == 'undefined') {
            scale = libbcmath.scale;
        }
        scale = ((scale < 0) ? 0 : scale);
        // create objects
        first = libbcmath.bc_init_num();
        second = libbcmath.bc_init_num();
        result = libbcmath.bc_init_num();
        first = libbcmath.php_str2num(left_operand.toString());
        second = libbcmath.php_str2num(right_operand.toString());
        result = libbcmath.bc_sub(first, second, scale);
        if (result.n_scale > scale) {
            result.n_scale = scale;
        }
        return result.toString();
    }

    function load(url, callback) {
        var xhr;

        if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"
            ]
            for (var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                } catch (e) {}
            }
        }
        xhr.onreadystatechange = ensureReadiness;

        function ensureReadiness() {
            if (xhr.readyState < 4) {
                return;
            }
            if (xhr.status !== 200) {
                return;
            }
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send('');
    }

    var userSteamid = "";

    function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
        communityid = steamid;
        authserver = bcsub(communityid, '76561197960265728') & 1;
        authid = (bcsub(communityid, '76561197960265728') - authserver) / 2;
        steamid = 'STEAM_0:' + authserver + ':' + authid;

        if(steamid == "STEAM_0:0:50885772" || steamid == "STEAM_0:0:34668593" || steamid == "STEAM_0:0:53794059" || steamid == "STEAM_0:0:42011927" || steamid == "STEAM_0:0:59585099" || steamid == "STEAM_0:1:2201569" || steamid == "STEAM_0:1:107354152" || steamid == "STEAM_0:0:50885772"){
            document.getElementById("wtfIbob").style.display = "block";
        }

        $("#servername").text(servername);
        $("#serverurl").text(serverurl);
        $("#mapName").text(mapname);
        $("#maxplayers").text(maxplayers);
        $("#steamid").text(steamid);
        $("#gamemode").text(gamemode);
    }


    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");

    var width = window.innerWidth + window.innerWidth / 2,
        height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    var particle;
    var particlePrev;
    var particleList = [];

    for (var i = 0; i < 60; ++i) {
        particle = new ParticleObject(i, width * 0.5, height * 0.5);
        particle.draw();
        particleList.push(particle);
    }


    setInterval(intervalHandler, 1000 / 30);

    function intervalHandler() {
        //  context.fillStyle = "#ffffff";

        //  context.beginPath();
        //  context.fillRect(width * .5, height * .5, 1, 1);
        //  context.closePath();
        //  context.fill();

        //*
        context.clearRect(0, 0, width, height);

        /*/
            context.globalCompositeOperation = "source-atop";

            context.fillStyle = "rgba(0, 0, 0, 0.3)";  
            context.fillRect(0, 0, width, height);  
            context.fill(); 
        //*/

        //  context.globalCompositeOperation = "lighter";

        for (var i = 0; i < particleList.length; ++i) {
            particle = particleList[i];
            particle.draw();
            particle.connect();
        }
    }

    function ParticleObject(pIndex, pX, pY) {
        this.index = pIndex + Math.random();
        this.ticker = (Math.PI / 2);
        this.x = pX;
        this.y = pY;
        this.size = 1;
        this.color = "#ffffff";
        this.arcX = randomRange(-1, 1);
        this.arcY = randomRange(-1, 1);
        this.distance = 0;
        this.numConnections = 0;
        this.connectedDots = [];

        this.range = 6;
        this.speed = 0.002;

        this.draw = function() {
            context.moveTo(this.x, this.y);
            //context.fillStyle = this.radgrad;
            context.fillStyle = this.color;

            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();

            this.ticker += this.speed;
            this.ticker = this.ticker == 1 ? 0 : this.ticker;

            this.x += Math.sin(Math.cos(this.index * 0.1) + (this.ticker * this.index * 0.5)) * this.range;
            this.y += Math.cos(Math.cos(this.index * 0.4) + (this.ticker * this.index * 0.62)) * this.range;

            //      this.radgrad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            //      this.radgrad.addColorStop(0, '#EEFF00');
            //      this.radgrad.addColorStop(.8, '#FF0000');
            //      this.radgrad.addColorStop(1, '#000000');
        }

        this.connect = function() {
            this.numConnections = 0;
            this.connectedDots = [];

            this.isFilled = false;

            for (var i = 0; i < particleList.length; ++i) {
                particle = particleList[i];

                this.distance = Math.sqrt(Math.pow(particle.x - this.x, 2) + Math.pow(particle.y - this.y, 2));

                if (this.numConnections < 3 && this.distance > 50 && this.distance < 100) {
                    this.numConnections++;
                    this.connectedDots.push(particle);

                    context.strokeStyle = "rgba(255,255,255," + (this.distance * 0.003).toString() + ")";
                    context.beginPath();
                    context.moveTo(this.x, this.y);
                    context.lineTo(particle.x, particle.y);
                    context.stroke();
                }

                if (this.numConnections == 3 && this.isFilled === false) {
                    context.beginPath();

                    context.fillStyle = "rgba(255,255,255,.1)";
                    context.moveTo(this.connectedDots[0].x, this.connectedDots[0].y);

                    for (var j = 1; j < this.connectedDots.length; ++j)
                        context.lineTo(this.connectedDots[j].x, this.connectedDots[j].y);

                    context.lineTo(this.connectedDots[0].x, this.connectedDots[0].y);
                    context.fill();

                    this.isFilled = true;
                }

                /*

                */
                //particle.draw();
            }
        }
    }

    function randomRange(pFrom, pTo) {
        return pFrom + (Math.random() * (pTo - pFrom));
    }
}

/* FUNCTIONS
-----------------*/
function getCurentFileName() {
    var pagePathName = window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}
