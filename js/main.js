/*
 * Author: Steven Kao 
 * Email: st.kao.05@gmail.com
 */
 
/* ---------------------------------- */

/*
 *
 *  TABLE OF CONTENTS
 *
 *  PageScroller
 *  Page Display Logic
 *  Windows Hashing
 *  Navigation
 *  Quicksand
 *  Year Fading Effect 
 *
 */
 
/* ---------------------------------- */


//Global DOM element states
var ABOUT_PAGE_HASH = "aboutPage"
var REPORT_PAGE_HASH = "reportPage" 
var PAGE_FADE_IN_DURATION = 900;
var PAGE_FADE_OUT_DURATION = 700;


var menuOn = true;
var pageScrollerOn = true;
var contactActived = false;
var currentlyDisplayPage = null;
var currentlyDisplayPageLabel = null;



$(document).ready(function() {

/* PageScroller */

        var PAGE_MARK_LIST_INDEX_LIST = [22, 44, 68, 88]; 

	var setPageScroller = function() {
		
		$("#logo").addClass("pageMark");
                
		//setup page mark
		$("#primaryList li").each(function(index, element){
			if(jQuery.inArray(index, PAGE_MARK_LIST_INDEX_LIST) != -1){
				$(element).addClass("pageMark");
			}
		});


		$('body').pageScroller({
			sectionClass : "pageMark",
			animationSpeed: 2000,
			scrollOffset: 186,
			animationBefore: function(pageScroller, a){
			}
		});
	}

	setPageScroller(); 

	var resetPageScroller = function() {
		$("#logo").removeClass();
		$("#primaryList .pageMark").removeClass();
		$("ul.pageScroll").remove();
		pageScroller = {};
	      	setPageScroller();  
	}

/* ---------------------------------- */

/* Page Display Logic */

	/* menu item helper*/
       	var setNavItemActivated = function(navItem) {
		$("#nav li a").removeClass("activated");
		navItem.addClass("activated");
	} 

	var setCurrentPage = function() {
		var hash = window.location.hash.slice(1);

		if(hash == ABOUT_PAGE_HASH) { 
			setNavItemActivated($("#nav .aboutLink"));
			currentlyDisplayPageLabel = $("#aboutPageLabel");
			currentlyDisplayPage = $("#about")
			$("#main h1 a").removeClass("homePageMode")
			pageScrollerOn = false;
		}
		else if(hash == REPORT_PAGE_HASH) { 
			setNavItemActivated($("#nav .reportLink"));
			currentlyDisplayPageLabel = $("#reportPageLabel");
			currentlyDisplayPage = $("#report")
			$("#main h1 a").removeClass("homePageMode")
			pageScrollerOn = false;
		}
		else {
			setNavItemActivated($("#nav .homeLink"));
			currentlyDisplayPageLabel = $("#worksPageLabel");
			currentlyDisplayPage = $("#works")
			$("#main h1 a").addClass("homePageMode")
			pageScrollerOn = true;
		}
	}

	setCurrentPage();

	//display  
	currentlyDisplayPage.fadeIn(PAGE_FADE_IN_DURATION);
	currentlyDisplayPageLabel.fadeIn(PAGE_FADE_IN_DURATION);
	if(pageScrollerOn) {
		$("ul.pageScroll").fadeIn(PAGE_FADE_IN_DURATION);
	}
	else {
		$("ul.pageScroll").hide(PAGE_FADE_IN_DURATION);
	}
        
	//when a nav link is clicked
	$(window).bind('hashchange', function (){ 

		currentlyDisplayPageLabel.fadeOut(PAGE_FADE_OUT_DURATION);

		currentlyDisplayPage.fadeOut(PAGE_FADE_OUT_DURATION, function(){
			setCurrentPage();
			currentlyDisplayPage.fadeIn(PAGE_FADE_IN_DURATION);
			currentlyDisplayPageLabel.fadeIn(PAGE_FADE_IN_DURATION);

			if(pageScrollerOn) {
				$("ul.pageScroll").fadeIn(PAGE_FADE_IN_DURATION);
			}
			else {
				$("ul.pageScroll").fadeOut(PAGE_FADE_IN_DURATION);
			}
		}); 
	});


	//When the same link is clicked
	$("#nav .aboutLink").click(function(){
		if(window.location.hash.slice(1) == ABOUT_PAGE_HASH) {
			$("#about").fadeOut(300, function() {
				$("#about").fadeIn(500)
			})
		}
	})

	$("#nav .reportLink").click(function(){
		if(window.location.hash.slice(1) == REPORT_PAGE_HASH) {
			$("#report").fadeOut(300, function() {
				$("#report").fadeIn(500)
			})
		}
	})
	
	$("#nav .homeLink, h1 a[href='#']").click(function(){
		if(window.location.hash.slice(1) == "") {
			$("#works").fadeOut(300, function() {
				$("#works").fadeIn(500)
			})
		}
	})
/* ---------------------------------- */



	
/* Navigation */
	var toggleMenu = function() {
        	if(menuOn) {
			$("#nav p").fadeOut(300);

			$("#nav ul ul li").animate({
				right : '-320px'
			}, {
			 	duration : 1000
			});
		}
		else {
			$("#nav ul ul li").animate({
				right : '0px'
			}, {
			 	duration : 1000
			});
			
		}

		menuOn = !menuOn;
	}

	$(window).scroll(function(){

                if(menuOn && $(window).scrollTop() > $("#works").offset().top) {
			toggleMenu();
		}        
		else if(!menuOn && $(window).scrollTop() <= $("#works").offset().top) {
			toggleMenu();
		}


	});

	$("#nav input[type='button']").click(function(){
		toggleMenu();
	});

	$("#nav .contactLink").click(function(){
		if(contactActived) {
			$("#nav p").fadeOut(300);
		}else {
			$("#nav p").fadeIn(300);
		}
		contactActived =! contactActived;
	});

/* ---------------------------------- */

	
/* Quicksand */

	/*
	 *
	 * A series link element must have 
	 * 1. taxonomyId
	 * 2. enTitle
	 * 3. zhTitle
	 *
	 */

	var originalList = $("#primaryList").clone(true, true);

	$("#primaryList").on("click", ".series", function(eventObj){
		
                var targetSerie = eventObj.target;

		var targetDataId = $(targetSerie).parents("li[data-id]").attr("data-id");
		var taxonomyId = $(targetSerie).attr("taxonomyId");

		//copy get all the poster that are in the same serie
		var matchingListItems = $("#primaryList .series[taxonomyId=" + taxonomyId + "]").parents("li[data-id]").clone(true, true);
		matchingListItems.sort(function(listItem1, listItem2){
			
			/*
			var dataId1 = parseInt($(listItem1).attr("data-id"));
			var dataId2 = parseInt($(listItem2).attr("data-id"));

			return dataId1 - dataId2;
			*/
			
			var year1 = parseInt($(listItem1).find(".year").text());
			var year2 = parseInt($(listItem2).find(".year").text());

			return year1 - year2;
		});

		var seriesList = originalList.clone(true, true);

		//Find the correct place to insert the series item
		var prevListItem = seriesList.find("li[data-id=" + targetDataId + "]");

		do {
			var prevListItem = prevListItem.prev();

			var filteredItem = matchingListItems.filter(function() {
				return prevListItem.attr("data-id") == $(this).attr("data-id");
			});

		}
                while(filteredItem.length != 0)

                //if target is What's new
		if(prevListItem.length == 0) {
			prevListItem = seriesList.find("li[data-id='emptyPlaceHolder']");
		}
		
		//remove all items that are in the same series 
		seriesList.find(".series[taxonomyId=" + taxonomyId + "]").parents("li[data-id]").remove(); 
	
		//list item for displaying series item in the lightbox loop
                var hiddenMatchingListItems = matchingListItems.clone(true, true);
		hiddenMatchingListItems.css("display", "none");
                hiddenMatchingListItems.each(function(index, element){
			$(element).attr("data-id", 200 + index);
		})


		//make lightbox loop for series only
		matchingListItems.find("a[rel^='lightbox']").attr("rel", "lightbox-series");

		//insert the grouped series list items
		prevListItem.after(matchingListItems);
		prevListItem.after(hiddenMatchingListItems);

		//insert seriesTitle
		var seriesTitle = $('<li data-id=""><h4><h6><span class="close"></span><span lang="zh"></span><span lang="en"></span></h6></h4></li>');
		seriesTitle.find("[lang='zh']").append($(targetSerie).attr("zhTitle"));
		seriesTitle.find("[lang='en']").append($(targetSerie).attr("enTitle"));
		seriesTitle.attr("data-id", "seriesTitle" + taxonomyId)

		prevListItem.after(seriesTitle);

		$("#primaryList").quicksand(seriesList.find("li"), {
			duration: 800
		}, function(){
			resetPageScroller();
		
			var seriesItems = $("#primaryList .series[taxonomyId=" + 
				taxonomyId + "]").parents("li[data-id]");
			
			seriesItems.addClass("seriesMode");

			$("#primaryList a[rel^='lightbox']").slimbox({
				overlayOpacity: 0.6,
				resizeDuration: 600,
				loop : true
			}, null, function(el) {
				return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
			});
		});

	});
	
	/*
	 * When someone click close on the series
	 */
	$("body").on("click", ".close", function(){
		$("#primaryList").quicksand(originalList.find("li"), {
			duration: 800
		}, function(){

			resetPageScroller();
			
			$("a[rel^='lightbox']").slimbox({
				overlayOpacity: 0.6,
				resizeDuration: 600,
				loop : true
			}, null, function(el) {
				return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
			});
		});
	});	

/* ---------------------------------- */

	
/* Year Fading Effect */

	$(".works").on("mouseover", "li", function(){
		$(this).find(".year").addClass("selected");
	});
	
	$(".works").on("mouseout", "li", function(){
		$(this).find(".year").removeClass("selected");
	});


/* ---------------------------------- */

	
});
