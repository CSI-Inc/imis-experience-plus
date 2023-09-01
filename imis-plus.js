"use strict";
/// <reference path="settingsModel.ts" />
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
var Settings = /** @class */ (function () {
    function Settings($) {
        var _this = this;
        this.$ = $;
        // Contains interactive logic for the popout menu speceifically. Will early exit for other pages.
        this.$(function () { return __awaiter(_this, void 0, void 0, function () {
            var config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!$('#iep-menu').length) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.load()];
                    case 1:
                        config = _a.sent();
                        // Restore settings to the page
                        $('#enable-iqa').prop('checked', config.enableIqa);
                        $('#enable-rise').prop('checked', config.enableRise);
                        $('#enable-workbar').prop('checked', config.enableWorkbar);
                        $('#workbar-kbd').val(config.workbarShortcut);
                        $('#kbd-ctrl').prop('checked', config.workbarKbdCtrl);
                        $('#kbd-alt').prop('checked', config.workbarKbdAlt);
                        $('#kbd-shift').prop('checked', config.workbarKbdShift);
                        $('#workbar-kbd').on('keydown', function (e) {
                            e.preventDefault();
                            if (e.metaKey || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
                                return;
                            }
                            $('#kbd-ctrl').prop('checked', e.ctrlKey);
                            $('#kbd-alt').prop('checked', e.altKey);
                            $('#kbd-shift').prop('checked', e.shiftKey);
                            // Capitalize the first letter of e.key
                            e.key = e.key.charAt(0).toUpperCase() + e.key.slice(1);
                            // Rename ' ' to Space
                            if (e.key === ' ')
                                e.key = Settings.SPACEBAR;
                            // If the user enters backspace, clear the input
                            if (e.key === 'Backspace') {
                                $('#workbar-kbd').val('');
                            }
                            else {
                                $('#workbar-kbd').val(e.key);
                            }
                            _this.save();
                        });
                        // If any input on the page changes or any key is pressed, save the settings
                        $('input').on('change', function () { return _this.save(); });
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Settings.prototype.save = function () {
        chrome.storage.sync.set({
            enableIqa: $('#enable-iqa').prop('checked'),
            enableRise: $('#enable-rise').prop('checked'),
            enableWorkbar: $('#enable-workbar').prop('checked'),
            workbarShortcut: $('#workbar-kbd').val(),
            workbarKbdCtrl: $('#kbd-ctrl').prop('checked'),
            workbarKbdAlt: $('#kbd-alt').prop('checked'),
            workbarKbdShift: $('#kbd-shift').prop('checked')
        });
    };
    Settings.prototype.load = function (something) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.sync.get({
                            enableIqa: true,
                            enableRise: false,
                            enableWorkbar: true,
                            workbarShortcut: Settings.SPACEBAR,
                            workbarKbdCtrl: true,
                            workbarKbdAlt: false,
                            workbarKbdShift: false
                        }, function (settings) {
                            resolve({
                                enableIqa: settings.enableIqa,
                                enableRise: settings.enableRise,
                                enableWorkbar: settings.enableWorkbar,
                                workbarShortcut: settings.workbarShortcut,
                                workbarKbdCtrl: settings.workbarKbdCtrl,
                                workbarKbdAlt: settings.workbarKbdAlt,
                                workbarKbdShift: settings.workbarKbdShift
                            });
                        });
                    })];
            });
        });
    };
    Settings.SPACEBAR = 'Spacebar';
    return Settings;
}());
new Settings(jQuery);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /** Determines if the current page is an IMIS page or not. This is used to determine if the extension should be enabled or not. */
    Utils.isImisPage = function ($) {
        var _a, _b;
        // Most iMIS pages have a "gWebRoot" variable, a body called "MainBody", and a form called "aspnetForm".
        return $('script').toArray().some(function (script) { return script.innerHTML.includes('gWebRoot'); })
            && ((_a = $('body').get(0)) === null || _a === void 0 ? void 0 : _a.id) === 'MainBody'
            && ((_b = $('form').get(0)) === null || _b === void 0 ? void 0 : _b.id) === 'aspnetForm';
    };
    return Utils;
}());
/// <reference path="settings/settings.ts" />
/// <reference path="utils.ts" />
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
        this.$ = $;
        this.settings = new Settings($);
        // Run some checks to determine if we are inside of the iMIS staff site
        if (!Utils.isImisPage($)) {
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
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settings.load()];
                    case 1:
                        config = _a.sent();
                        if (!config.enableIqa)
                            return [2 /*return*/];
                        if (window.location.pathname.indexOf('/iMIS/QueryBuilder/Design.aspx') > -1) {
                            this.initIqaExtensions();
                        }
                        if (window.location.pathname.indexOf('/AsiCommon/Controls/IQA/Default.aspx') > -1) {
                            this.initIqaBrowserExtensions();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initializes the IQA Browser extensions.
     */
    IqaExtensions.prototype.initIqaBrowserExtensions = function () {
        var _this = this;
        console.log.apply(console, __spreadArray([IqaExtensions.VERSION_STRING + "Loaded: IQA Module"], IqaExtensions.VERSION_STYLES, false));
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
    IqaExtensions.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.1 %c ";
    IqaExtensions.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return IqaExtensions;
}());
new IqaExtensions(jQuery);
/// <reference path="settings/settings.ts" />
/// <reference path="utils.ts" />
var RiseExtensions = /** @class */ (function () {
    function RiseExtensions($) {
        this.$ = $;
        this.settings = new Settings($);
        // Run some checks to determine if we are inside of the iMIS staff site
        if (!Utils.isImisPage($)) {
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
    RiseExtensions.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settings.load()];
                    case 1:
                        config = _a.sent();
                        if (!config.enableRise)
                            return [2 /*return*/];
                        if (window.location.pathname.indexOf('/ContentManagement/ContentDesigner/ContentRecordEdit.aspx') > -1) {
                            this.$(function () {
                                _this.initRiseEditorExtensions();
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initializes the IQA Browser extensions.
     */
    RiseExtensions.prototype.initRiseEditorExtensions = function () {
        var _this = this;
        console.log.apply(console, __spreadArray([RiseExtensions.VERSION_STRING + "Loaded: RiSE Module"], RiseExtensions.VERSION_STYLES, false));
        // Inject Font Awesome
        this.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />');
        // Add a class to the body for scoping CSS rules
        this.$('form #MainPanel').addClass('__csi__iep__rise');
        // ICONS!
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Definition")').parent().prepend('<i class="fas fa-fw fa-pen-to-square fc-yellow"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Properties")').parent().prepend('<i class="fas fa-fw fa-cog fc-purple"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Current tags")').parent().prepend('<i class="fas fa-fw fa-tag fc-teal"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Redirect rules")').parent().prepend('<i class="fas fa-fw fa-external-link fc-blue"></i>');
        this.$('.rtsLevel.rtsLevel1 .rtsTxt:contains("Access settings")').parent().prepend('<i class="fas fa-fw fa-users fc-green"></i>');
        // Fix the confusing publish location controls
        while (this.$('.PanelFieldValue > #LinkButtons br + *').length) {
            // remove anything after the first <br>
            this.$('.PanelFieldValue > #LinkButtons br + *').remove();
        }
        this.$('.PanelFieldValue > #LinkButtons').parent().addClass('InputXLargeWrapper');
        var fullUrl = this.$('.PanelFieldValue > #LinkButtons').find('a').attr('href');
        var freeLink = this.$("#ctl01_TemplateBody_WebPartControl_PublishFileName_TextField").val();
        this.$('.PanelFieldValue > #LinkButtons').prepend("\n            <div style=\"margin-bottom: 0.5rem;\">\n                <input type=\"text\" id=\"__csi__iep__fullUrl\" readonly value=\"".concat(fullUrl, "\" />\n                <button id=\"__csi__iep__copyFullUrl\" style=\"margin: 0 0.5rem;\" class=\"btn btn-primary\">\n                    <i class=\"fas fa-copy fa-fw\"></i>\n                    Copy\n                </button>\n            </div>\n        "));
        // if freelink is not empty, then we have a custom URL
        if (freeLink) {
            this.$('.PanelFieldValue > #LinkButtons').closest('.PanelField').after("\n                <div class=\"PanelField Left InputLargeWrapper\">\n                    <div style=\"display: inline;\">\n                        <label class=\"PanelFieldLabel\">Freelink</labeb>\n                    </div>\n                    <div class=\"PanelFieldValue\">\n                        <input type=\"text\" id=\"__csi__iep__freeLink\" readonly value=\"[[".concat(freeLink, "]]\" />\n                        <button id=\"__csi__iep__copyFreeLink\" style=\"margin: 0 0.5rem;\" class=\"btn btn-primary\">\n                            <i class=\"fas fa-copy fa-fw\"></i>\n                            Copy\n                        </button>\n                    </div>\n                </div>\n            "));
        }
        else {
            this.$('.PanelFieldValue > #LinkButtons').closest('.PanelField').append("\n                <div class=\"PanelField Left\">\n                    <div style=\"display: inline;\">\n                        <label class=\"PanelFieldLabel\">Freelink</labeb>\n                    </div>\n                    <div class=\"PanelFieldValue\">\n                        <em>This page does not have a freelink.</em>\n                    </div>\n                </div>\n            ");
        }
        // If the user clicks on ID __csi__iep__copyFullUrl or __csi__iep__copyFreeLink, copy the value to the clipboard
        this.$('#__csi__iep__copyFullUrl, #__csi__iep__copyFreeLink').on('click', function (e) {
            var _a, _b;
            e.preventDefault();
            var target = _this.$(e.currentTarget);
            target.addClass('disabled').css('pointerEvents', 'none');
            var qt = (_b = (_a = target.siblings('input').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
            navigator.clipboard.writeText(qt.trim()).then(function () {
                target.after('<span class="csi__iep__tempmsg"> Copied!</span>');
                window.setTimeout(function () { return _this.$('.csi__iep__tempmsg').fadeOut(function () {
                    _this.$('.csi__iep__tempmsg').remove();
                    $('#__csi__iep__copyFullUrl, #__csi__iep__copyFreeLink').removeClass('disabled').css('pointerEvents', '');
                }); }, 2000);
            });
        });
        // Zone style tidying / organization
        this.$('.WebPartZoneDesignTimeAction').each(function (_, e) {
            _this.$(e).closest('tr').appendTo(_this.$(e).closest('table'));
        });
        this.$('.WebPartZoneDesignTimeAction').each(function (_, e) {
            _this.$(e).children().wrapAll($('<div />').addClass('__csi__iep__addButton'));
        });
        this.$('.__csi__iep__addButton').each(function (_, e) {
            _this.$(e).find('br + div').each(function (_, e) {
                _this.$(e).insertBefore(_this.$(e).closest('table'));
                _this.$(e).find('span').addClass('__csi__iep__zoneName');
            });
        });
        this.$('.WebPartZoneDesignTimeAction').css('fontSize', '2rem');
        this.$('a[id=AddContentLink]')
            .html('<i class="fas fa-plus-circle fa-fw"></i>Add Content');
        this.$('a[id=AddContentLink] + span')
            .html(' ');
        this.$('a[id=AddContentLink] + span + a')
            .html('<i class="fas fa-gear fa-fw"></i>Zone Properties');
        // iPart controls / icons
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Configure")')
            .addClass('__csi__iep__verb_configure')
            .html('<i class="fas fa-cog fa-fw fc-imis-blue"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Copy To")')
            .addClass('__csi__iep__verb_copy')
            .html('<i class="far fa-clone fa-fw fc-orange"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Move To")')
            .addClass('__csi__iep__verb_move')
            .html('<i class="fas fa-arrow-up-right-from-square fa-fw fc-yellow"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Connect")')
            .addClass('__csi__iep__verb_connect')
            .html('<i class="fas fa-link fa-fw fc-green"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Minimize")')
            .addClass('__csi__iep__verb_minimize')
            .html('<i class="fas fa-window-minimize fa-fw fc-purple"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Restore")')
            .addClass('__csi__iep__verb_restore')
            .html('<i class="fas fa-window-restore fa-fw fc-purple"></i>');
        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Remove")')
            .addClass('__csi__iep__verb_remove')
            .html('<i class="fas fa-trash-can fa-fw fc-red"></i>');
        // Preview Mode
        this.$('div[id$=FieldsPanel]').append("\n            <div class=\"PanelColumn\">\n                <input type=\"checkbox\" id=\"__csi__iep__previewMode\" />\n                <label for=\"__csi__iep__previewMode\">Preview Mode</label>\n            </div>\n        ");
        this.$('#__csi__iep__previewMode').on('change', function (e) {
            if (_this.$(e.target).is(':checked')) {
                _this.$('.WebPartsTitleBar, .WebPartZoneDesignTime, .__csi__iep__zoneName').addClass('__csi__iep__preview');
            }
            else {
                _this.$('.WebPartsTitleBar, .WebPartZoneDesignTime, .__csi__iep__zoneName').removeClass('__csi__iep__preview');
            }
        });
    };
    /**
     * Sources:
     * https://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery
     */
    RiseExtensions.prototype.addJQueryExtensions = function () {
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
    RiseExtensions.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.1 %c ";
    RiseExtensions.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return RiseExtensions;
}());
new RiseExtensions(jQuery);
var CleanUp = /** @class */ (function () {
    function CleanUp() {
    }
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    CleanUp.EmailType = function (json) {
        var _a, _b, _c;
        var email = (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Email', '')) === null || _b === void 0 ? void 0 : _b.replace('Address', '')) === null || _c === void 0 ? void 0 : _c.trim();
        return email ? email : 'Other';
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
        var _a, _b;
        var phone = (_b = (_a = json === null || json === void 0 ? void 0 : json.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Phone', '')) === null || _b === void 0 ? void 0 : _b.trim();
        return phone ? phone : 'Other';
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
var ConfigManager = /** @class */ (function () {
    function ConfigManager(searchBar) {
        this.searchBar = searchBar;
    }
    ConfigManager.GetConfigInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, configItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = chrome.runtime.getURL(this.ConfigPath);
                        return [4 /*yield*/, fetch(url).then(function (data) { return data.json(); })];
                    case 1:
                        configItems = (_a.sent())
                            .sort(function (a, b) { return a.displayName.localeCompare(b.displayName); });
                        return [2 /*return*/, configItems];
                }
            });
        });
    };
    ConfigManager.prototype.SetEventListeners = function (includeTags) {
        var _this = this;
        if (includeTags === void 0) { includeTags = false; }
        // Add hover effects
        $('.commandBarListItem')
            .on("mouseenter", function (e) { return $(e.currentTarget).addClass('commandBarHover'); })
            .on("mouseleave", function (e) { return $(e.currentTarget).removeClass('commandBarHover'); });
        if (includeTags) {
            $('#eventCodeLookup').on("click", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        alert('eventCodeLookup do something...');
                        return [2 /*return*/];
                    });
                });
            });
            $('#usernameLookup').on("click", function () { return __awaiter(_this, void 0, void 0, function () {
                var currentActionBarValue, imisId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            currentActionBarValue = $('#commandBarInput').val();
                            return [4 /*yield*/, this.searchBar.FindUserIdByName(currentActionBarValue)];
                        case 1:
                            imisId = _a.sent();
                            if (imisId === null)
                                return [2 /*return*/];
                            console.log('final userId = ', imisId);
                            this.searchBar.SetUserDetails(imisId);
                            this.searchBar.ActivateTab(this.searchBar.UserDetailsTab);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ConfigManager.prototype.BuildRoutesHTML = function (data) {
        var result = '';
        data.forEach(function (item, i) {
            var content = "\n                <li data-index=\"".concat(i, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(i, "\">\n                    <a href=\"").concat(item.destination, "\" style=\"color: #222; text-decoration: none;\">\n                        ").concat(item.category.length > -1 ?
                "<span style=\"border: 1px solid lightgray; border-radius: 3px; float: left; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; min-width: 90px; text-align: center;\">\n                                ".concat(item.category, "\n                            </span>")
                : '', "\n                        ").concat(item.displayName, "\n                        ").concat(item.isShortcut ?
                "<span style=\"border: 1px solid lightgray; border-radius: 3px; float: right; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px;\">\n                            ~".concat(item.destination, "\n                        </span>")
                : '', "\n                    </a>\n                </li>\n                ");
            result = result.concat(content);
        });
        return result;
    };
    // static myTest(): void
    // {
    //     alert("TEST");
    // }
    // static myTest(userInput: string): void
    // {
    //     alert(userInput);
    // }
    ConfigManager.prototype.BuildTagsHTML = function (data, seed, userInput) {
        var _this = this;
        var result = '';
        data.forEach(function (item, i) {
            var content = '';
            var counter = seed + i;
            switch (item.category.toLowerCase()) {
                case "event code lookup":
                    // different id so that Config.SetEventListeners can setup specific functions for events and username
                    content = "\n                    <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                        <a id=\"eventCodeLookup\" href=\"javascript:void(0);\" role=\"link\" style=\"color: #222; text-decoration: none;\">\n                            ").concat(item.category.length > -1 ? "<span>".concat(item.category, "</span>") : '', "\n                            ").concat(userInput, "\n                        </a>\n                    </li>\n                    ");
                    break;
                case "username lookup":
                    content = "\n                    <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                        <a id=\"usernameLookup\" href=\"javascript:void(0);\" role=\"link\" style=\"color: #222; text-decoration: none;\">\n                            ").concat(item.category.length > -1 ? "<span>".concat(item.category, "</span>") : '', "\n                            ").concat(userInput, "\n                        </a>\n                    </li>\n                    ");
                    break;
                case "documentation lookup":
                    content = "\n                    <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                        <a href=\"").concat(item.destination).concat(userInput, "\" style=\"color: #222; text-decoration: none;\">\n                            ").concat(item.category.length > -1 ? "<span>".concat(item.category).concat(_this.searchBar.ExternalIcon, "</span>") : '', "\n                            ").concat(userInput, "\n                        </a>\n                    </li>\n                    ");
                    break;
                case "keyword search":
                    content = "\n                    <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                        <a href=\"").concat(item.destination).concat(userInput, "\" style=\"color: #222; text-decoration: none;\">\n                            ").concat(item.category.length > -1 ? "<span>".concat(item.category, "</span>") : '', "\n                            ").concat(userInput, "\n                        </a>\n                    </li>\n                    ");
                    break;
                case "imis glossary":
                    content = "\n                    <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                        <a href=\"").concat(item.destination, "\" style=\"color: #222; text-decoration: none; vertical-align: middle;\">\n                            ").concat(item.category.length > -1 ? "<span>".concat(item.category).concat(_this.searchBar.ExternalIcon, "</span>") : '', "\n                        </a>\n                    </li>\n                    ");
                default:
                    break;
            }
            result = result.concat(content);
        });
        return result;
    };
    ConfigManager.ConfigPath = "assets/search-bar-config.json";
    return ConfigManager;
}());
/// <reference path="../settings/settings.ts" />
/// <reference path="../utils.ts" />
var SearchBar = /** @class */ (function () {
    function SearchBar($) {
        this.$ = $;
        this.UserDetailsTab = "UserDetailsTab";
        this.CommandBarSelectTab = "CommandBarSelectTab";
        this.ConfigRoutes = [];
        this.ConfigTags = [];
        //#region SVG Paths
        this.CsiLogoPath = "assets/images/csiicon.svg";
        this.BuildingIconPath = "assets/images/buildingIcon.svg";
        this.CakeIconPath = "assets/images/cakeIcon.svg";
        this.EmailIconPath = "assets/images/emailIcon.svg";
        this.MailboxIconPath = "assets/images/mailboxIcon.svg";
        this.PhoneIconPath = "assets/images/phoneIcon.svg";
        this.UserTagIconPath = "assets/images/userTagIcon.svg";
        this.ExternalIconPath = "assets/images/externalIcon.svg";
        this.ExternalIconBluePath = "assets/images/externalIconBlue.svg";
        this.ExternalIconWhitePath = "assets/images/externalIconWhite.svg";
        this.IdCardBluePath = "assets/images/idCardBlue.svg";
        this.BrowsersIconPath = "assets/images/browserIcon.svg";
        this.LockIconPath = "assets/images/lockIcon.svg";
        this.CloseIconPath = "assets/images/closeIcon.svg";
        //#endregion
        //#region Component Paths
        this.CommandBarPath = "assets/components/commandBar.html";
        this.ShiftButtonPath = "assets/components/buttons/shift.html";
        this.PlusButtonPath = "assets/components/buttons/plus.html";
        this.EnterButtonPath = "assets/components/buttons/enter.html";
        this.EnterButton2Path = "assets/components/buttons/enter2.html";
        this.ControlButtonPath = "assets/components/buttons/control.html";
        this.ControlButton2Path = "assets/components/buttons/control2.html";
        this.PrimaryButtonPath = "assets/components/buttons/primary.html";
        //#endregion
        //#region Assets
        this.CsiLogo = null;
        this.CommandBar = null;
        this.ShiftButton = null;
        this.PlusButton = null;
        this.EnterButton = null;
        this.EnterButton2 = null;
        this.ControlButton = null;
        this.ControlButton2 = null;
        this.PrimaryButton = null;
        // Icons
        this.CakeIcon = null;
        this.BuildingIcon = null;
        this.EmailIcon = null;
        this.MailboxIcon = null;
        this.PhoneIcon = null;
        this.UserTagIcon = null;
        this.ExternalIcon = null;
        this.ExternalIconBlue = null;
        this.ExternalIconWhite = null;
        this.IdCardBlue = null;
        this.BrowsersIcon = null;
        this.LockIcon = null;
        this.CloseIcon = null;
        //#endregion
        // TESTING
        this.RVToken = null;
        this.DocumentationUrl = "https://help.imis.com/enterprise/search.htm";
        this.ClientContext = null;
        this.WebsiteUrl = null;
        this.UserDetailsView = null;
        this.UserDetailsViewPath = "assets/views/userDetailsTab.html";
        this.settings = new Settings($);
        this.config = new ConfigManager(this);
        this.Tabs = [this.CommandBarSelectTab, this.UserDetailsTab];
        if (!Utils.isImisPage($)) {
            // Not iMIS - do nothing
            return;
        }
        // Initialize the module
        this.init();
    }
    /**
     * Initializes the various elements of this module..
     */
    SearchBar.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settings.load()];
                    case 1:
                        config = _a.sent();
                        if (!config.enableWorkbar)
                            return [2 /*return*/];
                        this.$(function () {
                            console.log.apply(console, __spreadArray([SearchBar.VERSION_STRING + "Loaded: Search Bar"], SearchBar.VERSION_STYLES, false));
                            _this.RVToken = _this.$("#__RequestVerificationToken").val();
                            _this.ClientContext = JSON.parse(_this.$('#__ClientContext').val());
                            // we want to prevent non-users from using the searchbar
                            console.log('this.ClientContext.isAnonymous = ', _this.ClientContext.isAnonymous);
                            if (_this.ClientContext.isAnonymous)
                                return;
                            _this.GetResource(_this.CommandBarPath).then(function (data) {
                                _this.$('body').prepend(data);
                            });
                            _this.BuildConfig();
                            _this.GetAllAssets().then(function () {
                                var _a, _b, _c, _d;
                                _this.$("#commandBarOverlay #logo-placeholder").replaceWith((_a = _this.CsiLogo) !== null && _a !== void 0 ? _a : "");
                                _this.$("#commandBarOverlay .externalIconWhite").replaceWith((_b = _this.ExternalIconWhite) !== null && _b !== void 0 ? _b : "");
                                // this.$("#commandBarOverlay .externalIconBlue").replaceWith(this.ExternalIconBlue);
                                _this.$("#commandBarOverlay .externalIcon").replaceWith((_c = _this.ExternalIcon) !== null && _c !== void 0 ? _c : "");
                                _this.$("#commandBarOverlay #commandBarExitButton").html((_d = _this.CloseIcon) !== null && _d !== void 0 ? _d : "");
                            });
                            var keysPressed = {};
                            // on key down
                            _this.$(document).on("keydown", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var isCommandBarVisible, input, url;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            isCommandBarVisible = this.$("#commandBarOverlay").is(":visible");
                                            // Replace space in e.key with "Spacebar"
                                            if (e.key === " ") {
                                                e.key = Settings.SPACEBAR;
                                            }
                                            if (!(!isCommandBarVisible
                                                && e.key.toLowerCase() === config.workbarShortcut.toLowerCase()
                                                && e.ctrlKey === config.workbarKbdCtrl
                                                && e.altKey === config.workbarKbdAlt
                                                && e.shiftKey === config.workbarKbdShift)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.showOverlay()];
                                        case 1:
                                            _a.sent();
                                            e.preventDefault();
                                            return [3 /*break*/, 5];
                                        case 2:
                                            if (!(isCommandBarVisible && e.key === "Escape")) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.hideOverlay()];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            if (isCommandBarVisible && e.key === "Enter" && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"] && this.$("#UserDetailsTab").is(":visible")) {
                                                console.log('UserDetailsTab is VISIBLE -> go to user profile');
                                                if (this.$('#commandBarInput').get(0) === document.activeElement) {
                                                    input = this.$('#commandBarInput').val();
                                                    if (input.length > 0 && $.isNumeric(input) && this.ClientContext !== null) {
                                                        url = "".concat(this.ClientContext.websiteRoot, "Party.aspx?ID=").concat(input);
                                                        window.location.replace(url);
                                                    }
                                                }
                                            }
                                            _a.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); });
                            document.addEventListener('keyup', function (event) {
                                var key = event.key.toLowerCase();
                                delete keysPressed[key];
                                // console.log('keysPressed OFF = ', keysPressed);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchBar.prototype.GetUserCardActions = function (userId) {
        var _a, _b;
        var profileUrl = "".concat((_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.websiteRoot, "Party.aspx?ID=").concat(userId);
        var credentialsUrl = "".concat((_b = this.ClientContext) === null || _b === void 0 ? void 0 : _b.websiteRoot, "AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=").concat(userId);
        return "\n                <div id=\"userCardActions\" class=\"userDetails\">\n                    <div id=\"userCardGoToProfile\" class=\"userCardActionArea\">\n                        ".concat(this.IdCardBlue, "\n                        <a href=\"").concat(profileUrl, "\" class=\"userActionCard\">Profile</a>\n                        ").concat(this.EnterButton2, "\n                    </div>\n                    <div id=\"userCardUserCredentials\" class=\"userCardActionArea\">\n                        ").concat(this.LockIcon, "\n                        <a id=\"userCardUserCredentialsUrl\" href=\"").concat(credentialsUrl, "\" class=\"userActionCard\">User Credentials</a>\n                    </div>\n                </div>\n            ");
    };
    SearchBar.prototype.GetProfile = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
        var status = (_a = data === null || data === void 0 ? void 0 : data.Status) === null || _a === void 0 ? void 0 : _a.Description;
        var memberType = (_b = data === null || data === void 0 ? void 0 : data.AdditionalAttributes) === null || _b === void 0 ? void 0 : _b.$values[0].Value;
        var birthDate = CleanUp.Date(data === null || data === void 0 ? void 0 : data.BirthDate);
        var phone0 = (_d = (_c = data === null || data === void 0 ? void 0 : data.Phones) === null || _c === void 0 ? void 0 : _c.$values[0]) === null || _d === void 0 ? void 0 : _d.Number;
        var phone0Type = CleanUp.Phone((_f = (_e = data === null || data === void 0 ? void 0 : data.Phones) === null || _e === void 0 ? void 0 : _e.$values[0]) === null || _f === void 0 ? void 0 : _f.PhoneType);
        var phone1 = (_h = (_g = data === null || data === void 0 ? void 0 : data.Phones) === null || _g === void 0 ? void 0 : _g.$values[1]) === null || _h === void 0 ? void 0 : _h.Number;
        var phone1Type = CleanUp.Phone((_k = (_j = data === null || data === void 0 ? void 0 : data.Phones) === null || _j === void 0 ? void 0 : _j.$values[1]) === null || _k === void 0 ? void 0 : _k.PhoneType);
        var email1 = (_m = (_l = data === null || data === void 0 ? void 0 : data.Emails) === null || _l === void 0 ? void 0 : _l.$values[0]) === null || _m === void 0 ? void 0 : _m.Address;
        var email1IsPrimary = (_p = (_o = data === null || data === void 0 ? void 0 : data.Emails) === null || _o === void 0 ? void 0 : _o.$values[0]) === null || _p === void 0 ? void 0 : _p.IsPrimary;
        var email1Type = CleanUp.EmailType((_r = (_q = data === null || data === void 0 ? void 0 : data.Emails) === null || _q === void 0 ? void 0 : _q.$values[0]) === null || _r === void 0 ? void 0 : _r.EmailType);
        var email2 = (_t = (_s = data === null || data === void 0 ? void 0 : data.Emails) === null || _s === void 0 ? void 0 : _s.$values[1]) === null || _t === void 0 ? void 0 : _t.Address;
        var email2IsPrimary = (_v = (_u = data === null || data === void 0 ? void 0 : data.Emails) === null || _u === void 0 ? void 0 : _u.$values[1]) === null || _v === void 0 ? void 0 : _v.IsPrimary;
        var email2Type = CleanUp.EmailType((_x = (_w = data === null || data === void 0 ? void 0 : data.Emails) === null || _w === void 0 ? void 0 : _w.$values[1]) === null || _x === void 0 ? void 0 : _x.EmailType);
        var email3 = (_z = (_y = data === null || data === void 0 ? void 0 : data.Emails) === null || _y === void 0 ? void 0 : _y.$values[2]) === null || _z === void 0 ? void 0 : _z.Address;
        var email3IsPrimary = (_1 = (_0 = data === null || data === void 0 ? void 0 : data.Emails) === null || _0 === void 0 ? void 0 : _0.$values[2]) === null || _1 === void 0 ? void 0 : _1.IsPrimary;
        var email3Type = CleanUp.EmailType((_3 = (_2 = data === null || data === void 0 ? void 0 : data.Emails) === null || _2 === void 0 ? void 0 : _2.$values[2]) === null || _3 === void 0 ? void 0 : _3.EmailType);
        var address0 = CleanUp.FullAddress((_6 = (_5 = (_4 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _4 === void 0 ? void 0 : _4.$values[0]) === null || _5 === void 0 ? void 0 : _5.Address) === null || _6 === void 0 ? void 0 : _6.FullAddress);
        var address0Type = CleanUp.AddressPurpose((_8 = (_7 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _7 === void 0 ? void 0 : _7.$values[0]) === null || _8 === void 0 ? void 0 : _8.AddressPurpose);
        var address1 = CleanUp.FullAddress((_11 = (_10 = (_9 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _9 === void 0 ? void 0 : _9.$values[1]) === null || _10 === void 0 ? void 0 : _10.Address) === null || _11 === void 0 ? void 0 : _11.FullAddress);
        var address1Type = CleanUp.AddressPurpose((_13 = (_12 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _12 === void 0 ? void 0 : _12.$values[1]) === null || _13 === void 0 ? void 0 : _13.AddressPurpose);
        var address2 = CleanUp.FullAddress((_16 = (_15 = (_14 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _14 === void 0 ? void 0 : _14.$values[2]) === null || _15 === void 0 ? void 0 : _15.Address) === null || _16 === void 0 ? void 0 : _16.FullAddress);
        var address2Type = CleanUp.AddressPurpose((_18 = (_17 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _17 === void 0 ? void 0 : _17.$values[2]) === null || _18 === void 0 ? void 0 : _18.AddressPurpose);
        var companyName = (_19 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _19 === void 0 ? void 0 : _19.Name;
        var companyId = (_20 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _20 === void 0 ? void 0 : _20.OrganizationPartyId;
        var userTitle = (_21 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _21 === void 0 ? void 0 : _21.Title;
        return "\n            <div id=\"userCardProfile\" class=\"userDetails\">\n                <h3 id=\"destinationUsersName\" style=\"color: #005e7d; margin: 2px\">".concat(data === null || data === void 0 ? void 0 : data.Name, "</h3>\n                <div id=\"details\" style=\"font-size: 90%;\">\n                    <div id=\"userDetailsTop\" style=\"margin: 0px 0px 5px 1px;\">\n                        <span id=\"destinationUsersId\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersIdLabel\">ID: </span>").concat(data === null || data === void 0 ? void 0 : data.Id, "\n                        </span>\n                        <span id=\"destinationUsersStatus\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersStatusLabel\">Status: </span>").concat(status, "\n                        </span>\n                        <span id=\"destinationUsersMemberType\" class=\"userDetails userSpecificDetail\">\n                            <span class=\"Label workBarLabel destinationUsersTypeLabel\">Type: </span>").concat(memberType, "\n                        </span>\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(birthDate ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.CakeIcon, "\n                            <span class=\"textBadge\">Date of Birth</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(birthDate, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber0\">\n                        ").concat(phone0 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone0Type, "</span>\n                            <a href=\"tel:").concat(phone0, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone0, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber1\">\n                        ").concat(phone1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone1Type, "</span>\n                            <a href=\"tel:").concat(phone1, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone1, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail1\">\n                        ").concat(email1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.EmailIcon, "\n                            ").concat(email1IsPrimary ? "".concat(this.PrimaryButton) : "<span class=\"textBadge\">".concat(email1Type, "</span>"), "\n                            <a href=\"mailto:").concat(email1, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email1, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail2\">\n                        ").concat(email2 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.EmailIcon, "\n                            ").concat(email2IsPrimary ? "".concat(this.PrimaryButton) : "<span class=\"textBadge\">".concat(email2Type, "</span>"), "\n                            <a href=\"mailto:").concat(email2, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email2, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail3\">\n                        ").concat(email3 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.EmailIcon, "\n                            ").concat(email3IsPrimary ? "".concat(this.PrimaryButton) : "<span class=\"textBadge\">".concat(email3Type, "</span>"), "\n                            <a href=\"mailto:").concat(email3, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email3, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress0\">\n                        ").concat(address0 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address0Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address0, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress1\">\n                        ").concat(address1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address1Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address1, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress2\">\n                        ").concat(address2 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address2Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address2, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersCompanyName\">\n                        ").concat(companyName ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.BuildingIcon, "\n                            ").concat(companyId ? "\n                                <a href=\"".concat((_22 = this.ClientContext) === null || _22 === void 0 ? void 0 : _22.websiteRoot, "Party.aspx?ID=").concat(companyId, "\">\n                                    <span style=\"vertical-align: middle;\">").concat(companyName, "</span>\n                                    <span class=\"userDetailsBadge\">ID ").concat(companyId, "</span>\n                                </a>\n                                ") : "\n                                <span style=\"vertical-align: middle;\">".concat(companyName, "</span>\n                                <span class=\"userDetailsBadge\">Company ID Not Correctly Linked</span>"), "\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersTitle\">\n                        ").concat(userTitle ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.UserTagIcon, "\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(userTitle, "</span>\n                        </div>") : '', "\n                    </div>\n                </div>\n            </div>\n        ");
    };
    // private GetDocumentationInput(hasInput: boolean, encoded: string, value: string): string
    // {
    //     // need to strip input bc it will inject ANYTHING
    //     if (hasInput)
    //     {
    //         return `
    //             <a id="documentationLinkDestination" href="${this.DocumentationUrl}?q=${encoded}" target="_blank">
    //                 <span id="searchDocumentation" class="TextButton">
    //                     Search iMIS Documentation${this.ExternalIconBlue}
    //                 </span><span style="margin-left: 4px;">${value?.trim()}</span>
    //             </a>
    //         `;
    //     }
    //     else
    //     {
    //         return `
    //             <a id="documentationLinkDestination" href="${this.DocumentationUrl}" target="_blank">
    //                 <span class="TextButton"
    //                     style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
    //                     Search iMIS Documentation
    //                     ${this.ExternalIconBlue}
    //                 </span>
    //             </a>
    //         `;
    //     }
    // }
    SearchBar.prototype.GetUserChangeDetails = function (username, data) {
        var _a, _b, _c, _d;
        var createdOn = CleanUp.Date((_a = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _a === void 0 ? void 0 : _a.CreatedOn);
        var createdBy = (_b = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _b === void 0 ? void 0 : _b.CreatedBy;
        var updatedOn = CleanUp.Date((_c = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _c === void 0 ? void 0 : _c.UpdatedOn);
        var updatedBy = (_d = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _d === void 0 ? void 0 : _d.UpdatedBy;
        return "\n            <div class=\"userDetails\" id=\"userCardChangeDetails\">\n                <span id=\"destinationUsersCreatedOn\">\n                    <span class=\"Label workBarLabel\">Created: </span>".concat(createdOn, "\n                </span>\n                <span id=\"destinationUsersCreatedBy\">by ").concat(createdBy, "</span>\n                <span id=\"destinationUsersUpdatedOn\">\n                    <span class=\"Label workBarLabel\">Last Updated: </span>").concat(updatedOn, "\n                </span>\n                <span id=\"destinationUsersUpdatedBy\">by ").concat(updatedBy, "</span>\n                <span id=\"destinationUsersUsername\">\n                    ").concat(username ? "\n                        <span class=\"Label workBarLabel workBarUsernameLabel\">Username: </span>".concat(username, "\n                    ") : '', "\n                </span> \n            </div>\n        ");
    };
    SearchBar.prototype.GetResource = function (path) {
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
    SearchBar.prototype.GetAllAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            return __generator(this, function (_z) {
                switch (_z.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.GetResource(this.CommandBarPath)];
                    case 1:
                        _a.CommandBar = _z.sent();
                        _b = this;
                        return [4 /*yield*/, this.GetResource(this.CsiLogoPath)];
                    case 2:
                        _b.CsiLogo = _z.sent();
                        _c = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconPath)];
                    case 3:
                        _c.ExternalIcon = _z.sent();
                        _d = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconBluePath)];
                    case 4:
                        _d.ExternalIconBlue = _z.sent();
                        _e = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconWhitePath)];
                    case 5:
                        _e.ExternalIconWhite = _z.sent();
                        _f = this;
                        return [4 /*yield*/, this.GetResource(this.IdCardBluePath)];
                    case 6:
                        _f.IdCardBlue = _z.sent();
                        _g = this;
                        return [4 /*yield*/, this.GetResource(this.BrowsersIconPath)];
                    case 7:
                        _g.BrowsersIcon = _z.sent();
                        _h = this;
                        return [4 /*yield*/, this.GetResource(this.LockIconPath)];
                    case 8:
                        _h.LockIcon = _z.sent();
                        _j = this;
                        return [4 /*yield*/, this.GetResource(this.CloseIconPath)];
                    case 9:
                        _j.CloseIcon = _z.sent();
                        _k = this;
                        return [4 /*yield*/, this.GetResource(this.CakeIconPath)];
                    case 10:
                        _k.CakeIcon = _z.sent();
                        _l = this;
                        return [4 /*yield*/, this.GetResource(this.BuildingIconPath)];
                    case 11:
                        _l.BuildingIcon = _z.sent();
                        _m = this;
                        return [4 /*yield*/, this.GetResource(this.EmailIconPath)];
                    case 12:
                        _m.EmailIcon = _z.sent();
                        _o = this;
                        return [4 /*yield*/, this.GetResource(this.MailboxIconPath)];
                    case 13:
                        _o.MailboxIcon = _z.sent();
                        _p = this;
                        return [4 /*yield*/, this.GetResource(this.PhoneIconPath)];
                    case 14:
                        _p.PhoneIcon = _z.sent();
                        _q = this;
                        return [4 /*yield*/, this.GetResource(this.UserTagIconPath)];
                    case 15:
                        _q.UserTagIcon = _z.sent();
                        _r = this;
                        return [4 /*yield*/, this.GetResource(this.ShiftButtonPath)];
                    case 16:
                        _r.ShiftButton = _z.sent();
                        _s = this;
                        return [4 /*yield*/, this.GetResource(this.PlusButtonPath)];
                    case 17:
                        _s.PlusButton = _z.sent();
                        _t = this;
                        return [4 /*yield*/, this.GetResource(this.EnterButtonPath)];
                    case 18:
                        _t.EnterButton = _z.sent();
                        _u = this;
                        return [4 /*yield*/, this.GetResource(this.EnterButton2Path)];
                    case 19:
                        _u.EnterButton2 = _z.sent();
                        _v = this;
                        return [4 /*yield*/, this.GetResource(this.ControlButtonPath)];
                    case 20:
                        _v.ControlButton = _z.sent();
                        _w = this;
                        return [4 /*yield*/, this.GetResource(this.ControlButton2Path)];
                    case 21:
                        _w.ControlButton2 = _z.sent();
                        _x = this;
                        return [4 /*yield*/, this.GetResource(this.PrimaryButtonPath)];
                    case 22:
                        _x.PrimaryButton = _z.sent();
                        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
                        //1 Build Some Component
                        // inside BUILD:
                        // GET HTML (should already be loaded from GetAllAssets?)
                        // REPLACE TEMPLATE STUFF (should make a func to rip throw all the replace calls)
                        // SAVE TO VAR FOR REUSE (need more this.ABC variables)
                        // TODO: i think this is how i want it below...
                        // this.CommandBarDocumentationInputWithoutValue = await this.GetResource(this.CommandBarDocumentationInputWithoutValuePath);
                        // `
                        //         <a id="documentationLinkDestination" href="${this.DocumentationUrl}" target="_blank">
                        //             <span class="TextButton"
                        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
                        //                 Search iMIS Documentation
                        //                 <i class="externalIconBlue"></i>
                        //             </span>
                        //         </a>
                        //     `;
                        _y = this;
                        return [4 /*yield*/, this.GetResource(this.UserDetailsViewPath)];
                    case 23:
                        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
                        //1 Build Some Component
                        // inside BUILD:
                        // GET HTML (should already be loaded from GetAllAssets?)
                        // REPLACE TEMPLATE STUFF (should make a func to rip throw all the replace calls)
                        // SAVE TO VAR FOR REUSE (need more this.ABC variables)
                        // TODO: i think this is how i want it below...
                        // this.CommandBarDocumentationInputWithoutValue = await this.GetResource(this.CommandBarDocumentationInputWithoutValuePath);
                        // `
                        //         <a id="documentationLinkDestination" href="${this.DocumentationUrl}" target="_blank">
                        //             <span class="TextButton"
                        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
                        //                 Search iMIS Documentation
                        //                 <i class="externalIconBlue"></i>
                        //             </span>
                        //         </a>
                        //     `;
                        _y.UserDetailsView = _z.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Build this Tab on the fly and scrap the whole thing when you're done
    SearchBar.prototype.SetUserDetails = function (userId) {
        if (userId === void 0) { userId = ''; }
        var input = userId ? userId : this.$('#commandBarInput').val();
        console.log('input = ', input);
        // Set up view
        var content = this.UserDetailsView;
        this.$("#UserDetailsTab").replaceWith(content !== null && content !== void 0 ? content : "");
        // Get api data
        var username = this.GetUserName(input); // THIS ONLY GRABS THE USERNAME
        // TODO: this should determin whether or not to set up this view in the first place
        // TODO: extract this and pass in userData if it has it - otherwise stay on commandTab....
        var data = this.GetParty(input);
        // Update view with api data -> right column
        var profile = this.GetProfile(data);
        this.$('#userCardProfile').replaceWith(profile);
        // Update view with api data -> left column
        var userActions = this.GetUserCardActions(input);
        this.$('#userCardActions').replaceWith(userActions);
        // Update Documentation Search Area with Created/Updated stuff
        var changeDetails = this.GetUserChangeDetails(username, data);
        this.$("#userCardChangeDetails").replaceWith(changeDetails);
    };
    SearchBar.prototype.GetParty = function (input) {
        var _a;
        var result = {};
        $.ajax("".concat((_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl, "api/Party/").concat(input), {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers: {
                RequestVerificationToken: this.RVToken
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
    SearchBar.prototype.GetUserName = function (input) {
        var _a;
        var result = '';
        $.ajax("".concat((_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl, "api/User/").concat(input), {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers: {
                RequestVerificationToken: this.RVToken
            },
            success: function (userData) {
                console.log('userData = ', userData);
                result = userData.UserName;
            },
            error: function () {
                console.log('no username for this contact!');
                // DO NOTHING, ITS ALREADY SETUP TO HANDLE N/A
            }
        });
        return result;
    };
    SearchBar.prototype.FindUserIdByName = function (input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': (_a = this.RVToken) !== null && _a !== void 0 ? _a : ""
                            }
                        };
                        return [4 /*yield*/, fetch("".concat((_b = this.ClientContext) === null || _b === void 0 ? void 0 : _b.baseUrl, "api/User?username=").concat(input), options)];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _c.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            return [2 /*return*/, results.Items.$values[0].Party.Id];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchBar.prototype.RemoveUserDetailsInfo = function () {
        this.$("#UserDetailsTab").empty();
    };
    SearchBar.prototype.BuildConfig = function () {
        var _this = this;
        ConfigManager.GetConfigInstance().then(function (data) {
            _this.ConfigRoutes = data.filter(function (d) { return !d.isTag; });
            _this.ConfigTags = data.filter(function (d) { return d.isTag; });
            var view = _this.config.BuildRoutesHTML(_this.ConfigRoutes);
            _this.$('#commandBarUl').html(view);
            _this.config.SetEventListeners();
        });
    };
    // Use this with '' for showing the spinner so that all tabs are hidden
    SearchBar.prototype.ActivateTab = function (activateTab) {
        var _this = this;
        this.Tabs.forEach(function (tab) {
            if (tab == activateTab) {
                _this.$("#".concat(tab)).show();
                if (tab == _this.CommandBarSelectTab) {
                    _this.SetArrowEventListeners();
                }
            }
            else {
                if (tab == _this.CommandBarSelectTab) {
                    //TODO: this is currently bleeding resources...
                    _this.$(".commandBarListItem").off('keydown');
                }
                _this.$("#".concat(tab)).hide();
            }
        });
    };
    SearchBar.prototype.SetArrowEventListeners = function () {
        var _this = this;
        this.$(".commandBarListItem:first").addClass("commandBarSelected");
        // Get all the <li> elements into a collection
        var listItems = this.$(".commandBarListItem");
        // Set up a counter to keep track of which <li> is selected
        var index = 0;
        // Initialize first li as the selected (focused) one:
        this.$(listItems[index]).addClass("commandBarSelected");
        // Set up a key event handler for the document
        // this.$("#commandBarInput").on("keydown", function (event)
        this.$(document).on("keydown", function (event) {
            if (_this.$("#CommandBarSelectTab").is(":visible")) {
                console.log('CommandBarSelectTab is VISIBLE');
                if (listItems.length != _this.$(".commandBarListItem").length) {
                    listItems = _this.$(".commandBarListItem");
                    index = 0;
                }
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault();
                        // Remove the highlighting from the previous element
                        _this.$(listItems[index]).removeClass("commandBarSelected");
                        // Decrease the counter
                        index = index > 0 ? --index : 0;
                        // Highlight the new element
                        _this.$(listItems[index]).addClass("commandBarSelected");
                        // Scroll item into view
                        _this.$(listItems[index])[0].scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        // Remove the highlighting from the previous element
                        _this.$(listItems[index]).removeClass("commandBarSelected");
                        // Increase counter
                        index = index < listItems.length - 1 ? ++index : listItems.length - 1;
                        // Highlight the new element
                        _this.$(listItems[index]).addClass("commandBarSelected");
                        // Scroll item into view
                        _this.$(listItems[index])[0].scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "Enter":
                        event.preventDefault();
                        _this.$(listItems[index]).children()[0].click();
                        break;
                }
            }
        });
    };
    SearchBar.prototype.CaptureInput = function () {
        var _this = this;
        console.log('capture input...');
        var debounce = function (fn, t) {
            var id;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                clearTimeout(id);
                var self = _this;
                id = setTimeout(function () {
                    fn.apply(self, args);
                }, t);
            };
        };
        var userCheck = debounce(function () {
            _this.$('.loaderParent').hide();
            // i think i want this to return a success/fail value? or myb have a separate check to first talk to the api and pass in user data to this call instead and leave it void
            _this.SetUserDetails();
            // based on above, set this to userdetails if success or a not found tab if unsuccessful (this tab will have to have a "not found" type message somewhere)
            // i really dont want this to inside list itmes bc it will dirty everything up and then ill have to actually manage the list
            _this.ActivateTab(_this.UserDetailsTab);
        }, 500);
        this.$('#commandBarInput').on('input', function (event) {
            var currentActionBarValue = _this.$(event.target).val();
            // i think this should encode by default?
            // var currentActionBarValueUriEncoded = encodeURIComponent(currentActionBarValue);
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);
            // Populate Profile Jump Information
            if (isActionBarNumeric === true) {
                console.log('isActionBarNumeric = true');
                _this.ActivateTab('');
                _this.$('.loaderParent').show();
                userCheck();
            }
            else {
                if (_this.$("#CommandBarSelectTab").is(":hidden")) {
                    console.log('CommandBarSelectTab not visible...');
                    if (_this.$('.loaderParent').is(":visible")) {
                        console.log('loaderParent is visible and not numeric... hide...');
                        _this.$('.loaderParent').hide();
                    }
                    console.log('activate commandbar select tab...');
                    _this.ActivateTab(_this.CommandBarSelectTab);
                    console.log('remove user details view...');
                    _this.RemoveUserDetailsInfo();
                }
            }
            if (currentActionBarValue) {
                var filteredSearch = function (result) { return result.score < 0.6; };
                var options = {
                    includeScore: true,
                    ignoreLocation: true,
                    includeMatches: true,
                    findAllMatches: true,
                    threshold: 0.2,
                    keys: ['category', 'displayName', 'altName'],
                    shouldSort: true
                };
                var fuse = new Fuse(_this.ConfigRoutes, options);
                var results = fuse.search(currentActionBarValue);
                var filteredResults = results.filter(filteredSearch).map(function (fr) { return fr.item; });
                var routesHTML = _this.config.BuildRoutesHTML(filteredResults);
                var tagsHTML = _this.config.BuildTagsHTML(_this.ConfigTags, filteredResults.length, currentActionBarValue);
                _this.$('#commandBarUl').html(routesHTML.concat(tagsHTML));
                _this.config.SetEventListeners(true);
            }
            else {
                var routesHTML = _this.config.BuildRoutesHTML(_this.ConfigRoutes);
                _this.$('#commandBarUl').html(routesHTML);
                _this.config.SetEventListeners();
            }
            // this.$(".commandBarListItem:first").addClass("commandBarSelected");
            _this.SetArrowEventListeners();
        });
    };
    SearchBar.prototype.showOverlay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                //if already showing
                if (this.$("#commandBarOverlay").is(":hidden")) {
                    console.log('show overlay...');
                    this.ActivateTab(this.CommandBarSelectTab);
                    this.$('#commandBarOverlay').show();
                    this.$('#commandBarExitButton').on("click", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('exit clicked...');
                                    return [4 /*yield*/, this.hideOverlay()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    this.CaptureInput();
                    this.$('#commandBarInput').trigger("focus");
                    // TODO: fix extra handlers being made
                    // @ts-ignore
                    // console.log($._data(this.$('#commandBarExitButton')[0], 'events'));
                    // // @ts-ignore
                    // console.log($._data(this.$('.commandBarListItem')[0], 'events'));
                    // // @ts-ignore
                    // console.log($._data(this.$('#commandBarInput')[0], 'events'));
                    // // @ts-ignore
                    // console.log($._data(this.$(document)[0], 'events'));
                    // TODO: 'commandBarExitButton'(CLICK) = BLEEDING
                    // TODO: '#commandBarInput'(INPUT) = BLEEDING
                    // TODO: 'document'(KEYDOWN) = BLEEDING
                }
                else {
                    console.log('already showing... do nothing...');
                }
                return [2 /*return*/];
            });
        });
    };
    SearchBar.prototype.hideOverlay = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('hideOverlay called...');
                this.$('#commandBarOverlay').hide();
                // remove handlers
                this.$('#commandBarExitButton').off("click");
                this.$('#commandBarInput').off('input');
                // reset whatever view we left off on back to the original
                this.$('#commandBarInput').val('');
                // todo: add search results / config clearing
                this.RemoveUserDetailsInfo();
                return [2 /*return*/];
            });
        });
    };
    SearchBar.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.1 %c ";
    SearchBar.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return SearchBar;
}());
new SearchBar(jQuery);
