"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var ImisExtensions = /** @class */ (function () {
    function ImisExtensions($) {
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
    ImisExtensions.prototype.init = function () {
        if (window.location.pathname.indexOf('/iMIS/QueryBuilder/Design.aspx') > -1) {
            this.initIqaExtensions();
        }
        if (window.location.pathname.indexOf('/AsiCommon/Controls/IQA/Default.aspx') > -1) {
            this.initIqaBrowserExtensions();
        }
    };
    /**
     * Initializes the IQA Browser extensions.
     */
    ImisExtensions.prototype.initIqaBrowserExtensions = function () {
        var _this = this;
        console.log.apply(console, __spreadArrays([ImisExtensions.VERSION_STRING + "Loaded: IQA Browser Extensions"], ImisExtensions.VERSION_STYLES));
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
            var _a, _b;
            _this.$(e.currentTarget).addClass('disabled').css('pointerEvents', 'none');
            var iqaBox = _this.$('#__csi__iep__iqapath');
            var iqaPath = iqaBox.val();
            navigator.clipboard.writeText((_b = (_a = iqaPath) === null || _a === void 0 ? void 0 : _a.toString(), (_b !== null && _b !== void 0 ? _b : ""))).then(function () {
                iqaBox.val('Copied!');
                window.setTimeout(function () {
                    _this.$(e.currentTarget).removeClass('disabled').css('pointerEvents', '');
                    iqaBox.val((iqaPath !== null && iqaPath !== void 0 ? iqaPath : ""));
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
    ImisExtensions.prototype.initIqaExtensions = function () {
        var _this = this;
        var _a, _b;
        console.log.apply(console, __spreadArrays([ImisExtensions.VERSION_STRING + "Loaded: IQA Extensions"], ImisExtensions.VERSION_STYLES));
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
            var text = (_b = (_a = _this.$(element).attr('title')) === null || _a === void 0 ? void 0 : _a.toString(), (_b !== null && _b !== void 0 ? _b : ""));
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
            if ($(el).find('td:nth-child(3) select option').length === 1
                && _this.$(el).find('td:nth-child(6) input').length === 0) {
                _this.$(el).find('td').css('background-color', '#effaff');
                _this.$(el).find('td:nth-child(2)').css('white-space', 'pre-wrap').css('font-family', 'Consolas, monospace').css('font-size', '13px');
                if (advMode) {
                    _this.$(el).find('td:nth-child(3)').empty().css('text-align', 'center').append('<a data-index="' + (_this.$(el).index() + 1) + '" class="btn PrimaryButton ex-button-edit-customsql-row" style="background-color: #e3da6f;"><i class="fas fa-fw fa-pencil"></i> Edit</a>');
                }
            }
        });
        if (advMode && isImis2017) {
            dt.find('table.Grid:last-child tr.GridHeader > td:first-child').css('width', '75%');
        }
        if (advMode && !isImis2017) {
            dt.find('table.Grid').first().css('margin-bottom', '200px');
            var gridRowCount_1 = dt.find('table.Grid tr').length;
            var qfr = dt.find('table.Grid td:contains("Available")').first();
            if (parseInt((_b = qfr.attr('colspan'), (_b !== null && _b !== void 0 ? _b : "0"))) > 3 && qfr.find('input').length > 0) {
                qfr.find('input').css({
                    width: '500px',
                    display: 'inline-block',
                    float: 'none',
                    margin: '5px 20px'
                });
            }
            // Move the last three table rows to a separate table, for styling.
            var customRows = dt.find('table.Grid tr').filter(function (i) { return i >= gridRowCount_1 - 3; });
            dt.find('table.Grid').after('<table class="csi__iep__customsql Grid align-middle"></table>');
            var newTable_1 = dt.find('table.csi__iep__customsql');
            newTable_1.append('<tbody>');
            newTable_1.css('position', 'fixed').css('bottom', '8px').css('box-shadow', '0px -20px 20px 10px #fff');
            newTable_1.find('tbody').append(customRows);
            newTable_1.find('tr:nth-child(2) td:first-child').css('width', '60%');
            newTable_1.find('tr:nth-child(2) td:nth-child(2)').css('width', '30%');
            newTable_1.find('tr:nth-child(2) td:nth-child(3)').css('width', '140px');
            newTable_1.find('tr:nth-child(3) td:first-child input').changeElementType('textarea').attr('rows', '4').css('font-family', 'Consolas, monospace').css('font-size', '13px');
            newTable_1.find('tr:nth-child(3) td:nth-child(2) input').css('width', '94%').before('<span>AS </span>').parent().css('vertical-align', 'middle');
            newTable_1.find('tr:nth-child(3) td:nth-child(3)').css('vertical-align', 'middle');
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
                var name = (_b = (_a = row.find('td:nth-child(4) input').val()) === null || _a === void 0 ? void 0 : _a.toString(), (_b !== null && _b !== void 0 ? _b : ""));
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
    };
    /**
     * Sources:
     * https://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery
     */
    ImisExtensions.prototype.addJQueryExtensions = function () {
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
    ImisExtensions.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.1.0 %c ";
    ImisExtensions.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;",
    ];
    return ImisExtensions;
}());
new ImisExtensions(jQuery);
