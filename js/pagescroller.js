/*
 *	Page Scroller - jQuery Plugin (minified)
 *	Simple plugin to create a smooth scrolling page with updating links
 *
 *	Support at: http://dairien.com
 *
 *	Copyright (c) 2012 Dairien Boyd. All Rights Reserved
 *
 *	Version: BETA - IE Still Unsupported (2/2/2012)
 *	Requires: jQuery v1.3+
 *
 *	This library is released under the BSD license:
 *	
 *	Redistribution and use in source and binary forms, with or without
 *	modification, are permitted provided that the following conditions are met:
 *	
 *	Redistributions of source code must retain the above copyright notice, this
 *	list of conditions and the following disclaimer. Redistributions in binary
 *	form must reproduce the above copyright notice, this list of conditions and
 *	the following disclaimer in the documentation and/or other materials
 *	provided with the distribution. Neither the name Dairirien Boyd nor
 *	the names of its contributors may be used to endorse or promote products
 *	derived from this software without specific prior written permission. 
 *	
 *	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *	AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *	IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *	ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 *	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 *	LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 *	OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 *	DAMAGE.
 *
 */
var pageScroller = {};
(function (c) {
    c.fn.extend({
        pageScroller: function (f) {
            f = c.extend({
                currentSection: 0,
                sectionClass: "section",
                navigationClass: "scrollNav",
                animationSpeed: 500,
                scrollOffset: 20,
                navigation: [],
                animationBefore: function () {},
                animationComplete: function () {},
                onChange: function () {}
            }, f);
            pageScroll = function (d, a) {
                c.fx.interval = 5;
                d.append('<ul class="pageScroll"></ul>');
                pageScroller.navi = c(".pageScroll", d);
                pageScroller.navi.addClass("left");
                pageScroller.sections = c("." + a.sectionClass, d);
                pageScroller.scrollDocument = c(document);
                pageScroller.scrollWindow = c(window);
                pageScroller.scrollBody = c("body");
                pageScroller.scrollPosition = pageScroller.scrollWindow.scrollTop();
                pageScroller.currentSection = pageScroller.scrollWindow.height();
                pageScroller.options = a;
                d.css({
                    position: "relative"
                });
                pageScroller.sections.each(function (b) {
                    var d = c(this);
                    d.css({
                        position: "relative",
                        margin: 0
                    });
                    d.addClass(pageScroller.options.sectionClass + "_" + (b + 1));
                    pageScroller.options.navigation.length ? pageScroller.navi.append('<li class="' + a.navigationClass + " " + a.navigationClass + "_" + (b + 1) + '"><a href="#pageScroll' + b + '">' + pageScroller.options.navigation[b] + "</a></li>") : pageScroller.navi.append('<li class="' + a.navigationClass + " " + a.navigationClass + "_" + (b + 1) + '"><a href="#pageScroll' + b + '">Navigation ' + (b + 1) + "</a></li>")
                });
                pageScroller.pageLinks = c("li", pageScroller.navi);
                pageScroller.pageLinks.each(function (b) {
                    pageLink = c(this);
                    pageAnchor = c("a", this);
                    pageAnchor.click(function (c) {
                        c.preventDefault();
                        a.animationBefore();
			g(d, b); //HACK: MAKE NAV LINK ACTIVED BEFORE ANIMATION 
			e(d, pageScroller.sections.eq(b), b)
                    })
                });
                pageScroller.next = function () {
                    var b = pageScroller.options.currentSection + 1;
                    if (b != pageScroller.sections.length) {
                        var a = pageScroller.sections.eq(b);
                        e(d, a, b)
                    }
                };
                pageScroller.prev = function () {
                    var b = pageScroller.options.currentSection - 1;
                    0 >= b && (b = 0);
                    var a = pageScroller.sections.eq(b);
                    e(d, a, b)
                };
                pageScroller.goTo = function (a) {
                    var a = a - 1,
                        c = pageScroller.sections.eq(a);
                    e(d, c, a)
                };
                pageScroller.scrollWindow.scroll(function () {
                    h()
                });
                setTimeout(function () {
                    0 == pageScroller.scrollPosition && h()
                }, 200)
            };
            var h = function () {
                    pageScroller.scrollPosition = pageScroller.scrollWindow.scrollTop();
                    pageScroller.scrollDistance = pageScroller.scrollPosition + pageScroller.currentSection;
                    for (i = 0; i < pageScroller.sections.length; i++) {
                        var d = pageScroller.sections.eq(i).offset().top;
                        pageScroller.options.scrollOffset && (d -= pageScroller.options.scrollOffset);
                        var a = 0;
                        if (i < pageScroller.sections.length - 1) var a = pageScroller.sections.eq(i + 1),
                            a = pageScroller.options.scrollOffset ? a.offset().top - pageScroller.options.scrollOffset : a.offset().top,
                            b = pageScroller.pageLinks.eq(i),
                            c = pageScroller.pageLinks.eq(pageScroller.sections.length - 1);
                        if (pageScroller.scrollBody.is(":animated")) return !1;
                        if (pageScroller.scrollDocument.height() == pageScroller.scrollDistance) {
                            if (!c.hasClass("active")) return updateTo = pageScroller.sections.length - 1, g(pageScroll, updateTo), !1
                        } else if (a) {
                            if (pageScroller.scrollPosition >= d && pageScroller.scrollPosition < a && !b.hasClass("active")) return updateTo = i, g(pageScroll, updateTo), !1
                        } else if (pageScroller.scrollPosition >= d && i == pageScroller.sections.length - 1 && !pageScroller.pageLinks.eq(pageScroller.sections.length - 1).hasClass("active")) return updateTo = pageScroller.sections.length - 1, g(pageScroll, updateTo), !1
                    }
                },
                e = function (d, a, b) {
                    a = a.offset().top;
                    pageScroller.options.scrollOffset && (a -= pageScroller.options.scrollOffset);
                    var e = c("html, body"),
                        f = c(window).scrollTop();
                    a != f && !e.is(":animated") && e.animate(
			{ scrollTop: a }, 
			{
				duration : pageScroller.options.animationSpeed, 
				easing : 'easeOutQuint', //HACK: ADD EASING EFFECT

				complete: function () {
					g(d, b);
					pageScroller.options.animationComplete()
				}
		    	}
		    )
                },
                g = function (c, a) {
                    pageScroller.pageLinks.removeClass("active");
                    pageScroller.pageLinks.eq(a).addClass("active");
                    pageScroller.options.currentSection = a;
                    pageScroller.options.onChange()
                };
            if (!pageScroller.options) return pageScroll(this, f)
        }
    })
})(jQuery);

