﻿/*
 * Ext.ux.DatePickerPlus  Addon
 * Ext.ux.form.DateFieldPlus  Addon
 *
 * V 1.4 beta 2
 *
 * @author    Marco Wienkoop (wm003/lubber)
 * @copyright (c) 2008, Marco Wienkoop (marco.wienkoop@lubber.de) http://www.lubber.de
 */

Date.prototype.getFirstDateOfWeek = function(startDay) {
    if (typeof startDay === "undefined") {
        startDay = (Ext.DatePicker ? Ext.DatePicker.prototype.startDay : 0);
    }
    var dayDiff = this.getDay() - startDay;
    if (dayDiff < 0) {
        dayDiff += 7;
    }
    return this.add(Date.DAY, -dayDiff);
};
Array.prototype.sortDates = function() {
    return this.sort(function(a, b) {
        return a.getTime() - b.getTime();
    });
};
if (!Ext.util.EasterDate) {
    Ext.util.EasterDate = function(year, plusDays) {
        if (typeof year === "undefined") {
            year = new Date().getFullYear();
        }
        year = parseInt(year, 10);
        if (typeof plusDays === "undefined") {
            plusDays = 0;
        }
        plusDays = parseInt(plusDays, 10);
        var a = year % 19;
        var d = (19 * a + 24) % 30;
        var diffDay = d + (2 * (year % 4) + 4 * (year % 7) + 6 * d + 5) % 7;
        if ((diffDay == 35) || ((diffDay == 34) && (d == 28) && (a > 10))) {
            diffDay -= 7;
        }
        var EasterDate = new Date(year, 2, 22);
        EasterDate.setTime(EasterDate.getTime() + 86400000 * diffDay + 86400000 * plusDays);
        return EasterDate;
    };
}
Ext.namespace('Ext.ux', 'Ext.ux.form');
Ext.ux.DatePickerPlus = Ext.extend(Ext.DatePicker, {version:"1.4",noOfMonth:1,noOfMonthPerRow:3,fillupRows:true,eventDates:function(year) {
    return[];
},styleDisabledDates:false,eventDatesSelectable:true,defaultEventDatesText:'',defaultEventDatesCls:'x-datepickerplus-eventdates',setEventDates:function(edArray, update) {
    if (typeof update === "undefined") {
        update = true;
    }
    this.edArray = [];
    for (var i = 0,il = edArray.length; i < il; ++i) {
        if (Ext.isDate(edArray[i])) {
            this.edArray.push({date:edArray[i],text:this.defaultEventDatesText,cls:this.defaultEventDatesCls});
        }
        else if (edArray[i].date) {
            edArray[i].date = this.jsonDate(edArray[i].date);
            this.edArray.push(edArray[i]);
        }
    }
    this.eventDates = function(year) {
        return this.edArray;
    };
    if (this.rendered && update) {
        this.eventDatesNumbered = this.convertCSSDatesToNumbers(this.eventDates(this.activeDate.getFullYear()));
        this.update(this.activeDate);
    }
},eventDatesRE:false,eventDatesRECls:'',eventDatesREText:'',showWeekNumber:true,weekName:"Wk.",selectWeekText:"Click to select all days of this week",selectMonthText:"Click to select all weeks of this month",multiSelection:false,multiSelectByCTRL:true,selectedDates:[],prevNextDaysView:"mark",preSelectedDates:[],lastSelectedDate:false,markNationalHolidays:true,nationalHolidaysCls:'x-datepickerplus-nationalholidays',nationalHolidays:function(year) {
    year = (typeof year === "undefined" ? (this.lastRenderedYear ? this.lastRenderedYear : new Date().getFullYear()) : parseInt(year, 10));
    var dayOfJan01 = new Date(year, 0, 1).getDay();
    var dayOfFeb01 = new Date(year, 1, 1).getDay();
    var dayOfMay01 = new Date(year, 4, 1).getDay();
    var dayOfSep01 = new Date(year, 8, 1).getDay();
    var dayOfOct01 = new Date(year, 9, 1).getDay();
    var dayOfNov01 = new Date(year, 10, 1).getDay();
    var holidays = [
        {
            text:"New Year's Day",
            date:new Date(year, 0, 1)
        },
        {
            text:"Martin Luther King Day",
            date:new Date(year, 0, (dayOfJan01 > 1 ? 16 + 7 - dayOfJan01 : 16 - dayOfJan01))
        },
        {
            text:"Washington's Birthday",
            date:new Date(year, 1, (dayOfFeb01 > 1 ? 16 + 7 - dayOfFeb01 : 16 - dayOfFeb01))
        },
        {
            text:"Memorial Day",
            date:new Date(year, 4, (dayOfMay01 == 6 ? 31 : 30 - dayOfMay01))
        },
        {
            text:"Independence Day",
            date:new Date(year, 6, 4)
        },
        {
            text:"Labor Day",
            date:new Date(year, 8, (dayOfSep01 > 1 ? 2 + 7 - dayOfSep01 : 2 - dayOfSep01))
        },
        {
            text:"Columbus Day",
            date:new Date(year, 9, (dayOfOct01 > 1 ? 9 + 7 - dayOfOct01 : 9 - dayOfOct01))
        },
        {
            text:"Veterans Day",
            date:new Date(year, 10, 11)
        },
        {
            text:"Thanksgiving Day",
            date:new Date(year, 10, (dayOfNov01 > 4 ? 26 + 7 - dayOfNov01 : 26 - dayOfNov01))
        },
        {
            text:"Christmas Day",
            date:new Date(year, 11, 25)
        }
    ];
    return holidays;
},markWeekends:true,weekendCls:'x-datepickerplus-weekends',weekendText:'',weekendDays:[6,0],useQuickTips:true,pageKeyWarp:1,maxSelectionDays:false,maxSelectionDaysTitle:'Datepicker',maxSelectionDaysText:'You can only select a maximum amount of %0 days',undoText:"Undo",stayInAllowedRange:true,summarizeHeader:false,resizable:false,renderOkUndoButtons:true,renderTodayButton:true,disablePartialUnselect:true,allowedDates:false,allowedDatesText:'',strictRangeSelect:false,displayMask:3,displayMaskText:'Please wait...',renderPrevNextButtons:true,renderPrevNextYearButtons:false,disableMonthPicker:false,nextYearText:"Next Year (Control+Up)",prevYearText:"Previous Year (Control+Down)",showActiveDate:false,shiftSpaceSelect:true,disabledLetter:false,allowMouseWheel:true,focus:Ext.emptyFn,initComponent:function() {
    Ext.ux.DatePickerPlus.superclass.initComponent.call(this);
    this.noOfMonthPerRow = this.noOfMonthPerRow > this.noOfMonth ? this.noOfMonth : this.noOfMonthPerRow;
    this.addEvents('beforeyearchange', 'afteryearchange', 'beforemonthchange', 'aftermonthchange', 'beforemonthclick', 'beforeweekclick', 'beforedateclick', 'aftermonthclick', 'afterweekclick', 'afterdateclick', 'undo', 'beforemousewheel', 'beforemaxdays');
},activeDateKeyNav:function(direction) {
    if (this.showActiveDate) {
        this.activeDate = this.activeDate.add("d", direction);
        var adCell = this.activeDateCell.split("#");
        var tmpMonthCell = parseInt(adCell[0], 10);
        var tmpDayCell = parseInt(adCell[1], 10);
        var currentGetCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
        if ((tmpDayCell + direction > 41 && tmpMonthCell + 1 >= this.cellsArray.length) || (tmpDayCell + direction < 0 && tmpMonthCell - 1 < 0)) {
            this.update(this.activeDate);
        }
        else {
            currentGetCell.removeClass("x-datepickerplus-activedate");
            tmpDayCell += direction;
            if (tmpDayCell > 41) {
                tmpDayCell -= 42;
                tmpMonthCell++;
            }
            else if (tmpDayCell < 0) {
                tmpDayCell += 42;
                tmpMonthCell--;
            }
            currentGetCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
            currentGetCell.addClass("x-datepickerplus-activedate");
            this.activeDateCell = tmpMonthCell + "#" + tmpDayCell;
        }
    }
},handleMouseWheel:function(e) {
    if (this.fireEvent("beforemousewheel", this, e) !== false) {
        var oldStartMonth = (this.activeDate ? this.activeDate.getMonth() : 99);
        var oldStartYear = (this.activeDate ? this.activeDate.getFullYear() : 0);
        Ext.ux.DatePickerPlus.superclass.handleMouseWheel.call(this, e);
        var newStartMonth = (this.activeDate ? this.activeDate.getMonth() : 999);
        var newStartYear = (this.activeDate ? this.activeDate.getFullYear() : 9999);
        if (oldStartMonth != newStartMonth) {
            this.fireEvent("aftermonthchange", this, oldStartMonth, newStartMonth);
        }
        if (oldStartYear != newStartYear) {
            this.fireEvent("afteryearchange", this, oldStartYear, newStartYear);
        }
    }
},doDisabled:function(disabled) {
    this.keyNav.setDisabled(disabled);
    if (this.renderPrevNextButtons) {
        this.leftClickRpt.setDisabled(disabled);
        this.rightClickRpt.setDisabled(disabled);
    }
    if (this.renderPrevNextYearButtons) {
        this.leftYearClickRpt.setDisabled(disabled);
        this.rightYearClickRpt.setDisabled(disabled);
    }
    if (this.todayBtn) {
        this.todayKeyListener.setDisabled(disabled);
        this.todayBtn.setDisabled(disabled);
    }
},onRender:function(container, position) {
    if (this.noOfMonthPerRow === 0) {
        this.noOfMonthPerRow = 1;
    }
    if (this.fillupRows && this.noOfMonthPerRow > 1 && this.noOfMonth % this.noOfMonthPerRow !== 0) {
        this.noOfMonth += (this.noOfMonthPerRow - (this.noOfMonth % this.noOfMonthPerRow));
    }
    var addIEClass = (Ext.isIE ? ' x-datepickerplus-ie' : '');
    var m = ['<table cellspacing="0"',(this.multiSelection ? ' class="x-date-multiselect' + addIEClass + '" ' : (addIEClass !== '' ? 'class="' + addIEClass + '" ' : '')),'>'];
    m.push("<tr>");
    var widfaker = (Ext.isIE ? '<img src="' + Ext.BLANK_IMAGE_URL + '" />' : '');
    var weekNumberQuickTip = (this.multiSelection ? (this.useQuickTips ? ' ext:qtip="' + this.selectWeekText + '" ' : ' title="' + this.selectWeekText + '" ') : '');
    var weekEndQuickTip = (this.markWeekends && this.weekendText !== '' ? (this.useQuickTips ? ' ext:qtip="' + this.weekendText + '" ' : ' title="' + this.weekendText + '" ') : '');
    var mpre = ['<thead><tr>'];
    if (this.showWeekNumber) {
        mpre.push('<th class="x-date-weeknumber-header"><a href="#" hidefocus="on" class="x-date-weeknumber" tabIndex="1"><em><span ', (this.multiSelection ? (this.useQuickTips ? ' ext:qtip="' + this.selectMonthText + '" ' : ' title="' + this.selectMonthText + '" ') : ''), '>' + this.weekName + '</span></em></a></th>');
    }
    var dn = this.dayNames;
    for (var i = 0; i < 7; ++i) {
        var d = this.startDay + i;
        if (d > 6) {
            d = d - 7;
        }
        mpre.push('<th><span>', dn[d].substr(0, 1), '</span></th>');
    }
    mpre.push('</tr></thead><tbody><tr>');
    if (this.showWeekNumber) {
        mpre.push('<td class="x-date-weeknumber-cell"><a href="#" hidefocus="on" class="x-date-weeknumber" tabIndex="1"><em><span ', weekNumberQuickTip, '></span></em></a></td>');
    }
    for (var k = 0; k < 42; ++k) {
        if (k % 7 === 0 && k > 0) {
            if (this.showWeekNumber) {
                mpre.push('</tr><tr><td class="x-date-weeknumber-cell"><a href="#" hidefocus="on" class="x-date-weeknumber" tabIndex="1"><em><span ', weekNumberQuickTip, '></span></em></a></td>');
            } else {
                mpre.push('</tr><tr>');
            }
        }
        mpre.push('<td class="x-date-date-cell"><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span ', (this.weekendDays.indexOf((k + this.startDay) % 7) != -1 ? weekEndQuickTip : ''), '></span></em></a></td>');
    }
    mpre.push('</tr></tbody></table></td></tr></table></td>');
    var prerenderedMonth = mpre.join("");
    if (this.summarizeHeader && this.noOfMonth > 1) {
        m.push('<td align="center" id="', this.id, '-summarize" colspan="', this.noOfMonthPerRow, '" class="x-date-middle x-date-pickerplus-middle"></td></tr>');
        m.push("<tr>");
    }
    for (var x = 0,xk = this.noOfMonth; x < xk; ++x) {
        m.push('<td><table class="x-date-pickerplus', (x % this.noOfMonthPerRow === 0 ? '' : ' x-date-monthtable'), (!this.prevNextDaysView ? " x-date-pickerplus-prevnexthide" : ""), '" cellspacing="0"><tr>');
        if (x === 0) {
            m.push('<td class="x-date-left">');
            if (this.renderPrevNextButtons) {
                m.push('<a class="npm" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.prevText + '" ' : ' title="' + this.prevText + '" '), '></a>');
            }
            if (this.renderPrevNextYearButtons) {
                m.push('<a class="npy" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.prevYearText + '" ' : ' title="' + this.prevYearText + '" '), '></a>');
            }
            m.push('</td>');
        }
        else if (x == this.noOfMonthPerRow - 1) {
            if (this.renderPrevNextButtons) {
                m.push('<td class="x-date-dummy x-date-middle">', widfaker, '</td>');
            }
        }
        m.push("<td class='x-date-middle x-date-pickerplus-middle", (x === 0 && !this.disableMonthPicker ? " x-date-firstMonth" : ""), "' align='center'>");
        if (x > 0 || this.disableMonthPicker) {
            m.push('<span id="', this.id, '-monthLabel', x, '"></span>');
        }
        m.push('</td>');
        if (x == this.noOfMonthPerRow - 1) {
            m.push('<td class="x-date-right">');
            if (this.renderPrevNextButtons) {
                m.push('<a class="npm" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.nextText + '" ' : ' title="' + this.nextText + '" '), '></a>');
            }
            if (this.renderPrevNextYearButtons) {
                m.push('<a class="npy" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.nextYearText + '" ' : ' title="' + this.nextYearText + '" '), '></a>');
            }
            m.push('</td>');
        }
        else if (x === 0) {
            if (this.renderPrevNextButtons) {
                m.push('<td class="x-date-dummy x-date-middle">', widfaker, '</td>');
            }
        }
        m.push('</tr><tr><td', (x === 0 || x == this.noOfMonthPerRow - 1 ? ' colspan="3" ' : ''), '><table class="x-date-inner" id="', this.id, '-inner-date', x, '" cellspacing="0">');
        m.push(prerenderedMonth);
        if ((x + 1) % this.noOfMonthPerRow === 0) {
            m.push("</tr><tr>");
        }
    }
    m.push('</tr>');
    m.push('<tr><td', (this.noOfMonthPerRow > 1 ? ' colspan="' + this.noOfMonthPerRow + '"' : ''), ' class="x-date-bottom" align="center"><div><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="right" class="x-date-multiokbtn">', widfaker, '</td><td align="center" class="x-date-todaybtn">', widfaker, '</td><td align="left" class="x-date-multiundobtn">', widfaker, '</td></tr></table></div></td></tr>');
    m.push('</table><div class="x-date-mp"></div>');
    var el = document.createElement("div");
    el.className = "x-date-picker";
    el.innerHTML = m.join("");
    container.dom.insertBefore(el, position);
    this.el = Ext.get(el);
    this.eventEl = Ext.get(el.firstChild);
    if (this.renderPrevNextButtons) {
        this.leftClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-left a.npm"), {handler:this.showPrevMonth,scope:this,preventDefault:true,stopDefault:true});
        this.rightClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-right a.npm"), {handler:this.showNextMonth,scope:this,preventDefault:true,stopDefault:true});
    }
    if (this.renderPrevNextYearButtons) {
        this.leftYearClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-left a.npy"), {handler:this.showPrevYear,scope:this,preventDefault:true,stopDefault:true});
        this.rightYearClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-right a.npy"), {handler:this.showNextYear,scope:this,preventDefault:true,stopDefault:true});
    }
    if (this.allowMouseWheel) {
        this.eventEl.on("mousewheel", this.handleMouseWheel, this);
    }
    this.keyNav = new Ext.KeyNav(this.eventEl, {"left":function(e) {
        (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextButtons) ? this.showPrevMonth() : this.activeDateKeyNav(-1));
    },"right":function(e) {
        (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextButtons) ? this.showNextMonth() : this.activeDateKeyNav(1));
    },"up":function(e) {
        (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextYearButtons) ? this.showNextYear() : this.activeDateKeyNav(-7));
    },"down":function(e) {
        (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextYearButtons) ? this.showPrevYear() : this.activeDateKeyNav(7));
    },"pageUp":function(e) {
        if (!this.disabled) {
            this.update(this.activeDate.add("mo", this.pageKeyWarp * (-1)));
        }
    },"pageDown":function(e) {
        if (!this.disabled) {
            this.update(this.activeDate.add("mo", this.pageKeyWarp));
        }
    },"enter":function(e) {
        e.stopPropagation();
        if (!this.disabled) {
            if (this.multiSelection) {
                this.okClicked();
            }
            else {
                this.finishDateSelection(this.activeDate);
            }
        }
        return true;
    },scope:this});
    if (!this.disableSingleDateSelection) {
        this.eventEl.on("click", this.handleDateClick, this, {delegate:"a.x-date-date"});
    }
    if (this.multiSelection && this.showWeekNumber) {
        this.eventEl.on("click", this.handleWeekClick, this, {delegate:"a.x-date-weeknumber"});
    }
    this.cellsArray = [];
    this.textNodesArray = [];
    this.weekNumberCellsArray = [];
    this.weekNumberTextElsArray = [];
    this.weekNumberHeaderCellsArray = [];
    var cells,textNodes,weekNumberCells,weekNumberTextEls,weekNumberHeaderCells;
    for (var xx = 0,xxk = this.noOfMonth; xx < xxk; ++xx) {
        cells = Ext.get(this.id + '-inner-date' + xx).select("tbody td.x-date-date-cell");
        textNodes = Ext.get(this.id + '-inner-date' + xx).query("tbody td.x-date-date-cell span");
        this.cellsArray[xx] = cells;
        this.textNodesArray[xx] = textNodes;
        if (this.showWeekNumber) {
            weekNumberCells = Ext.get(this.id + '-inner-date' + xx).select("tbody td.x-date-weeknumber-cell");
            weekNumberTextEls = Ext.get(this.id + '-inner-date' + xx).select("tbody td.x-date-weeknumber-cell span");
            this.weekNumberCellsArray[xx] = weekNumberCells;
            this.weekNumberTextElsArray[xx] = weekNumberTextEls;
            weekNumberHeaderCells = Ext.get(this.id + '-inner-date' + xx).select("th.x-date-weeknumber-header");
            this.weekNumberHeaderCellsArray[xx] = weekNumberHeaderCells;
        }
    }
    if (!this.disableMonthPicker) {
        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');
        this.mbtn = new Ext.Button({text:"&#160;",tooltip:this.monthYearText,renderTo:this.el.child("td.x-date-firstMonth", true)});
        this.mbtn.on('click', this.showMonthPickerPlus, this);
        this.mbtn.el.child('em').addClass('x-btn-arrow');
    }
    if (this.renderTodayButton || this.showToday) {
        this.todayKeyListener = this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.spaceKeyPressed, this);
        var today = new Date().dateFormat(this.format);
        this.todayBtn = new Ext.Button({renderTo:this.el.child("td.x-date-bottom .x-date-todaybtn", true),text:String.format(this.todayText, today),tooltip:String.format(this.todayTip, today),handler:this.selectToday,scope:this});
    }
    if (this.multiSelection && this.renderOkUndoButtons) {
        this.OKBtn = new Ext.Button({renderTo:this.el.child("td.x-date-bottom .x-date-multiokbtn", true),text:this.okText,handler:this.okClicked,scope:this});
        this.undoBtn = new Ext.Button({renderTo:this.el.child("td.x-date-bottom .x-date-multiundobtn", true),text:this.undoText,handler:function() {
            if (!this.disabled) {
                this.fireEvent("undo", this, this.preSelectedDates);
                this.preSelectedDates = [];
                for (var i = 0,il = this.selectedDates.length; i < il; ++i) {
                    this.preSelectedDates.push(this.selectedDates[i].clearTime().getTime());
                }
                this.update(this.activeDate);
            }
        },scope:this});
    }
    if (Ext.isIE) {
        this.el.repaint();
    }
    this.preSelectedDates = [];
    for (var sdc = 0,sdcl = this.selectedDates.length; sdc < sdcl; ++sdc) {
        this.preSelectedDates.push(this.selectedDates[sdc].clearTime().getTime());
    }
    this.update(this.value);
},showMonthPickerPlus:function() {
    if (!this.disabled) {
        this.showMonthPicker();
    }
},convertCSSDatesToNumbers:function(objarr) {
    var converted = [
        [],
        [],
        []
    ];
    for (var i = 0,il = objarr.length; i < il; ++i) {
        converted[0][i] = objarr[i].date.clearTime().getTime();
        converted[1][i] = (objarr[i].text ? objarr[i].text : this.defaultEventDatesText);
        converted[2][i] = (objarr[i].cls ? objarr[i].cls : this.defaultEventDatesCls);
    }
    return converted;
},clearSelectedDates:function(update) {
    if (typeof update === "undefined") {
        update = true;
    }
    this.selectedDates = [];
    this.preSelectedDates = [];
    if (this.rendered && update) {
        this.update(this.activeDate);
    }
},jsonDate:function(dates) {
    if (!Ext.isArray(dates)) {
        if (typeof dates === "string") {
            return Date.parseDate(dates.replace(/T/, " "), 'Y-m-d H:i:s');
        }
    }
    else {
        for (var i = 0,il = dates.length; i < il; i++) {
            if (typeof dates[i] === "string") {
                dates[i] = Date.parseDate(dates[i].replace(/T/, " "), 'Y-m-d H:i:s');
            }
        }
    }
    return dates;
},setSelectedDates:function(dates, update) {
    if (typeof update === "undefined") {
        update = true;
    }
    dates = this.jsonDate(dates);
    if (!Ext.isArray(dates)) {
        dates = [dates];
    }
    var d,dt;
    for (var i = 0,il = dates.length; i < il; ++i) {
        d = dates[i];
        dt = d.clearTime().getTime();
        if (this.preSelectedDates.indexOf(dt) == -1) {
            this.preSelectedDates.push(dt);
            this.selectedDates.push(d);
        }
    }
    if (this.rendered && update) {
        this.update(this.activeDate);
    }
},setAllowedDates:function(dates, update) {
    if (typeof update === "undefined") {
        update = true;
    }
    this.allowedDates = this.jsonDate(dates);
    if (this.rendered && update) {
        this.update(this.activeDate);
    }
},setMinDate:function(minDate) {
    this.minDate = this.jsonDate(minDate);
    this.update(this.value, true);
},setMaxDate:function(maxDate) {
    this.maxDate = this.jsonDate(maxDate);
    this.update(this.value, true);
},setDateLimits:function(minDate, maxDate) {
    this.minDate = this.jsonDate(minDate);
    this.maxDate = this.jsonDate(maxDate);
    this.update(this.value, true);
},update:function(date, forceRefresh, masked) {
    if (typeof masked === "undefined") {
        masked = false;
    }
    if (typeof forceRefresh === "undefined") {
        forceRefresh = false;
    }
    if (forceRefresh) {
        var ad = this.activeDate;
        this.activeDate = null;
        date = ad;
    }
    var dMask = (this.displayMask && (isNaN(this.displayMask) || this.noOfMonth > this.displayMask) ? true : false);
    if (!masked && dMask) {
        this.el.mask(this.displayMaskText);
        this.update.defer(10, this, [date,false,true]);
        return false;
    }
    if (this.stayInAllowedRange && (this.minDate || this.maxDate)) {
        if (this.minDate && (this.minDate.getFullYear() > date.getFullYear() || (this.minDate.getMonth() > date.getMonth() && this.minDate.getFullYear() == date.getFullYear()))) {
            date = new Date(this.minDate.getTime());
        }
        else if (this.maxDate && (this.maxDate.getFullYear() < date.getFullYear() || (this.maxDate.getMonth() < date.getMonth() && this.maxDate.getFullYear() == date.getFullYear()))) {
            date = new Date(this.maxDate.getTime());
        }
    }
    var newStartMonth = date.getMonth();
    var oldStartMonth = (this.activeDate ? this.activeDate.getMonth() : newStartMonth);
    var newStartYear = date.getFullYear();
    var oldStartYear = (this.activeDate ? this.activeDate.getFullYear() : newStartYear);
    if (oldStartMonth != newStartMonth) {
        this.fireEvent("beforemonthchange", this, oldStartMonth, newStartMonth);
    }
    if (oldStartYear != newStartYear) {
        this.fireEvent("beforeyearchange", this, oldStartYear, newStartYear);
    }
    this.activeDate = date.clearTime();
    this.preSelectedCells = [];
    this.lastSelectedDateCell = '';
    this.activeDateCell = '';
    var lsd = (this.lastSelectedDate ? this.lastSelectedDate : 0);
    var today = new Date().clearTime().getTime();
    var min = this.minDate ? this.minDate.clearTime().getTime() : Number.NEGATIVE_INFINITY;
    var max = this.maxDate ? this.maxDate.clearTime().getTime() : Number.POSITIVE_INFINITY;
    var ddMatch = this.disabledDatesRE;
    var ddText = this.disabledDatesText;
    var ddays = this.disabledDays ? this.disabledDays.join("") : false;
    var ddaysText = this.disabledDaysText;
    var edMatch = this.eventDatesRE;
    var edCls = this.eventDatesRECls;
    var edText = this.eventDatesREText;
    var adText = this.allowedDatesText;
    var format = this.format;
    var adt = this.activeDate.getTime();
    this.todayMonthCell = false;
    this.todayDayCell = false;
    if (this.allowedDates) {
        this.allowedDatesT = [];
        for (var k = 0,kl = this.allowedDates.length; k < kl; ++k) {
            this.allowedDatesT.push(this.allowedDates[k].clearTime().getTime());
        }
    }
    var setCellClass = function(cal, cell, textnode, d) {
        var foundday,eCell = Ext.get(cell),eTextNode = Ext.get(textnode),t = d.getTime(),tiptext = false,fvalue;
        cell.title = "";
        cell.firstChild.dateValue = t;
        var dfY = d.getFullYear();
        if (cal.lastRenderedYear !== dfY) {
            cal.lastRenderedYear = dfY;
            if (cal.markNationalHolidays) {
                cal.nationalHolidaysNumbered = cal.convertCSSDatesToNumbers(cal.nationalHolidays(dfY));
            }
            cal.eventDatesNumbered = cal.convertCSSDatesToNumbers(cal.eventDates(dfY));
        }
        if (t < min) {
            cell.className = " x-date-disabled";
            tiptext = cal.minText;
        }
        if (t > max) {
            cell.className = " x-date-disabled";
            tiptext = cal.maxText;
        }
        if (ddays) {
            if (ddays.indexOf(d.getDay()) != -1) {
                tiptext = ddaysText;
                cell.className = " x-date-disabled";
            }
        }
        if (ddMatch && format) {
            fvalue = d.dateFormat(format);
            if (ddMatch.test(fvalue)) {
                tiptext = ddText.replace("%0", fvalue);
                cell.className = " x-date-disabled";
            }
        }
        if (cal.allowedDates && cal.allowedDatesT.indexOf(t) == -1) {
            cell.className = " x-date-disabled";
            tiptext = adText;
        }
        if (cal.markWeekends && cal.weekendDays.indexOf(d.getDay()) != -1 && !eCell.hasClass('x-date-disabled')) {
            eCell.addClass(cal.weekendCls);
        }
        if (!eCell.hasClass('x-date-disabled') || cal.styleDisabledDates) {
            if (cal.eventDatesNumbered[0].length > 0) {
                foundday = cal.eventDatesNumbered[0].indexOf(t);
                if (foundday != -1) {
                    if (cal.eventDatesNumbered[2][foundday] !== "") {
                        eCell.addClass(cal.eventDatesNumbered[2][foundday] + (cal.eventDatesSelectable ? "" : "-disabled"));
                        tiptext = (cal.eventDatesNumbered[1][foundday] !== "" ? cal.eventDatesNumbered[1][foundday] : false);
                    }
                }
            }
            if (edMatch && format) {
                fvalue = d.dateFormat(format);
                if (edMatch.test(fvalue)) {
                    tiptext = edText.replace("%0", fvalue);
                    cell.className = edCls;
                }
            }
        }
        if (!eCell.hasClass('x-date-disabled')) {
            if (cal.markNationalHolidays && cal.nationalHolidaysNumbered[0].length > 0) {
                foundday = cal.nationalHolidaysNumbered[0].indexOf(t);
                if (foundday != -1) {
                    eCell.addClass(cal.nationalHolidaysCls);
                    tiptext = (cal.nationalHolidaysNumbered[1][foundday] !== "" ? cal.nationalHolidaysNumbered[1][foundday] : false);
                }
            }
            if (cal.preSelectedDates.indexOf(t) != -1) {
                eCell.addClass("x-date-selected");
                cal.preSelectedCells.push(cell.firstChild.monthCell + "#" + cell.firstChild.dayCell);
            }
            if (t == lsd) {
                cal.lastSelectedDateCell = cell.firstChild.monthCell + "#" + cell.firstChild.dayCell;
            }
        }
        else if (cal.disabledLetter) {
            textnode.innerHTML = cal.disabledLetter;
        }
        if (t == today) {
            eCell.addClass("x-date-today");
            tiptext = cal.todayText;
        }
        if (cal.showActiveDate && t == adt && cal.activeDateCell === '') {
            eCell.addClass("x-datepickerplus-activedate");
            cal.activeDateCell = cell.firstChild.monthCell + "#" + cell.firstChild.dayCell;
        }
        if (tiptext) {
            if (cal.useQuickTips) {
                Ext.QuickTips.register({target:eTextNode,text:tiptext});
            }
            else {
                cell.title = tiptext;
            }
        }
    };
    var cells,textEls,days,firstOfMonth,startingPos,pm,prevStart,d,sel,i,intDay,weekNumbers,weekNumbersTextEls,curWeekStart,weekNumbersHeader,monthLabel,main,w;
    var summarizeHTML = [];
    for (var x = 0,xk = this.noOfMonth; x < xk; ++x) {
        if (this.summarizeHeader && this.noOfMonth > 1 && (x === 0 || x == this.noOfMonth - 1)) {
            summarizeHTML.push(this.monthNames[date.getMonth()], " ", date.getFullYear());
            if (x === 0) {
                summarizeHTML.push(" - ");
            }
        }
        cells = this.cellsArray[x].elements;
        textEls = this.textNodesArray[x];
        if ((this.markNationalHolidays || this.eventDates.length > 0) && this.useQuickTips) {
            for (var e = 0,el = textEls.length; e < el; ++e) {
                Ext.QuickTips.unregister(textEls[e]);
            }
        }
        days = date.getDaysInMonth();
        firstOfMonth = date.getFirstDateOfMonth();
        startingPos = firstOfMonth.getDay() - this.startDay;
        if (startingPos <= this.startDay) {
            startingPos += 7;
        }
        pm = date.add("mo", -1);
        prevStart = pm.getDaysInMonth() - startingPos;
        days += startingPos;
        d = new Date(pm.getFullYear(), pm.getMonth(), prevStart).clearTime();
        i = 0;
        if (this.showWeekNumber) {
            weekNumbers = this.weekNumberCellsArray[x].elements;
            weekNumbersTextEls = this.weekNumberTextElsArray[x].elements;
            curWeekStart = new Date(d);
            curWeekStart.setDate(curWeekStart.getDate() + 7);
            weekNumbersHeader = this.weekNumberHeaderCellsArray[x].elements;
            weekNumbersHeader[0].firstChild.monthValue = date.getMonth();
            weekNumbersHeader[0].firstChild.dateValue = curWeekStart.getTime();
            weekNumbersHeader[0].firstChild.monthCell = x;
            weekNumbersHeader[0].firstChild.dayCell = 0;
            while (i < weekNumbers.length) {
                weekNumbersTextEls[i].innerHTML = curWeekStart.getWeekOfYear();
                weekNumbers[i].firstChild.dateValue = curWeekStart.getTime();
                weekNumbers[i].firstChild.monthCell = x;
                weekNumbers[i].firstChild.dayCell = (i * 7);
                curWeekStart.setDate(curWeekStart.getDate() + 7);
                i++;
            }
            i = 0;
        }
        for (; i < startingPos; ++i) {
            textEls[i].innerHTML = (++prevStart);
            cells[i].firstChild.monthCell = x;
            cells[i].firstChild.dayCell = i;
            d.setDate(d.getDate() + 1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i], textEls[i], d);
        }
        for (; i < days; ++i) {
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            cells[i].firstChild.monthCell = x;
            cells[i].firstChild.dayCell = i;
            d.setDate(d.getDate() + 1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i], textEls[i], d);
            if (d.getTime() == today) {
                this.todayMonthCell = x;
                this.todayDayCell = i;
            }
        }
        var extraDays = 0;
        for (; i < 42; ++i) {
            textEls[i].innerHTML = (++extraDays);
            cells[i].firstChild.monthCell = x;
            cells[i].firstChild.dayCell = i;
            d.setDate(d.getDate() + 1);
            cells[i].className = "x-date-nextday";
            setCellClass(this, cells[i], textEls[i], d);
        }
        if (x === 0 && !this.disableMonthPicker) {
            this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());
        }
        else {
            monthLabel = Ext.get(this.id + '-monthLabel' + x);
            monthLabel.update(this.monthNames[date.getMonth()] + " " + date.getFullYear());
        }
        date = date.add('mo', 1);
        if (!this.internalRender) {
            main = this.el.dom.firstChild;
            w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Ext.fly(main).setWidth(w);
            this.internalRender = true;
        }
    }
    if (this.summarizeHeader && this.noOfMonth > 1) {
        var topHeader = Ext.get(this.id + '-summarize');
        topHeader.update(summarizeHTML.join(""));
    }
    this.el.unmask();
    if (oldStartMonth != newStartMonth) {
        this.fireEvent("aftermonthchange", this, oldStartMonth, newStartMonth);
    }
    if (oldStartYear != newStartYear) {
        this.fireEvent("afteryearchange", this, oldStartYear, newStartYear);
    }
},beforeDestroy:function() {
    if (this.rendered) {
        this.keyNav.disable();
        this.keyNav = null;
        if (this.renderPrevNextButtons) {
            Ext.destroy(this.leftClickRpt, this.rightClickRpt);
        }
        if (this.renderPrevNextYearButtons) {
            Ext.destroy(this.leftYearClickRpt, this.rightYearClickRpt);
        }
        if (!this.disableMonthPicker) {
            Ext.destroy(this.monthPicker, this.mbtn);
        }
        if (this.todayBtn) {
            this.todayBtn.destroy();
        }
        if (this.OKBtn) {
            this.OKBtn.destroy();
        }
        if (this.undoBtn) {
            this.undoBtn.destroy();
        }
        this.eventEl.destroy();
    }
},handleWeekClick:function(e, t) {
    if (!this.disabled) {
        e.stopEvent();
        var startweekdate = new Date(t.dateValue).getFirstDateOfWeek(this.startDay),amount = 0,startmonth,curmonth,enableUnselect;
        var monthcell = t.monthCell;
        var daycell = t.dayCell;
        switch (t.parentNode.tagName.toUpperCase()) {case"TH":amount = 42;startmonth = t.monthValue;break;case"TD":amount = 7;break;
        }
        if ((amount == 42 && this.fireEvent("beforemonthclick", this, startmonth, this.lastStateWasSelected) !== false) || (amount == 7 && this.fireEvent("beforeweekclick", this, startweekdate, this.lastStateWasSelected) !== false)) {
            if (!Ext.EventObject.ctrlKey && this.multiSelectByCTRL) {
                this.removeAllPreselectedClasses();
            }
            enableUnselect = true;
            if (this.disablePartialUnselect) {
                var teststartweekdate = startweekdate;
                for (var k = 0; k < amount; ++k) {
                    curmonth = teststartweekdate.getMonth();
                    if ((amount == 7 || curmonth === startmonth) && this.preSelectedDates.indexOf(teststartweekdate.clearTime().getTime()) == -1) {
                        enableUnselect = false;
                        break;
                    }
                    teststartweekdate = teststartweekdate.add(Date.DAY, 1);
                }
            }
            var reverseAdd = false;
            var dateAdder = 1;
            if (this.strictRangeSelect && ((this.preSelectedDates.indexOf(startweekdate.add(Date.DAY, -1).clearTime().getTime()) == -1 && !enableUnselect) || (this.preSelectedDates.indexOf(startweekdate.add(Date.DAY, -1).clearTime().getTime()) != -1 && enableUnselect))) {
                reverseAdd = true;
                startweekdate = startweekdate.add(Date.DAY, amount - 1);
                dateAdder = -1;
            }
            this.maxNotified = false;
            for (var i = 0,ni; i < amount; ++i) {
                curmonth = startweekdate.getMonth();
                ni = (reverseAdd ? amount - 1 - i : i);
                if (amount == 7 || curmonth === startmonth) {
                    this.markDateAsSelected(startweekdate.clearTime().getTime(), true, monthcell, daycell + ni, enableUnselect);
                }
                startweekdate = startweekdate.add(Date.DAY, dateAdder);
            }
            if (amount == 42) {
                this.fireEvent("aftermonthclick", this, startmonth, this.lastStateWasSelected);
            }
            else {
                this.fireEvent("afterweekclick", this, new Date(t.dateValue).getFirstDateOfWeek(this.startDay), this.lastStateWasSelected);
            }
        }
    }
},markDateAsSelected:function(t, fakeCTRL, monthcell, daycell, enableUnselect) {
    var currentGetCell = Ext.get(this.cellsArray[monthcell].elements[daycell]);
    if ((currentGetCell.hasClass("x-date-prevday") || currentGetCell.hasClass("x-date-nextday")) && this.prevNextDaysView !== "mark") {
        return false;
    }
    if (this.multiSelection && (Ext.EventObject.ctrlKey || fakeCTRL)) {
        var beforeDate = new Date(t).add(Date.DAY, -1).clearTime().getTime();
        var afterDate = new Date(t).add(Date.DAY, 1).clearTime().getTime();
        if (this.preSelectedDates.indexOf(t) == -1) {
            if (this.maxSelectionDays === this.preSelectedDates.length) {
                if (!this.maxNotified) {
                    if (this.fireEvent("beforemaxdays", this) !== false) {
                        Ext.Msg.alert(this.maxSelectionDaysTitle, this.maxSelectionDaysText.replace(/%0/, this.maxSelectionDays));
                    }
                    this.maxNotified = true;
                }
                return false;
            }
            if (currentGetCell.hasClass("x-date-disabled")) {
                return false;
            }
            if (this.strictRangeSelect && this.preSelectedDates.indexOf(afterDate) == -1 && this.preSelectedDates.indexOf(beforeDate) == -1 && this.preSelectedDates.length > 0) {
                return false;
            }
            this.preSelectedDates.push(t);
            this.markSingleDays(monthcell, daycell, false);
            this.markGhostDatesAlso(monthcell, daycell, false);
            this.lastStateWasSelected = true;
        }
        else {
            if (enableUnselect && (!this.strictRangeSelect || (this.strictRangeSelect && ((this.preSelectedDates.indexOf(afterDate) == -1 && this.preSelectedDates.indexOf(beforeDate) != -1) || (this.preSelectedDates.indexOf(afterDate) != -1 && this.preSelectedDates.indexOf(beforeDate) == -1))))) {
                this.preSelectedDates.remove(t);
                this.markSingleDays(monthcell, daycell, true);
                this.markGhostDatesAlso(monthcell, daycell, true);
                this.lastStateWasSelected = false;
            }
        }
    }
    else {
        this.removeAllPreselectedClasses();
        this.preSelectedDates = [t];
        this.preSelectedCells = [];
        this.markSingleDays(monthcell, daycell, false);
        this.markGhostDatesAlso(monthcell, daycell, false);
        this.lastStateWasSelected = true;
    }
    this.lastSelectedDate = t;
    this.lastSelectedDateCell = monthcell + "#" + daycell;
    if (this.multiSelection && !this.renderOkUndoButtons) {
        this.copyPreToSelectedDays();
    }
    return true;
},markSingleDays:function(monthcell, daycell, remove) {
    if (!remove) {
        Ext.get(this.cellsArray[monthcell].elements[daycell]).addClass("x-date-selected");
        this.preSelectedCells.push((monthcell) + "#" + (daycell));
    }
    else {
        Ext.get(this.cellsArray[monthcell].elements[daycell]).removeClass("x-date-selected");
        this.preSelectedCells.remove((monthcell) + "#" + (daycell));
    }
},markGhostDatesAlso:function(monthcell, daycell, remove) {
    if (this.prevNextDaysView == "mark") {
        var currentGetCell = Ext.get(this.cellsArray[monthcell].elements[daycell]),dayCellDiff;
        if (currentGetCell.hasClass("x-date-prevday") && monthcell > 0) {
            dayCellDiff = (5 - Math.floor(daycell / 7)) * 7;
            if (Ext.get(this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff]).hasClass("x-date-nextday")) {
                dayCellDiff -= 7;
            }
            this.markSingleDays(monthcell - 1, daycell + dayCellDiff, remove);
        }
        else if (currentGetCell.hasClass("x-date-nextday") && monthcell < this.cellsArray.length - 1) {
            dayCellDiff = 28;
            if (this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML != this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                dayCellDiff = 35;
            }
            this.markSingleDays(monthcell + 1, daycell - dayCellDiff, remove);
        }
        else if (currentGetCell.hasClass("x-date-active") && ((daycell < 14 && monthcell > 0) || (daycell > 27 && monthcell < this.cellsArray.length - 1))) {
            if (daycell < 14) {
                dayCellDiff = 28;
                if (!Ext.get(this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff]).hasClass("x-date-nextday")) {
                    dayCellDiff = 35;
                }
                if (daycell + dayCellDiff < 42 && this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML == this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                    this.markSingleDays(monthcell - 1, daycell + dayCellDiff, remove);
                }
            }
            else {
                dayCellDiff = 28;
                if (!Ext.get(this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff]).hasClass("x-date-prevday")) {
                    dayCellDiff = 35;
                }
                if (daycell - dayCellDiff >= 0 && this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML == this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                    this.markSingleDays(monthcell + 1, daycell - dayCellDiff, remove);
                }
            }
        }
    }
},removeAllPreselectedClasses:function() {
    for (var e = 0,el = this.preSelectedCells.length; e < el; ++e) {
        var position = this.preSelectedCells[e].split("#");
        Ext.get(this.cellsArray[position[0]].elements[position[1]]).removeClass("x-date-selected");
    }
    this.preSelectedDates = [];
    this.preSelectedCells = [];
},handleDateClick:function(e, t) {
    e.stopEvent();
    var tp = Ext.fly(t.parentNode);
    if (!this.disabled && t.dateValue && !tp.hasClass("x-date-disabled") && !tp.hasClass("x-datepickerplus-eventdates-disabled") && this.fireEvent("beforedateclick", this, t) !== false) {
        if ((!tp.hasClass("x-date-prevday") && !tp.hasClass("x-date-nextday")) || this.prevNextDaysView == "mark") {
            var eO = Ext.EventObject;
            if ((!eO.ctrlKey && this.multiSelectByCTRL) || eO.shiftKey || !this.multiSelection) {
                this.removeAllPreselectedClasses();
            }
            var ctrlfaker = (((!eO.ctrlKey && !this.multiSelectByCTRL) || eO.shiftKey) && this.multiSelection ? true : false);
            if (eO.shiftKey && this.multiSelection && this.lastSelectedDate) {
                var startdate = this.lastSelectedDate;
                var targetdate = t.dateValue;
                var dayDiff = (startdate < targetdate ? 1 : -1);
                var lsdCell = this.lastSelectedDateCell.split("#");
                var tmpMonthCell = parseInt(lsdCell[0], 10);
                var tmpDayCell = parseInt(lsdCell[1], 10);
                var testCell,ghostCounter = 0,ghostplus = 0;
                this.maxNotified = false;
                var firstVisibleDate = this.activeDate.getFirstDateOfMonth().clearTime().getTime();
                var lastVisibleDate = this.activeDate.add(Date.MONTH, this.noOfMonth - 1).getLastDateOfMonth().clearTime().getTime();
                if (startdate < firstVisibleDate || startdate > lastVisibleDate) {
                    var min = this.minDate ? this.minDate.clearTime().getTime() : Number.NEGATIVE_INFINITY;
                    var max = this.maxDate ? this.maxDate.clearTime().getTime() : Number.POSITIVE_INFINITY;
                    var ddays = this.disabledDays ? this.disabledDays.join("") : "";
                    var ddMatch = this.disabledDatesRE;
                    var format = this.format;
                    var allowedDatesT = this.allowedDates ? this.allowedDatesT : false;
                    var d,ddMatchResult,fvalue;
                    while (startdate < firstVisibleDate || startdate > lastVisibleDate) {
                        d = new Date(startdate);
                        ddMatchResult = false;
                        if (ddMatch) {
                            fvalue = d.dateFormat(format);
                            ddMatchResult = ddMatch.test(fvalue);
                        }
                        if (!(startdate < min) && !(startdate > max) && ddays.indexOf(d.getDay()) == -1 && !ddMatchResult && (!allowedDatesT || allowedDatesT.indexOf(startdate) != -1)) {
                            if (this.maxSelectionDays === this.preSelectedDates.length) {
                                if (this.fireEvent("beforemaxdays", this) !== false) {
                                    Ext.Msg.alert(this.maxSelectionDaysTitle, this.maxSelectionDaysText.replace(/%0/, this.maxSelectionDays));
                                }
                                break;
                            }
                            this.preSelectedDates.push(startdate);
                        }
                        startdate = new Date(startdate).add(Date.DAY, dayDiff).clearTime().getTime();
                    }
                    tmpMonthCell = (dayDiff > 0 ? 0 : this.cellsArray.length - 1);
                    tmpDayCell = (dayDiff > 0 ? 0 : 41);
                    testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                    while (testCell.hasClass("x-date-prevday") || testCell.hasClass("x-date-nextday")) {
                        testCell.addClass("x-date-selected");
                        this.preSelectedCells.push((tmpMonthCell) + "#" + (tmpDayCell));
                        tmpDayCell += dayDiff;
                        testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                    }
                }
                while ((targetdate - startdate) * dayDiff > 0 && tmpMonthCell >= 0 && tmpMonthCell < this.cellsArray.length) {
                    this.markDateAsSelected(startdate, ctrlfaker, tmpMonthCell, tmpDayCell, true);
                    startdate = new Date(startdate).add(Date.DAY, dayDiff).clearTime().getTime();
                    testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                    if (testCell.hasClass("x-date-active")) {
                        ghostCounter = 0;
                    }
                    else {
                        ghostCounter++;
                    }
                    tmpDayCell += dayDiff;
                    if (tmpDayCell == 42) {
                        tmpMonthCell++;
                        tmpDayCell = (ghostCounter >= 7 ? 14 : 7);
                    }
                    else if (tmpDayCell < 0) {
                        tmpMonthCell--;
                        tmpDayCell = 34;
                        testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                        if (testCell.hasClass("x-date-nextday") || ghostCounter == 7) {
                            tmpDayCell = 27;
                        }
                    }
                }
            }
            this.markDateAsSelected(t.dateValue, ctrlfaker, t.monthCell, t.dayCell, true);
            this.finishDateSelection(new Date(t.dateValue));
        }
    }
},copyPreToSelectedDays:function() {
    this.selectedDates = [];
    for (var i = 0,il = this.preSelectedDates.length; i < il; ++i) {
        this.selectedDates.push(new Date(this.preSelectedDates[i]));
    }
},okClicked:function() {
    this.copyPreToSelectedDays();
    this.selectedDates = this.selectedDates.sortDates();
    this.fireEvent("select", this, this.selectedDates);
},spaceKeyPressed:function(e) {
    var ctrlfaker = (((!Ext.EventObject.ctrlKey && !this.multiSelectByCTRL) || Ext.EventObject.shiftKey) && this.multiSelection ? true : false);
    if (!this.disabled && this.shiftSpaceSelect == Ext.EventObject.shiftKey && this.showActiveDate) {
        var adCell = this.activeDateCell.split("#");
        var tmpMonthCell = parseInt(adCell[0], 10);
        var tmpDayCell = parseInt(adCell[1], 10);
        this.markDateAsSelected(this.activeDate.getTime(), ctrlfaker, tmpMonthCell, tmpDayCell, true);
        this.finishDateSelection(this.activeDate);
    }
    else {
        this.selectToday();
    }
},finishDateSelection:function(date) {
    this.setValue(date);
    if (this.multiSelection) {
        this.fireEvent("afterdateclick", this, date, this.lastStateWasSelected);
    }
    else {
        this.fireEvent("afterdateclick", this, date, this.lastStateWasSelected);
        this.fireEvent("select", this, this.value);
    }
},selectToday:function() {
    if (!this.disabled && this.todayBtn && !this.todayBtn.disabled) {
        var today = new Date().clearTime();
        var todayT = today.getTime();
        if (typeof this.todayMonthCell === "number") {
            this.markDateAsSelected(todayT, false, this.todayMonthCell, this.todayDayCell, true);
        }
        else if (this.multiSelection) {
            this.update(today);
        }
        this.finishDateSelection(today);
    }
},setValue:function(value) {
    if (Ext.isArray(value)) {
        this.selectedDates = [];
        this.preSelectedDates = [];
        this.setSelectedDates(value, true);
        value = value[0];
    }
    this.value = value.clearTime(true);
    if (this.el && !this.multiSelection && this.noOfMonth == 1) {
        this.update(this.value);
    }
},setSize:Ext.emptyFn});
Ext.reg('datepickerplus', Ext.ux.DatePickerPlus);
if (parseInt(Ext.version.substr(0, 1), 10) > 2) {
    Ext.menu.DateItem = Ext.ux.DatePickerPlus;
    Ext.override(Ext.menu.DateMenu, {initComponent:function() {
        this.on('beforeshow', this.onBeforeShow, this);
        if (this.strict = (Ext.isIE7 && Ext.isStrict)) {
            this.on('show', this.onShow, this, {single:true,delay:20});
        }
        var PickerWidget = (this.initialConfig.usePickerPlus ? Ext.ux.DatePickerPlus : Ext.DatePicker);
        Ext.apply(this, {plain:true,showSeparator:false,items:this.picker = new PickerWidget(Ext.apply({internalRender:this.strict || !Ext.isIE,ctCls:'x-menu-date-item'}, this.initialConfig))});
        Ext.menu.DateMenu.superclass.initComponent.call(this);
        this.relayEvents(this.picker, ["select"]);
        this.on('select', this.menuHide, this);
        if (this.handler) {
            this.on('select', this.handler, this.scope || this);
        }
    }});
}
else {
    Ext.menu.DateItem = function(config) {
        if (config && config.usePickerPlus) {
            Ext.menu.DateItem.superclass.constructor.call(this, new Ext.ux.DatePickerPlus(config), config);
        }
        else {
            Ext.menu.DateItem.superclass.constructor.call(this, new Ext.DatePicker(config), config);
        }
        this.picker = this.component;
        this.addEvents('select');
        this.picker.on("render", function(picker) {
            picker.getEl().swallowEvent("click");
            picker.container.addClass("x-menu-date-item");
        });
        this.picker.on("select", this.onSelect, this);
    };
    Ext.extend(Ext.menu.DateItem, Ext.menu.Adapter, {onSelect:function(picker, date) {
        this.fireEvent("select", this, date, picker);
        Ext.menu.DateItem.superclass.handleClick.call(this);
    }});
}
if (Ext.form && Ext.form.DateField) {
    Ext.ux.form.DateFieldPlus = Ext.extend(Ext.form.DateField, {usePickerPlus:true,showWeekNumber:true,noOfMonth:1,noOfMonthPerRow:3,nationalHolidaysCls:'x-datepickerplus-nationalholidays',markNationalHolidays:true,eventDates:function(year) {
        return[];
    },eventDatesRE:false,eventDatesRECls:'',eventDatesREText:'',multiSelection:false,multiSelectionDelimiter:',',multiSelectByCTRL:true,fillupRows:true,markWeekends:true,weekendText:'',weekendCls:'x-datepickerplus-weekends',weekendDays:[6,0],useQuickTips:true,pageKeyWarp:1,maxSelectionDays:false,resizable:false,renderTodayButton:true,renderOkUndoButtons:true,tooltipType:'qtip',allowedDates:false,allowedDatesText:'',renderPrevNextButtons:true,renderPrevNextYearButtons:false,disableMonthPicker:false,showActiveDate:false,shiftSpaceSelect:true,disabledLetter:false,allowMouseWheel:true,summarizeHeader:false,stayInAllowedRange:true,disableSingleDateSelection:false,eventDatesSelectable:false,styleDisabledDates:false,prevNextDaysView:"mark",allowOtherMenus:false,onBeforeYearChange:function(picker, oldStartYear, newStartYear) {
        this.fireEvent("beforeyearchange", this, oldStartYear, newStartYear, picker);
    },onAfterYearChange:function(picker, oldStartYear, newStartYear) {
        this.fireEvent("afteryearchange", this, oldStartYear, newStartYear, picker);
    },onBeforeMonthChange:function(picker, oldStartMonth, newStartMonth) {
        this.fireEvent("beforemonthchange", this, oldStartMonth, newStartMonth, picker);
    },onAfterMonthChange:function(picker, oldStartMonth, newStartMonth) {
        this.fireEvent("aftermonthchange", this, oldStartMonth, newStartMonth, picker);
    },onAfterMonthClick:function(picker, month, wasSelected) {
        this.fireEvent("aftermonthclick", this, month, wasSelected, picker);
    },onAfterWeekClick:function(picker, startOfWeek, wasSelected) {
        this.fireEvent("afterweekclick", this, startOfWeek, wasSelected, picker);
    },onAfterDateClick:function(picker, date, wasSelected) {
        this.fireEvent("afterdateclick", this, date, wasSelected, picker);
    },onBeforeMonthClick:function(picker, month, wasSelected) {
        this.fireEvent("beforemonthclick", this, month, wasSelected, picker);
    },onBeforeWeekClick:function(picker, startOfWeek, wasSelected) {
        this.fireEvent("beforeweekclick", this, startOfWeek, wasSelected, picker);
    },onBeforeDateClick:function(picker, date) {
        this.fireEvent("beforedateclick", this, date);
    },onBeforeMouseWheel:function(picker, event) {
        this.fireEvent("beforemousewheel", this, event, picker);
    },onBeforeMaxDays:function(picker) {
        this.fireEvent("beforemaxdays", this, picker);
    },onUndo:function(picker, preSelectedDates) {
        this.fireEvent("undo", this, preSelectedDates, picker);
    },onTriggerClick:function() {
        if (this.disabled) {
            return;
        }
        if (!this.menu) {
            this.menu = new Ext.menu.DateMenu({allowOtherMenus:this.allowOtherMenus,usePickerPlus:this.usePickerPlus,noOfMonth:this.noOfMonth,noOfMonthPerRow:this.noOfMonthPerRow,listeners:{'beforeyearchange':{fn:this.onBeforeYearChange,scope:this},'afteryearchange':{fn:this.onAfterYearChange,scope:this},'beforemonthchange':{fn:this.onBeforeMonthChange,scope:this},'aftermonthchange':{fn:this.onAfterMonthChange,scope:this},'afterdateclick':{fn:this.onAfterDateClick,scope:this},'aftermonthclick':{fn:this.onAfterMonthClick,scope:this},'afterweekclick':{fn:this.onAfterWeekClick,scope:this},'beforedateclick':{fn:this.onBeforeDateClick,scope:this},'beforemonthclick':{fn:this.onBeforeMonthClick,scope:this},'beforeweekclick':{fn:this.onBeforeWeekClick,scope:this},'beforemousewheel':{fn:this.onBeforeMouseWheel,scope:this},'beforemaxdays':{fn:this.onBeforeMaxDays,scope:this},'undo':{fn:this.onUndo,scope:this}}});
            this.relayEvents(this.menu, ["select"]);
        }
        if (this.menu.isVisible()) {
            this.menu.hide();
            return;
        }
        if (this.disabledDatesRE) {
            this.ddMatch = this.disabledDatesRE;
        }
        if (typeof this.minDate == "string") {
            this.minDate = this.parseDate(this.minDate);
        }
        if (typeof this.maxDate == "string") {
            this.maxDate = this.parseDate(this.maxDate);
        }
        Ext.apply(this.menu.picker, {minDate:this.minValue || this.minDate,maxDate:this.maxValue || this.maxDate,disabledDatesRE:this.ddMatch,disabledDatesText:this.disabledDatesText,disabledDays:this.disabledDays,disabledDaysText:this.disabledDaysText,showToday:this.showToday,format:this.format,minText:String.format(this.minText, this.formatDate(this.minValue || this.minDate)),maxText:String.format(this.maxText, this.formatDate(this.maxValue || this.maxDate)),showWeekNumber:this.showWeekNumber,nationalHolidaysCls:this.nationalHolidaysCls,markNationalHolidays:this.markNationalHolidays,multiSelectByCTRL:this.multiSelectByCTRL,fillupRows:this.fillupRows,multiSelection:this.multiSelection,markWeekends:this.markWeekends,weekendText:this.weekendText,weekendCls:this.weekendCls,weekendDays:this.weekendDays,useQuickTips:this.useQuickTips,eventDates:this.eventDates,eventDatesRE:this.eventDatesRE,eventDatesRECls:this.eventDatesRECls,eventDatesREText:this.eventDatesREText,pageKeyWarp:this.pageKeyWarp,maxSelectionDays:this.maxSelectionDays,resizable:this.resizable,renderTodayButton:this.renderTodayButton,renderOkUndoButtons:this.renderOkUndoButtons,allowedDates:this.allowedDates,allowedDatesText:this.allowedDatesText,renderPrevNextButtons:this.renderPrevNextButtons,renderPrevNextYearButtons:this.renderPrevNextYearButtons,disableMonthPicker:this.disableMonthPicker,showActiveDate:this.showActiveDate,shiftSpaceSelect:this.shiftSpaceSelect,disabledLetter:this.disabledLetter,allowMouseWheel:this.allowMouseWheel,summarizeHeader:this.summarizeHeader,stayInAllowedRange:this.stayInAllowedRange,disableSingleDateSelection:this.disableSingleDateSelection,eventDatesSelectable:this.eventDatesSelectable,styleDisabledDates:this.styleDisabledDates,prevNextDaysView:this.prevNextDaysView});
        if (this.menuEvents) {
            this.menuEvents('on');
        }
        else {
            this.menu.on(Ext.apply({}, this.menuListeners, {scope:this}));
        }
        if (typeof this.defaultValue == 'string') {
            this.defaultValue = Date.parseDate(this.defaultValue, this.format);
        }
        this.menu.picker.setValue(this.getValue() || this.defaultValue || new Date());
        this.menu.show(this.el, "tl-bl?");
        this.menu.focus();
    },setValue:function(date) {
        var field = this;
        if (Ext.isArray(date)) {
            var formatted = [];
            for (var e = 0,el = date.length; e < el; ++e) {
                formatted.push(field.formatDate(date[e]));
            }
            var value = formatted.join(this.multiSelectionDelimiter);
            Ext.form.DateField.superclass.setValue.call(this, value);
        }
        else {
            Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
        }
    },validateValue:function(value) {
        if (this.multiSelection) {
            var field = this;
            var values = value.split(this.multiSelectionDelimiter);
            var isValid = true;
            for (var e = 0,el = values.length; e < el; ++e) {
                if (!Ext.ux.form.DateFieldPlus.superclass.validateValue.call(field, values[e])) {
                    isValid = false;
                }
            }
            return isValid;
        }
        else {
            return Ext.ux.form.DateFieldPlus.superclass.validateValue.call(this, value);
        }
    },getValue:function() {
        if (this.multiSelection) {
            var value = Ext.form.DateField.superclass.getValue.call(this);
            var field = this;
            var values = value.split(this.multiSelectionDelimiter);
            var dates = [];
            for (var e = 0,el = values.length; e < el; ++e) {
                var checkDate = field.parseDate(values[e]);
                if (checkDate) {
                    dates.push(checkDate);
                }
            }
            return(dates.length > 0 ? dates : "");
        }
        else {
            return Ext.ux.form.DateFieldPlus.superclass.getValue.call(this);
        }
    },beforeBlur:function() {
        if (this.multiSelection) {
            this.setValue(this.getRawValue().split(this.multiSelectionDelimiter));
        }
        else {
            var v = this.parseDate(this.getRawValue());
            if (v) {
                this.setValue(v);
            }
        }
    },submitFormat:'Y-m-d',submitFormatAddon:'-format',onRender:function() {
        Ext.ux.form.DateFieldPlus.superclass.onRender.apply(this, arguments);
        var name = this.name || this.el.dom.name || (this.id + this.submitFormatAddon);
        if (name == this.id) {
            name += this.submitFormatAddon;
        }
        this.hiddenField = this.el.insertSibling({tag:'input',type:'hidden',name:name,value:this.formatHiddenDate(this.parseDate(this.value))});
        this.hiddenName = name;
        this.el.dom.removeAttribute('name');
        this.el.on({keyup:{scope:this,fn:this.updateHidden},blur:{scope:this,fn:this.updateHidden}});
        this.setValue = this.setValue.createSequence(this.updateHidden);
        if (this.tooltip) {
            if (typeof this.tooltip == 'object') {
                Ext.QuickTips.register(Ext.apply({target:this.trigger}, this.tooltip));
            } else {
                this.trigger.dom[this.tooltipType] = this.tooltip;
            }
        }
    },onDisable:function() {
        Ext.ux.form.DateFieldPlus.superclass.onDisable.apply(this, arguments);
        if (this.hiddenField) {
            this.hiddenField.dom.setAttribute('disabled', 'disabled');
        }
    },onEnable:function() {
        Ext.ux.form.DateFieldPlus.superclass.onEnable.apply(this, arguments);
        if (this.hiddenField) {
            this.hiddenField.dom.removeAttribute('disabled');
        }
    },formatHiddenDate:function(date) {
        return Ext.isDate(date) ? Ext.util.Format.date(date, this.submitFormat) : date;
    },formatMultiHiddenDate:function(date) {
        var field = this,formatted = [],value;
        for (var e = 0,el = date.length; e < el; ++e) {
            formatted.push(field.formatHiddenDate(date[e]));
        }
        value = formatted.join(this.multiSelectionDelimiter);
        this.hiddenField.dom.value = value;
    },updateHidden:function(date) {
        if (Ext.isArray(date)) {
            this.formatMultiHiddenDate(date);
        }
        else {
            var value = this.getValue();
            if (Ext.isArray(value)) {
                this.formatMultiHiddenDate(value);
            } else {
                this.hiddenField.dom.value = this.formatHiddenDate(value);
            }
        }
    }});
    Ext.reg('datefieldplus', Ext.ux.form.DateFieldPlus);
}