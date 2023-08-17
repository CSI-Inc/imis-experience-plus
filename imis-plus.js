"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var IqaExtensions = /** @class */ (function () {
    function IqaExtensions($) {
        var _a, _b;
        this.$ = $;
        // Run some checks to determine if we are inside of the iMIS staff site
        if (((_a = this.$('head').get(0)) === null || _a === void 0 ? void 0 : _a.id) !== 'ctl00_Head1' && ((_b = this.$('form').get(0)) === null || _b === void 0 ? void 0 : _b.id) !== 'aspnetForm') {
            // Not iMIS - do nothing
            return;
        }
        // Add jQuery extensions
        this.addJQueryExtensions();
        // Initialize the module
        this.init();
    }
    /**
     * Initializes the various elements of this module.
     */
    IqaExtensions.prototype.init = function () {
        if (window.location.pathname.indexOf('/iMIS/QueryBuilder/Design.aspx') > -1) {
            this.initIqaExtensions();
            chrome.storage.sync.set({ message: "Hello, World!" });
            chrome.storage.sync.get(['message']).then(function (result) {
                alert("Value is: " + result.message);
            });
        }
        if (window.location.pathname.indexOf('/AsiCommon/Controls/IQA/Default.aspx') > -1) {
            this.initIqaBrowserExtensions();
        }
    };
    /**
     * Initializes the IQA Browser extensions.
     */
    IqaExtensions.prototype.initIqaBrowserExtensions = function () {
        var _this = this;
        console.log.apply(console, __spreadArray([IqaExtensions.VERSION_STRING + "Loaded: IQA Browser Extensions"], IqaExtensions.VERSION_STYLES, false));
        // Inject Font Awesome 
        this.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />');
        var qf = this.$('div[id*=ObjectQuickFindPanel');
        qf.css({
            width: '55%',
            textAlign: 'right',
            display: 'inline-flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            flexWrap: 'nowrap'
        });
        qf.css('width', '55%').css('text-align', 'right');
        qf.prepend("\n            <input type=\"text\" readonly=\"readonly\" id=\"__csi__iep__iqapath\" placeholder=\"Select an IQA...\" />            <div class=\"__csi__iep__copybutton\">\n                <a class=\"btn TextButton\" title=\"Copy IQA Path to Clipboard\">\n                    <i class=\"fa fa-fw fa-copy\"></i>\n                </a>\n            </div>");
        this.$('#__csi__iep__iqapath').css('width', 'calc(100% - 550px)');
        this.$('.__csi__iep__copybutton').css('display', 'inline-block').css('margin-right', '10px');
        this.$('.__csi__iep__copybutton a.btn').on('click', function (e) {
            var _a;
            _this.$(e.currentTarget).addClass('disabled').css('pointerEvents', 'none');
            var iqaBox = _this.$('#__csi__iep__iqapath');
            var iqaPath = iqaBox.val();
            navigator.clipboard.writeText((_a = iqaPath === null || iqaPath === void 0 ? void 0 : iqaPath.toString()) !== null && _a !== void 0 ? _a : "").then(function () {
                iqaBox.val('Copied!');
                window.setTimeout(function () {
                    _this.$(e.currentTarget).removeClass('disabled').css('pointerEvents', '');
                    iqaBox.val(iqaPath !== null && iqaPath !== void 0 ? iqaPath : "");
                }, 2000);
            });
        });
        var bindClickListener = function () {
            _this.$('div[id$=RadPaneContentList] table[id$=ContentList]').on('click', function (e) {
                var _a;
                var el = undefined;
                if (e.target.nodeName === 'TD' || e.target.nodeName === 'SPAN') {
                    el = _this.$(e.target).parents('tr').first();
                }
                if (el !== undefined && el.length > 0) {
                    if (((_a = el.data('documenttypecode')) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'FOL' || el.data('documenttypecode').toUpperCase() === 'IQD') {
                        $('#__csi__iep__iqapath').val(_this.$('input[id$=ObjectBrowser1_Address]').val() + '/' + el.data('documentname'));
                    }
                    else {
                        $('#__csi__iep__iqapath').val('Select an IQA...');
                    }
                }
                else {
                    $('#__csi__iep__iqapath').val('Select an IQA...');
                }
                return true;
            });
        };
        bindClickListener();
        // Hook into DOM changes since the DOM elements change when navigation occurs
        var mObs = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new mObs(function (_, __) {
            //console.log("Mutation detected!", {m, obs});
            bindClickListener();
        });
        observer.observe(this.$('div[id$=ContentListUpdatePanel]').get(0), { subtree: true, childList: true });
    };
    /**
     * Initializes the IQA editor extensions.
     */
    IqaExtensions.prototype.initIqaExtensions = function () {
        var _this = this;
        var _a, _b, _c;
        console.log.apply(console, __spreadArray([IqaExtensions.VERSION_STRING + "Loaded: IQA Extensions"], IqaExtensions.VERSION_STYLES, false));
        var isImis2017 = this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Template")').length === 0;
        // Inject Font Awesome 
        this.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />');
        // Add some ICONS!
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Define")').parent().prepend('<i class="fas fa-fw fa-pencil fc-yellow"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Run")').parent().prepend('<i class="fas fa-fw fa-play fc-teal"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Report")').parent().prepend('<i class="fas fa-fw fa-file-lines fc-dark-teal"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Group")').parent().prepend('<i class="fas fa-fw fa-users fc-purple"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Security")').parent().prepend('<i class="fas fa-fw fa-shield-halved fc-red"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Summary")').parent().prepend('<i class="fas fa-fw fa-list"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Sources")').parent().prepend('<i class="fas fa-fw fa-database"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Filters")').parent().prepend('<i class="fas fa-fw fa-filter"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Display")').parent().prepend('<i class="fas fa-fw fa-table-columns"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Sorting")').parent().prepend('<i class="fas fa-fw fa-arrow-down-a-z"></i>');
        this.$('.SubTabStrip .rtsLevel.rtsLevel1 .rtsTxt:contains("Template")').parent().prepend('<i class="fas fa-fw fa-code"></i>');
        this.$('input[id$=_SaveButton], input[id$=_SaveAsButton], input[id$=_CloseButton]').each(function (_, element) {
            var _a, _b;
            var text = (_b = (_a = _this.$(element).attr('title')) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
            _this.$(element).changeElementType('a').text(text);
        });
        this.$('a[id$=_SaveButton]').prepend('<i class="fas fa-fw fa-save"></i> ');
        this.$('a[id$=_SaveAsButton]').prepend('<i class="fas fa-fw fa-save"></i> ');
        this.$('a[id$=_CloseButton]').prepend('<i class="fas fa-fw fa-times"></i> ');
        // === Global Stuff ===
        // FIX THE MARGINS
        this.$('.Section .PanelTitle span').css('margin-left', '15px');
        // Remove Table Borders
        (_a = this.$('table.Grid').get(0)) === null || _a === void 0 ? void 0 : _a.style.setProperty('border', '0', 'important');
        // Selects a bit wider
        this.$('table.Grid tr td select.SelectStandard').css('max-width', '').css('min-width', '750px');
        // Tabs a bit wider
        this.$('.RadTabStrip .rtsIn').css('padding', '0 10px');
        // Add description row before Add rows
        this.$('img[title=Add][src*=icon_add]').parents('tr').before('<tr><td colspan="3" style="border: 0;"><h3>Add Relationship</h3></td></tr>');
        var newCol = this.$('<td />');
        this.$('img[title=Add][src*=icon_add]').parents('tr').find('td').first().attr('colspan', '2').after(newCol);
        newCol.append(this.$('img[title=Add][src*=icon_add]').parents('tr').find('td').last().find('img[title=Add][src*=icon_add]'));
        this.$('img[title=Add][src*=icon_add]').parents('tr').find('td').css('border', '0');
        // Replace the "Add" icon with an "Add" button
        this.$('img[title=Add][src*=icon_add]').changeElementType('a').addClass('btn PrimaryButton').text('Add').prepend('<i class="fas fa-fw fa-plus"></i> ');
        // === Display Tab ===
        this.$('div[id*="SummaryPanel_Body"] span.Label')
            .filter(function (_, e) { return _this.$(e).text() === "Path"; })
            .parent()
            .css('lineHeight', '2.2');
        this.$('div[id*="SummaryPanel_Body"] span.Label')
            .filter(function (_, e) { return _this.$(e).text() === "Path"; })
            .parent()
            .next()
            .append('<a class="csi__iep__copy__path btn PrimaryButton"><i class="fa fa-fw fa-clipboard"></i> Copy</a>');
        this.$('.csi__iep__copy__path').on('click', function (e) {
            var target = _this.$(e.currentTarget);
            target.addClass('disabled').css('pointerEvents', 'none');
            var qt = target.parent().children('span').first().text();
            navigator.clipboard.writeText(qt.trim()).then(function () {
                target.after('<span class="csi__iep__tempmsg"> Copied!</span>');
                window.setTimeout(function () { return _this.$('.csi__iep__tempmsg').fadeOut(function () {
                    _this.$('.csi__iep__tempmsg').remove();
                    target.removeClass('disabled').css('pointerEvents', '');
                }); }, 2000);
            });
        });
        // === Sources Tab ===
        // Table sizing
        this.$('div[id*="SourcesPanel_Body"] table.Grid').css('width', '900px');
        this.$('div[id*="SourcesPanel_Body"] table.Grid').css('max-width', '100%');
        this.$('div[id*="SourcesPanel_Body"] table.Grid tr:first-child td:last-child').css('min-width', '110px').css('border', 'none');
        if (isImis2017) {
            this.$('div[id*="SourcesPanel_Body"] table.Grid tr.GridHeader td:last-child').css('width', '120px');
        }
        this.$('div[id*="SourcesPanel_Body"] table.Grid tr:first-child td:nth-last-child(2)').css('min-width', '150px');
        // Text Boxes inside Table Cells
        this.$('div[id*="SourcesPanel_Body"] table.Grid td > input[type=text]').css('width', '100%');
        // Text updates
        this.$('span.SectionTitle:contains("Relations")').text('Relationships').parents('tr').addClass('GridHeader');
        this.$('tr.GridHeader td:contains("Description")').parent('tr').remove();
        // === Sorting Tab ===
        this.$('div[id*="SortPanel_Body"] table.Grid tr:first-child td:first-child').css('border', 'none');
        this.$('div[id*="SortPanel_Body"] table.Grid tr:first-child td:first-child input.TextButton').addClass('PrimaryButton');
        // === Filters Tab ===
        // Table updates
        var ft = this.$('div[id*="FiltersPanel_Body"]');
        ft.find('table.Grid').css('width', '1400px');
        ft.find('table.Grid').css('max-width', '100%');
        // Move and style the query options row and add buttons
        var queryOptsRow = ft.find('tr.GridHeader td span:contains("Query options")').parents('tr').first();
        queryOptsRow.find('td')
            .not(':first')
            .remove();
        queryOptsRow.find('td')
            .attr('colspan', '8');
        queryOptsRow.find('td')
            .css('border', '0')
            .css('background-color', 'transparent')
            .find('span')
            .changeElementType('h3');
        ft.find('table.Grid tr.GridHeader td:last-child').css('min-width', '140px');
        ft.find('table.Grid tr.GridHeader td:nth-last-child(2)').css('min-width', '180px');
        ft.find('table.Grid tr.GridHeader td:contains("Function")').parent('tr').find('td:nth-last-child(2)').text('Prompt Label');
        ft.find('table.Grid tr.GridRow td:nth-child(7) input').css('width', '100%');
        ft.find('table.Grid tr.GridAlternateRow td:nth-child(7) input').css('width', '100%');
        ft.find('table.Grid tr.GridRow td:nth-child(5) input').css('width', '100%');
        ft.find('table.Grid tr.GridAlternateRow td:nth-child(5) input').css('width', '100%');
        if (isImis2017) {
            ft.find('td.PanelTablePrompt').parent().find('td').filter(':empty').remove();
            ft.find('td.PanelTablePrompt').parent().find('td').css('border', '0').css('background-color', 'transparent');
            ft.find('td.PanelTablePrompt:eq(1)').append(ft.find('td.PanelTablePrompt:eq(1)').parent().find('input[type=text]'));
        }
        queryOptsRow.before(ft.find('tbody > tr').first());
        // Prompt inputs full width
        ft.find('table.Grid tr td:nth-last-child(2) input[aria-label*=Prompt]').css('width', '100%');
        // Change group button
        ft.find('table.Grid tr td input[type=button][title="Add Filter"]').parents('td').attr('align', '');
        ft.find('table.Grid tr td input[type=button][title="Add Filter"]').changeElementType('a').addClass('btn PrimaryButton').text('Add Group').prepend('<i class="fas fa-fw fa-plus"></i>');
        ft.find('table.Grid tr td input[type=button][title="Refresh"]').changeElementType('a').addClass('btn').text('Refresh').prepend('<i class="fas fa-fw fa-refresh"></i>').css('float', 'right');
        // If we are editing a row, style the edit row
        if (ft.find('td > input[type=image][title="Add Line"]').length > 0) {
            var pendingRow = ft.find('td > input[type=image][title="Add Line"]').parents('tr').first();
            ft.find('td > input[type=image][title="Add Line"]')
                .removeClass()
                .css('position', 'absolute')
                .css('top', '0')
                .css('left', '0')
                .css('width', '100%')
                .css('height', '100%')
                .css('z-index', '99');
            ft.find('td > input[type=image][title="Add Line"]').parent().css('position', 'relative')
                .append('<a class="btn PrimaryButton ex-commit-button"><i class="fas fa-fw fa-check"></i> Commit</a>');
            // Disable other buttons on the page so as to not accidentally click.
            this.$('a.btn, a.TextButton').not('.ex-commit-button').addClass('disabled');
            pendingRow.find('td').css('background-color', '#fdf0d9');
        }
        // === Display Tab ===
        var dt = this.$('div[id*="DisplayPanel_Body"]');
        // Table Styling
        dt.find('table.Grid').css('width', '1400px');
        dt.find('table.Grid').css('max-width', '100%');
        dt.find('tr.GridHeader td:first-child').css('width', '75px');
        dt.find('tr.GridHeader td:last-child').css('width', '50px');
        dt.find('tr.GridHeader td:nth-child(3)').css('width', '110px');
        dt.find('tr.GridHeader td:nth-child(6)').css('width', '82px');
        dt.find('tr:first-child td').css('border', '0').css('border-bottom', '1px solid #ddd');
        // Text Updates
        dt.find('tr:first-child td label:contains("Only display unique results")').text("Only display unique results (SELECT DISTINCT)");
        // Inputs max width
        dt.find('table.Grid tr').not(':first-child').find('td > input[type=text], td > select').css('width', '100%');
        // Move Options Row
        var dispOptsRow = ft.find('tr.GridHeader td label:contains("Only display unique")').parents('tr').first();
        dispOptsRow.before(ft.find('tbody > tr').first());
        // Refresh Icon
        dt.find('table.Grid tr td input[type=button][title="Refresh"]').changeElementType('a').addClass('btn').text('Refresh').prepend('<i class="fas fa-fw fa-refresh"></i> ').css('float', 'right');
        // Header Icons
        if (isImis2017) {
            dt.find('table.Grid .mdTitle:contains("Selected")').prepend('<i class="far fa-fw fa-circle-check"></i> ');
            dt.find('table.Grid .mdTitle:contains("Available")').prepend('<i class="far fa-fw fa-circle"></i> ');
            dt.find('table.Grid .mdTitle:contains("Custom")').prepend('<i class="fas fa-fw fa-database"></i> ');
        }
        else {
            dt.find('table.Grid .SectionTitle:contains("Selected")').prepend('<i class="far fa-fw fa-circle-check"></i> ');
            dt.find('table.Grid .SectionTitle:contains("Available")').prepend('<i class="far fa-fw fa-circle"></i> ');
            dt.find('table.Grid .SectionTitle:contains("Custom")').prepend('<i class="fas fa-fw fa-database"></i> ');
        }
        // Custom SQL Stuff
        // Define if we are in non-simple mode
        var advMode = dt.find('table.Grid tr:first-child select').val() === 'All' ||
            dt.find('table.Grid tr:first-child select').val() === 'Defaults';
        // Find custom rows
        dt.find('input[type=checkbox]').filter(':checked').parents('tr').each(function (_, el) {
            if (isImis2017 && ($(el).find('td:nth-child(3) select option').length === 1
                && _this.$(el).find('td:nth-child(8) input').is(':disabled'))
                || !isImis2017 && ($(el).find('td:nth-child(3) select option').length === 1
                    && _this.$(el).find('td:nth-child(6) input').length === 0)) {
                _this.$(el).find('td')
                    .css('background-color', '#effaff')
                    .css('vertical-align', 'middle');
                _this.$(el).find('td:nth-child(2)').css('white-space', 'pre-wrap').css('font-family', 'Consolas, monospace').css('font-size', '13px');
                if (advMode) {
                    _this.$(el).find('td:nth-child(3)').empty().css('text-align', 'center')
                        .append('<a data-index="' + (_this.$(el).index() + 1) + '" class="btn PrimaryButton ex-button-edit-customsql-row" style="background-color: #e3da6f;"><i class="fas fa-fw fa-pencil"></i> Edit</a>');
                }
            }
        });
        if (advMode) {
            if (isImis2017) {
                // Advanced Display Editor for iMIS 2017
                dt.find('table.Grid:last-child tr.GridHeader > td:first-child').css('width', '75%');
                dt.find('table.Grid').first().css('margin-bottom', '200px');
                var gridRowCount_1 = dt.find('table.Grid tr').length;
                var qfr = dt.find('table.Grid td:contains("Available")').first();
                if (parseInt(((_b = qfr.attr('colspan')) !== null && _b !== void 0 ? _b : "0")) > 3 && qfr.find('input').length > 0) {
                    qfr.find('input').css({
                        width: '500px',
                        display: 'inline-block',
                        float: 'none',
                        margin: '5px 20px'
                    });
                }
                // Move the last three table rows to a separate table, for styling.
                var customRows = dt.find('table.Grid tr').filter(function (i) { return i >= gridRowCount_1 - 3; });
                dt.find('table.Grid').last().after('<table class="csi__iep__customsql Grid align-middle"></table>');
                var newTable_1 = dt.find('table.csi__iep__customsql');
                newTable_1.append('<tbody>');
                newTable_1.css('position', 'fixed').css('bottom', '8px').css('box-shadow', '0px -20px 20px 10px #fff');
                newTable_1.find('tbody').append(customRows);
                newTable_1.find('tr:nth-child(2) td:first-child').css('width', '60%');
                newTable_1.find('tr:nth-child(2) td:nth-child(2)').css('width', '30%');
                newTable_1.find('tr:nth-child(2) td:nth-child(3)').css('width', '140px');
                newTable_1.find('tr:nth-child(3) td:first-child input').changeElementType('textarea').attr('rows', '4').css('font-family', 'Consolas, monospace').css('font-size', '13px');
                newTable_1.find('tr:nth-child(3) td:nth-child(2) input').css('width', '94%').before('<span>AS </span>').parent().css('vertical-align', 'middle');
                newTable_1.find('tr:nth-child(3) td:nth-child(3)').css('vertical-align', 'middle').css('position', 'relative');
                newTable_1.find('tr:nth-child(3) td:nth-child(3) > span.RadButton[title="Add"]')
                    .css('background-image', 'none')
                    .css('background-position', '-9999px -9999px')
                    .css('position', 'absolute')
                    .css('top', '0')
                    .css('left', '0')
                    .css('width', '100%')
                    .css('height', '100%')
                    .css('z-index', '99');
                newTable_1.find('tr:nth-child(3) td:nth-child(3) > span.RadButton[title="Add"]').parent().css('position', 'relative')
                    .append('<a class="btn PrimaryButton ex-commit-button"><i class="fas fa-fw fa-plus"></i> Add</a>');
                // Edit Event Handler
                this.$('.ex-button-edit-customsql-row').on('click', function (e) {
                    var _a, _b;
                    var editBtn = $(e.currentTarget);
                    if (editBtn.hasClass('disabled')) {
                        return;
                    }
                    var i = parseInt(editBtn.data('index'));
                    var row = dt.find('tr:nth-child(' + i + ')');
                    var sql = row.find('td:nth-child(2)').text();
                    var name = (_b = (_a = row.find('td:nth-child(4) input').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
                    newTable_1.find('tr:nth-child(3) td:nth-child(1) textarea').val(sql);
                    newTable_1.find('tr:nth-child(3) td:nth-child(2) input').val(name);
                    row.find('td').first().find('input').prop('checked', false);
                    _this.$('.ex-button-edit-customsql-row').addClass('disabled').css('cursor', 'default');
                    editBtn.hide().after('<a class="btn PrimaryButton ex-button-undo-customsql-row"><i class="fas fa-fw fa-undo"></i> Undo</a>');
                    _this.$('.ex-button-undo-customsql-row').on('click', function () {
                        row.find('td').first().find('input').prop('checked', true);
                        newTable_1.find('tr:nth-child(3) td:nth-child(1) textarea').val('');
                        newTable_1.find('tr:nth-child(3) td:nth-child(2) input').val('');
                        $('.ex-button-undo-customsql-row').remove();
                        editBtn.show();
                        _this.$('.ex-button-edit-customsql-row').removeClass('disabled').css('cursor', '');
                    });
                });
            }
            else {
                // Advanced Display Editor for iMIS EMS
                dt.find('table.Grid').first().css('margin-bottom', '200px');
                var gridRowCount_2 = dt.find('table.Grid tr').length;
                var qfr = dt.find('table.Grid td:contains("Available")').first();
                if (parseInt(((_c = qfr.attr('colspan')) !== null && _c !== void 0 ? _c : "0")) > 3 && qfr.find('input').length > 0) {
                    qfr.find('input').css({
                        width: '500px',
                        display: 'inline-block',
                        float: 'none',
                        margin: '5px 20px'
                    });
                }
                // Move the last three table rows to a separate table, for styling.
                var customRows = dt.find('table.Grid tr').filter(function (i) { return i >= gridRowCount_2 - 3; });
                dt.find('table.Grid').after('<table class="csi__iep__customsql Grid align-middle"></table>');
                var newTable_2 = dt.find('table.csi__iep__customsql');
                newTable_2.append('<tbody>');
                newTable_2.css('position', 'fixed').css('bottom', '8px').css('box-shadow', '0px -20px 20px 10px #fff');
                newTable_2.find('tbody').append(customRows);
                newTable_2.find('tr:nth-child(2) td:first-child').css('width', '60%');
                newTable_2.find('tr:nth-child(2) td:nth-child(2)').css('width', '30%');
                newTable_2.find('tr:nth-child(2) td:nth-child(3)').css('width', '140px');
                newTable_2.find('tr:nth-child(3) td:first-child input').changeElementType('textarea').attr('rows', '4').css('font-family', 'Consolas, monospace').css('font-size', '13px');
                newTable_2.find('tr:nth-child(3) td:nth-child(2) input').css('width', '94%').before('<span>AS </span>').parent().css('vertical-align', 'middle');
                newTable_2.find('tr:nth-child(3) td:nth-child(3)').css('vertical-align', 'middle');
                newTable_2.find('tr:nth-child(3) td:nth-child(3) > span.RadButton[title="Add"]')
                    .css('background-image', 'none')
                    .css('background-position', '-9999px -9999px')
                    .css('position', 'absolute')
                    .css('top', '0')
                    .css('left', '0')
                    .css('width', '100%')
                    .css('height', '100%')
                    .css('z-index', '99');
                // Switched to :after... so we get creative
                // Cast to any because TS complains it can't find 'insertRule' for some reason
                document.styleSheets[0].insertRule("#".concat(newTable_2.find('tr:nth-child(3) td:nth-child(3) > span.RadButton[title="Add"]').attr('id'), " { background: none; opacity: 0.001; }"));
                newTable_2.find('tr:nth-child(3) td:nth-child(3) > span.RadButton[title="Add"]').parent().css('position', 'relative')
                    .append('<a class="btn PrimaryButton ex-commit-button"><i class="fas fa-fw fa-plus"></i> Add</a>');
                // Edit Event Handler
                this.$('.ex-button-edit-customsql-row').on('click', function (e) {
                    var _a, _b;
                    var editBtn = $(e.currentTarget);
                    if (editBtn.hasClass('disabled')) {
                        return;
                    }
                    var i = parseInt(editBtn.data('index'));
                    var row = dt.find('tr:nth-child(' + i + ')');
                    var sql = row.find('td:nth-child(2)').text();
                    var name = (_b = (_a = row.find('td:nth-child(4) input').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
                    newTable_2.find('tr:nth-child(3) td:nth-child(1) textarea').val(sql);
                    newTable_2.find('tr:nth-child(3) td:nth-child(2) input').val(name);
                    row.find('td').first().find('input').prop('checked', false);
                    _this.$('.ex-button-edit-customsql-row').addClass('disabled').css('cursor', 'default');
                    editBtn.hide().after('<a class="btn PrimaryButton ex-button-undo-customsql-row"><i class="fas fa-fw fa-undo"></i> Undo</a>');
                    _this.$('.ex-button-undo-customsql-row').on('click', function () {
                        row.find('td').first().find('input').prop('checked', true);
                        newTable_2.find('tr:nth-child(3) td:nth-child(1) textarea').val('');
                        newTable_2.find('tr:nth-child(3) td:nth-child(2) input').val('');
                        $('.ex-button-undo-customsql-row').remove();
                        editBtn.show();
                        _this.$('.ex-button-edit-customsql-row').removeClass('disabled').css('cursor', '');
                    });
                });
            }
        }
    };
    /**
     * Sources:
     * https://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery
     */
    IqaExtensions.prototype.addJQueryExtensions = function () {
        this.$.fn.changeElementType = function (newType) {
            var newElements = [];
            var attrs;
            var newElement;
            this.each(function () {
                attrs = {};
                $.each(this.attributes, function () {
                    attrs[this.nodeName] = this.nodeValue;
                });
                newElement = $("<" + newType + "/>", attrs).append($(this).contents());
                $(this).replaceWith(newElement);
                if (!newElements) {
                    newElements = newElement;
                }
                else {
                    $.merge(newElements, newElement);
                }
            });
            return $(newElements);
        };
    };
    IqaExtensions.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    IqaExtensions.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return IqaExtensions;
}());
new IqaExtensions(jQuery);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Config = /** @class */ (function () {
    function Config(category, displayName, altName, action, destination, isShortcut) {
        this.category = category;
        this.displayName = displayName;
        this.altName = altName;
        this.action = action;
        this.destination = destination;
        this.isShortcut = isShortcut;
    }
    Object.defineProperty(Config.prototype, "search", {
        get: function () {
            return "".concat(this.displayName, " ").concat(this.altName, " ").concat(this.category);
        },
        enumerable: false,
        configurable: true
    });
    return Config;
}());
var CleanUp = /** @class */ (function () {
    function CleanUp() {
    }
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    CleanUp.EmailType = function (json) {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Email', '')) === null || _b === void 0 ? void 0 : _b.replace('Address', '')) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
    };
    // ex: pass in jsonData?.UpdateInformation?.UpdatedOn
    CleanUp.Date = function (json) {
        var _a, _b, _c;
        if (json) {
            return (_c = (_b = (_a = new Date(json)) === null || _a === void 0 ? void 0 : _a.toISOString()) === null || _b === void 0 ? void 0 : _b.split('T')[0]) !== null && _c !== void 0 ? _c : '';
        }
        else {
            return '';
        }
    };
    // ex: pass in jsonData?.Phones?.$values[2]?.PhoneType
    CleanUp.Phone = function (json) {
        var _a, _b, _c;
        return (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Phone', '')) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : 'Other';
    };
    // ex: jsonData?.Addresses?.$values[0]?.Address?.FullAddress
    CleanUp.FullAddress = function (json) {
        var _a, _b, _c;
        return (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('UNITED STATES', 'United States')) === null || _a === void 0 ? void 0 : _a.replace('CANADA', 'Canada')) === null || _b === void 0 ? void 0 : _b.replace('AUSTRALIA', 'Australia')) === null || _c === void 0 ? void 0 : _c.trim();
    };
    // ex: jsonData?.Addresses?.$values[0]?.AddressPurpose
    CleanUp.AddressPurpose = function (json) {
        var _a, _b;
        var purpose = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('Permanent Address', 'Permanent')) === null || _a === void 0 ? void 0 : _a.replace('Address', '')) === null || _b === void 0 ? void 0 : _b.trim();
        return purpose ? purpose : 'Other';
    };
    return CleanUp;
}());
var SearchBar = /** @class */ (function () {
    function SearchBar($) {
        var _a, _b;
        this.$ = $;
        SearchBar.Tabs = [SearchBar.CommandBarSelectTab, SearchBar.UserDetailsTab];
        // Run some checks to determine if we are inside of the iMIS staff site
        if (((_a = this.$('head').get(0)) === null || _a === void 0 ? void 0 : _a.id) !== 'ctl00_Head1' && ((_b = this.$('form').get(0)) === null || _b === void 0 ? void 0 : _b.id) !== 'aspnetForm') {
            // Not iMIS - do nothing
            return;
        }
        // Initialize the module
        this.init();
    }
    SearchBar.GetUserCardActions = function (userId) {
        var profileUrl = "".concat(SearchBar.ClientContext.websiteRoot, "Party.aspx?ID=").concat(userId);
        var credentialsUrl = "".concat(SearchBar.ClientContext.websiteRoot, "AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=").concat(userId);
        return "\n                <div id=\"userCardActions\" class=\"userDetails\">\n                    <div id=\"userCardGoToProfile\" class=\"userCardActionArea\">\n                        ".concat(SearchBar.IdCardBlue, "\n                        <a href=\"").concat(profileUrl, "\" class=\"userActionCard\">Profile</a>\n                        ").concat(SearchBar.EnterButton2, "\n                    </div>\n                    <div id=\"userCardGoToProfileNewTab\" class=\"userCardActionArea\">\n                        ").concat(SearchBar.BrowsersIcon, "\n                        <a id=\"userCardGoToProfileNewTabUrl\" target=\"_blank\" href=\"").concat(profileUrl, "\" class=\"userActionCard\">Profile (New Tab)</a>\n                    </div>\n                    <div id=\"userCardUserCredentials\" class=\"userCardActionArea\">\n                        ").concat(SearchBar.LockIcon, "\n                        <a id=\"userCardUserCredentialsUrl\" href=\"").concat(credentialsUrl, "\" class=\"userActionCard\">User Credentials</a>\n                        ").concat(SearchBar.EnterButton2, "&nbsp;").concat(SearchBar.ControlButton2, "\n                    </div>\n                </div>\n            ");
    };
    SearchBar.GetProfile = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
        var status = (_a = data === null || data === void 0 ? void 0 : data.Status) === null || _a === void 0 ? void 0 : _a.Description;
        var memberType = (_b = data === null || data === void 0 ? void 0 : data.AdditionalAttributes) === null || _b === void 0 ? void 0 : _b.$values[0].Value;
        var birthDate = CleanUp.Date(data === null || data === void 0 ? void 0 : data.BirthDate);
        var phone0 = (_d = (_c = data === null || data === void 0 ? void 0 : data.Phones) === null || _c === void 0 ? void 0 : _c.$values[0]) === null || _d === void 0 ? void 0 : _d.Number;
        var phone0Type = CleanUp.Phone((_f = (_e = data === null || data === void 0 ? void 0 : data.Phones) === null || _e === void 0 ? void 0 : _e.$values[0]) === null || _f === void 0 ? void 0 : _f.PhoneType);
        var phone1 = (_h = (_g = data === null || data === void 0 ? void 0 : data.Phones) === null || _g === void 0 ? void 0 : _g.$values[1]) === null || _h === void 0 ? void 0 : _h.Number;
        var phone1Type = CleanUp.Phone((_k = (_j = data === null || data === void 0 ? void 0 : data.Phones) === null || _j === void 0 ? void 0 : _j.$values[1]) === null || _k === void 0 ? void 0 : _k.PhoneType);
        //email
        console.log('data?.Emails?.$values[0] = ', (_l = data === null || data === void 0 ? void 0 : data.Emails) === null || _l === void 0 ? void 0 : _l.$values[0]);
        console.log('data?.Emails?.$values[1] = ', (_m = data === null || data === void 0 ? void 0 : data.Emails) === null || _m === void 0 ? void 0 : _m.$values[1]);
        console.log('data?.Emails?.$values[2] = ', (_o = data === null || data === void 0 ? void 0 : data.Emails) === null || _o === void 0 ? void 0 : _o.$values[2]);
        var email1 = (_q = (_p = data === null || data === void 0 ? void 0 : data.Emails) === null || _p === void 0 ? void 0 : _p.$values[0]) === null || _q === void 0 ? void 0 : _q.Address;
        var email1IsPrimary = (_s = (_r = data === null || data === void 0 ? void 0 : data.Emails) === null || _r === void 0 ? void 0 : _r.$values[0]) === null || _s === void 0 ? void 0 : _s.IsPrimary;
        var email1Type = (_u = (_t = data === null || data === void 0 ? void 0 : data.Emails) === null || _t === void 0 ? void 0 : _t.$values[0]) === null || _u === void 0 ? void 0 : _u.EmailType;
        var address0 = CleanUp.FullAddress((_x = (_w = (_v = data === null || data === void 0 ? void 0 : data.Addresses) === null || _v === void 0 ? void 0 : _v.$values[0]) === null || _w === void 0 ? void 0 : _w.Address) === null || _x === void 0 ? void 0 : _x.FullAddress);
        var address0Type = CleanUp.AddressPurpose((_z = (_y = data === null || data === void 0 ? void 0 : data.Addresses) === null || _y === void 0 ? void 0 : _y.$values[0]) === null || _z === void 0 ? void 0 : _z.AddressPurpose);
        var address1 = CleanUp.FullAddress((_2 = (_1 = (_0 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _0 === void 0 ? void 0 : _0.$values[1]) === null || _1 === void 0 ? void 0 : _1.Address) === null || _2 === void 0 ? void 0 : _2.FullAddress);
        var address1Type = CleanUp.AddressPurpose((_4 = (_3 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _3 === void 0 ? void 0 : _3.$values[1]) === null || _4 === void 0 ? void 0 : _4.AddressPurpose);
        var address2 = CleanUp.FullAddress((_7 = (_6 = (_5 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _5 === void 0 ? void 0 : _5.$values[2]) === null || _6 === void 0 ? void 0 : _6.Address) === null || _7 === void 0 ? void 0 : _7.FullAddress);
        var address2Type = CleanUp.AddressPurpose((_9 = (_8 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _8 === void 0 ? void 0 : _8.$values[2]) === null || _9 === void 0 ? void 0 : _9.AddressPurpose);
        var companyName = (_10 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _10 === void 0 ? void 0 : _10.Name;
        var companyId = (_11 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _11 === void 0 ? void 0 : _11.OrganizationPartyId;
        var userTitle = (_12 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _12 === void 0 ? void 0 : _12.Title;
        return "\n            <div id=\"userCardProfile\" class=\"userDetails\">\n                <h3 id=\"destinationUsersName\" style=\"color: #005e7d; margin: 2px\">".concat(data === null || data === void 0 ? void 0 : data.Name, "</h3>\n                <div id=\"details\" style=\"font-size: 90%;\">\n                    <div id=\"userDetailsTop\" style=\"margin: 0px 0px 5px 1px;\">\n                        <span id=\"destinationUsersId\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersIdLabel\">ID: </span>").concat(data === null || data === void 0 ? void 0 : data.Id, "\n                        </span>\n                        <span id=\"destinationUsersStatus\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersStatusLabel\">Status: </span>").concat(status, "\n                        </span>\n                        <span id=\"destinationUsersMemberType\" class=\"userDetails userSpecificDetail\">\n                            <span class=\"Label workBarLabel destinationUsersTypeLabel\">Type: </span>").concat(memberType, "\n                        </span>\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(birthDate ? "\n                        <div style=\"padding:4px 0;\">\n                            ".concat(SearchBar.CakeIcon, "\n                            <span class=\"textBadge\">Date of Birth</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(birthDate, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber0\">\n                        ").concat(phone0 ? "\n                        <div style=\"padding:4px 0;\">\n                            ".concat(SearchBar.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone0Type, "</span>\n                            <a href=\"tel:").concat(phone0, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone0, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber1\">\n                        ").concat(phone1 ? "\n                        <div style=\"padding:4px 0;\">\n                            ".concat(SearchBar.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone1Type, "</span>\n                            <a href=\"tel:").concat(phone1, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone1, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail1\">\n                        ").concat(email1 ? "" : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail2\">\n\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail3\">\n\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress0\">\n                        ").concat(address0 ? "\n                        <div style=\"padding:4px 0;\">\n                            ".concat(SearchBar.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address0Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address0, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress1\">\n                        ").concat(address1 ? "\n\n                        ".concat(SearchBar.MailboxIcon, "\n                            <span class=\"textBadge\" style=\"margin-right: 6px;\">\n                                ").concat(address1Type, "\n                            </span>\n                            ").concat(address1) : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress2\">\n                        ").concat(address2 ? "".concat(SearchBar.MailboxIcon, "\n                            <span class=\"textBadge\" style=\"margin-right: 6px;\">\n                                ").concat(address2Type, "\n                            </span>\n                            ").concat(address2) : '', "\n                    </div>\n                    <h5 style=\"margin-top: 3rem\" class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersCompanyName\">\n                        ").concat(companyName ? "".concat(SearchBar.BuildingIcon, "\n                        <a href=\"").concat(SearchBar.ClientContext.websiteRoot, "/Party.aspx?ID=").concat(companyId, "\">\n                            ").concat(companyName, "<span class=\"userDetailsBadge\">ID ").concat(companyId, "</span>\n                        </a>\n                        ") : '', "\n                    </h5>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersTitle\">\n                        ").concat(userTitle ? "".concat(SearchBar.UserTagIcon).concat(userTitle) : '', "\n                    </div>\n                </div>\n            </div>\n        ");
    };
    SearchBar.GetDocumentationInput = function (hasInput, encoded, value) {
        if (hasInput) {
            return "\n                <a id=\"documentationLinkDestination\" href=\"".concat(SearchBar.DocumentationUrl, "?q=").concat(encoded, "\" target=\"_blank\" style=\"display:block;\">\n                    <span class=\"TextButton\"\n                        style=\"border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d; display:inline-block\">\n                        Search iMIS Documentation\n                        ").concat(SearchBar.ExternalIconBlue, "\n                    </span>\n                    <span>").concat(value, "</span>\n                    <div id=\"documentationSearchHotKeyHint\" style=\"float: right; display: flex;\">\n                        ").concat(SearchBar.ShiftButton, "&nbsp;\n                        ").concat(SearchBar.PlusButton, "&nbsp;\n                        ").concat(SearchBar.EnterButton, "\n                    </div>\n                </a>\n            ");
        }
        else {
            return "\n                <a id=\"documentationLinkDestination\" href=\"".concat(SearchBar.DocumentationUrl, "\" target=\"_blank\">\n                    <span class=\"TextButton\"\n                        style=\"border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;\">\n                        Search iMIS Documentation\n                        ").concat(SearchBar.ExternalIconBlue, "\n                    </span>\n                </a>\n            ");
        }
    };
    //#endregion
    SearchBar.GetResource = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = chrome.runtime.getURL(path);
                        return [4 /*yield*/, $.get({ url: url, dataType: 'html', type: 'GET' })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchBar.GetAllAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            return __generator(this, function (_w) {
                switch (_w.label) {
                    case 0:
                        _a = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.CommandBarPath)];
                    case 1:
                        _a.CommandBar = _w.sent();
                        _b = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.CsiLogoPath)];
                    case 2:
                        _b.CsiLogo = _w.sent();
                        _c = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ExternalIconPath)];
                    case 3:
                        _c.ExternalIcon = _w.sent();
                        _d = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ExternalIconBluePath)];
                    case 4:
                        _d.ExternalIconBlue = _w.sent();
                        _e = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.IdCardBluePath)];
                    case 5:
                        _e.IdCardBlue = _w.sent();
                        _f = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.BrowsersIconPath)];
                    case 6:
                        _f.BrowsersIcon = _w.sent();
                        _g = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.LockIconPath)];
                    case 7:
                        _g.LockIcon = _w.sent();
                        _h = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.CakeIconPath)];
                    case 8:
                        _h.CakeIcon = _w.sent();
                        _j = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.BuildingIconPath)];
                    case 9:
                        _j.BuildingIcon = _w.sent();
                        _k = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.EmailIconPath)];
                    case 10:
                        _k.EmailIcon = _w.sent();
                        _l = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.MailboxIconPath)];
                    case 11:
                        _l.MailboxIcon = _w.sent();
                        _m = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.PhoneIconPath)];
                    case 12:
                        _m.PhoneIcon = _w.sent();
                        _o = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.UserTagIconPath)];
                    case 13:
                        _o.UserTagIcon = _w.sent();
                        _p = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ShiftButtonPath)];
                    case 14:
                        _p.ShiftButton = _w.sent();
                        _q = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.PlusButtonPath)];
                    case 15:
                        _q.PlusButton = _w.sent();
                        _r = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.EnterButtonPath)];
                    case 16:
                        _r.EnterButton = _w.sent();
                        _s = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.EnterButton2Path)];
                    case 17:
                        _s.EnterButton2 = _w.sent();
                        _t = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ControlButtonPath)];
                    case 18:
                        _t.ControlButton = _w.sent();
                        _u = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ControlButton2Path)];
                    case 19:
                        _u.ControlButton2 = _w.sent();
                        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
                        //1 Build Some Component
                        // inside BUILD:
                        // GET HTML (should already be loaded from GetAllAssets?)
                        // REPLACE TEMPLATE STUFF (should make a static func to rip throw all the replace calls)
                        // SAVE TO VAR FOR REUSE (need more SearchBar.ABC variables)
                        // TODO: i think this is how i want it below...
                        // SearchBar.CommandBarDocumentationInputWithoutValue = await SearchBar.GetResource(SearchBar.CommandBarDocumentationInputWithoutValuePath);
                        // `
                        //         <a id="documentationLinkDestination" href="${SearchBar.DocumentationUrl}" target="_blank">
                        //             <span class="TextButton"
                        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
                        //                 Search iMIS Documentation
                        //                 <i class="externalIconBlue"></i>
                        //             </span>
                        //         </a>
                        //     `;
                        _v = SearchBar;
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.UserDetailsViewPath)];
                    case 20:
                        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
                        //1 Build Some Component
                        // inside BUILD:
                        // GET HTML (should already be loaded from GetAllAssets?)
                        // REPLACE TEMPLATE STUFF (should make a static func to rip throw all the replace calls)
                        // SAVE TO VAR FOR REUSE (need more SearchBar.ABC variables)
                        // TODO: i think this is how i want it below...
                        // SearchBar.CommandBarDocumentationInputWithoutValue = await SearchBar.GetResource(SearchBar.CommandBarDocumentationInputWithoutValuePath);
                        // `
                        //         <a id="documentationLinkDestination" href="${SearchBar.DocumentationUrl}" target="_blank">
                        //             <span class="TextButton"
                        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
                        //                 Search iMIS Documentation
                        //                 <i class="externalIconBlue"></i>
                        //             </span>
                        //         </a>
                        //     `;
                        _v.UserDetailsView = _w.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Build this Tab on the fly and scrap the whole thing when you're done
    SearchBar.SetUserDetails = function () {
        var input = $('#commandBarInput').val();
        // Set up view
        var content = SearchBar.UserDetailsView;
        $("#UserDetailsTab").replaceWith(content);
        // Get api data
        var username = this.GetUserName(input); // THIS ONLY GRABS THE USERNAME
        console.log('username = ', username);
        var data = this.GetParty(input);
        console.log('data = ', data);
        // Update view with api data -> right column
        var profile = SearchBar.GetProfile(data);
        $('#userCardProfile').replaceWith(profile);
        // Update view with api data -> left column
        var userActions = SearchBar.GetUserCardActions(input);
        $('#userCardActions').replaceWith(userActions);
        // TODO: Update Documentation Search Area with Created/Updated stuff
    };
    SearchBar.GetParty = function (input) {
        var result = {};
        $.ajax("".concat(SearchBar.ClientContext.baseUrl, "api/Party/").concat(input), {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers: {
                RequestVerificationToken: SearchBar.RVToken
            },
            success: function (personData) {
                console.log('personData = ', personData);
                result = personData;
            },
            error: function () {
                console.log('no party details for this id!');
                // might want to show a "no user found with this id" or something
            }
        });
        return result;
    };
    SearchBar.GetUserName = function (input) {
        var result = '';
        $.ajax("".concat(SearchBar.ClientContext.baseUrl, "api/User/").concat(input), {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers: {
                RequestVerificationToken: SearchBar.RVToken
            },
            success: function (userData) {
                console.log('userData = ', userData);
                result = userData;
                // IF SUCCESSFUL -> ADD USERNAME TO #USERNAME
                // ELSE -> REMOVE USERNAME FROM #USERNAME
                // MAKE IT SO #USERNAME IS PART OF THE DOM TO START
                // HERES THE DOM
                // '<span class="Label workBarLabel workBarUsernameLabel">&nbsp;&nbsp;Username&nbsp;</span>N/A
            },
            error: function () {
                console.log('no username for this contact!');
                // DO NOTHING, ITS ALREADY SETUP TO HANDLE N/A
            }
        });
        return result;
    };
    SearchBar.RemoveUserDetailsInfo = function () {
        $("#UserDetailsTab").empty();
    };
    /*

    "ANN"

    Annual Renewals          ~/annualRenewals
    user:ANN                 CTRL+ENTER
    product:ANN
    event:ANN
    docs:ANN                 SHIFT+ENTER

    */
    /**
     * Initializes the various elements of this module.
     */
    SearchBar.prototype.init = function () {
        var _this = this;
        this.$(function () {
            SearchBar.RVToken = $("#__RequestVerificationToken").val();
            SearchBar.ClientContext = JSON.parse($('#__ClientContext').val());
            SearchBar.GetResource(SearchBar.CommandBarPath).then(function (data) {
                $('body').prepend(data);
            });
            SearchBar.BuildConfig();
            SearchBar.GetAllAssets().then(function () {
                $("#commandBarOverlay .csiLogo").replaceWith(SearchBar.CsiLogo);
                $("#commandBarOverlay .externalIconBlue").replaceWith(SearchBar.ExternalIconBlue);
                $("#commandBarOverlay .externalIcon").replaceWith(SearchBar.ExternalIcon);
            });
        });
        var keysPressed = {};
        document.addEventListener('keydown', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var isCommandBarVisible, isAnyCombo, input, input, openDocumentation, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isCommandBarVisible = $("#commandBarOverlay").is(":visible");
                        keysPressed[event.key] = true;
                        console.log('event.key = ', event.key);
                        isAnyCombo = function (target1, target2) {
                            return (keysPressed[target1] && event.key == target2 || keysPressed[target2] && event.key == target1);
                        };
                        if (!(!isCommandBarVisible && isAnyCombo("Shift", "CapsLock"))) return [3 /*break*/, 2];
                        return [4 /*yield*/, SearchBar.showOverlay()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!keysPressed['Escape']) return [3 /*break*/, 4];
                        // technically chrome has already hidden this, but we need to execute this still for clean up purposes
                        return [4 /*yield*/, SearchBar.hideOverlay()];
                    case 3:
                        // technically chrome has already hidden this, but we need to execute this still for clean up purposes
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        if (isCommandBarVisible && event.key === "Enter" && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"]) {
                            if ($('#commandBarInput').get(0) === document.activeElement) {
                                input = $('#commandBarInput').val();
                                if (input.length > 0 && $.isNumeric(input)) {
                                    window.location.replace("".concat(SearchBar.ClientContext.websiteRoot, "/Party.aspx?ID=").concat(input));
                                }
                            }
                        }
                        // Go to Documentation
                        // TODO: IN CRHOME: Shift + Enter actually is hotkey to open in new window, so this doesnt work in chrome
                        else if (isCommandBarVisible && isAnyCombo("Shift", "Enter")) {
                            if ($('#commandBarInput').get(0) === document.activeElement) {
                                input = $('#commandBarInput').val();
                                if (input.length > 0 && !$.isNumeric(input)) {
                                    console.log('Opening Docs in new tab!');
                                    openDocumentation = window.open($('#documentationLinkDestination').prop('href'), '_blank');
                                    if (openDocumentation) {
                                        openDocumentation.focus();
                                    }
                                }
                            }
                        }
                        // Go to User Credentials
                        else if (isCommandBarVisible && isAnyCombo("Shift", "Control")) {
                            if ($('#commandBarInput').get(0) === document.activeElement) {
                                input = $('#commandBarInput').val();
                                if (input.length > 0 && $.isNumeric(input)) {
                                    window.location.replace($('#userCardUserCredentialsUrl').prop('href'));
                                }
                            }
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        document.addEventListener('keyup', function (event) {
            delete keysPressed[event.key];
            console.log('keysPressed OFF = ', keysPressed);
        });
    };
    SearchBar.BuildConfig = function () {
        SearchBar.GetConfig().then(function (data) {
            SearchBar.Config = data;
            data.forEach(function (item, i) {
                var content = "\n                <li data-index=\"".concat(i, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(i, "\" data-search=\"").concat(item.search, "\" action=").concat(item.action, ">\n                    <a href=\"").concat(item.destination, "\" style=\"color: #222; text-decoration: none;\">\n                        ").concat(item.category.length > -1 ?
                    "<span style=\"border: 1px solid lightgray; border-radius: 3px; float: left; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; min-width: 90px; text-align: center;\">\n                                ".concat(item.category, "\n                            </span>")
                    : '', "\n                        ").concat(item.displayName, "\n                        ").concat(item.isShortcut ?
                    "<span style=\"border: 1px solid lightgray; border-radius: 3px; float: right; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px;\">\n                            ~/".concat(item.destination, "\n                        </span>")
                    : '', "\n                    </a>\n                </li>\n                ");
                $('#commandBarUl').append(content);
                // Add hover effects
                $('.commandBarListItem')
                    .on("mouseenter", function () {
                    $(this).addClass('commandBarHover').css({ 'background-color': 'rgba(231,231,231,.5', 'cursor': 'pointer' });
                })
                    .on("mouseleave", function () {
                    $(this).removeClass('commandBarHover').css('background-color', 'initial');
                });
            });
        });
    };
    // Use this with '' for showing the spinner so that all tabs are hidden
    SearchBar.ActivateTab = function (activateTab) {
        SearchBar.Tabs.forEach(function (tab) {
            if (tab == activateTab) {
                $("#".concat(tab)).show();
            }
            else {
                $("#".concat(tab)).hide();
            }
        });
    };
    SearchBar.GetConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, json, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = chrome.runtime.getURL(SearchBar.ConfigPath);
                        return [4 /*yield*/, $.get({ url: url, dataType: 'json', type: 'GET' })];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        $('#commandBarInput').trigger("focus");
                        return [4 /*yield*/, SearchBar.GetResource(SearchBar.ShiftButtonBadge)];
                    case 2:
                        resource = _c.sent();
                        console.log("resource", resource);
                        $('body').prepend(resource);
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchBar.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    SearchBar.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    SearchBar.UserDetailsTab = "UserDetailsTab";
    SearchBar.CommandBarSelectTab = "CommandBarSelectTab";
    SearchBar.ConfigPath = "assets/search-bar-config.json";
    //#region SVG Paths
    SearchBar.CsiLogoPath = "assets/images/csiLogo.svg";
    SearchBar.BuildingIconPath = "assets/images/buildingIcon.svg";
    SearchBar.CakeIconPath = "assets/images/cakeIcon.svg";
    SearchBar.EmailIconPath = "assets/images/emailIcon.svg";
    SearchBar.MailboxIconPath = "assets/images/mailboxIcon.svg";
    SearchBar.PhoneIconPath = "assets/images/phoneIcon.svg";
    SearchBar.UserTagIconPath = "assets/images/userTagIcon.svg";
    SearchBar.ExternalIconPath = "assets/images/externalIcon.svg";
    SearchBar.ExternalIconBluePath = "assets/images/externalIconBlue.svg";
    SearchBar.IdCardBluePath = "assets/images/idCardBlue.svg";
    SearchBar.BrowsersIconPath = "assets/images/browserIcon.svg";
    SearchBar.LockIconPath = "assets/images/lockIcon.svg";
    //#endregion
    //#region Component Paths
    SearchBar.CommandBarPath = "assets/components/commandBar.html";
    SearchBar.ShiftButtonPath = "assets/components/buttons/shift.html";
    SearchBar.PlusButtonPath = "assets/components/buttons/plus.html";
    SearchBar.EnterButtonPath = "assets/components/buttons/enter.html";
    SearchBar.EnterButton2Path = "assets/components/buttons/enter2.html";
    SearchBar.ControlButtonPath = "assets/components/buttons/control.html";
    SearchBar.ControlButton2Path = "assets/components/buttons/control2.html";
    SearchBar.DocumentationUrl = "https://help.imis.com/enterprise/search.htm";
    SearchBar.UserDetailsViewPath = "assets/views/userDetailsTab.html";
    return SearchBar;
}());
new SearchBar($);
