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
        this.origConfig = {};
        this.defaultConfig = {
            enableIqa: true,
            enableRise: true,
            enableWorkbar: true,
            workbarShortcut: Settings.SPACEBAR,
            workbarKbdCtrl: true,
            workbarKbdAlt: false,
            workbarKbdShift: false
        };
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
                        $('#enable-iqa').prop('checked', config.enableIqa);
                        $('#enable-rise').prop('checked', config.enableRise);
                        $('#enable-workbar').prop('checked', config.enableWorkbar);
                        $('#workbar-kbd').val(config.workbarShortcut);
                        $('#kbd-ctrl').prop('checked', config.workbarKbdCtrl);
                        $('#kbd-alt').prop('checked', config.workbarKbdAlt);
                        $('#kbd-shift').prop('checked', config.workbarKbdShift);
                        $('#enable-workbar').on('change', function () {
                            _this.updateDependentControlState();
                        });
                        this.updateDependentControlState();
                        this.origConfig = config;
                        $('input').on('change keydown', function () {
                            if (_this.origConfig.enableIqa !== $('#enable-iqa').prop('checked')
                                || _this.origConfig.enableRise !== $('#enable-rise').prop('checked')
                                || _this.origConfig.enableWorkbar !== $('#enable-workbar').prop('checked')
                                || _this.origConfig.workbarShortcut !== $('#workbar-kbd').val()
                                || _this.origConfig.workbarKbdCtrl !== $('#kbd-ctrl').prop('checked')
                                || _this.origConfig.workbarKbdAlt !== $('#kbd-alt').prop('checked')
                                || _this.origConfig.workbarKbdShift !== $('#kbd-shift').prop('checked')) {
                                $('#reload-notice').slideDown(100);
                            }
                            else {
                                $('#reload-notice').slideUp(100);
                            }
                        });
                        $('#reload-notice').on('click', function () {
                            $('#reload-notice span').text('Reloading...').css('opacity', '0.5');
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                chrome.tabs.reload(tabs[0].id)
                                    .then(function () {
                                    return setTimeout(function () { return window.close(); }, 1000);
                                });
                            });
                        });
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
    Settings.prototype.updateDependentControlState = function () {
        if ($('#enable-workbar').prop('checked')) {
            $('#workbar-kbd').prop('disabled', false);
            $('#kbd-ctrl').prop('disabled', false);
            $('#kbd-alt').prop('disabled', false);
            $('#kbd-shift').prop('disabled', false);
        }
        else {
            $('#workbar-kbd').prop('disabled', true);
            $('#kbd-ctrl').prop('disabled', true);
            $('#kbd-alt').prop('disabled', true);
            $('#kbd-shift').prop('disabled', true);
        }
    };
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
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.sync.get(_this.defaultConfig, function (settings) {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    /** Logs to the console if console output is enabled */
    Utils.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.ENABLE_CONSOLE_OUTPUT)
            Utils.log.apply(Utils, args);
    };
    /** Change this to true to enable console output for debugging */
    Utils.ENABLE_CONSOLE_OUTPUT = false;
    Utils.VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    return Utils;
}());
var Debouncer = /** @class */ (function () {
    function Debouncer() {
    }
    /** Starts a debounce operation with args */
    Debouncer.prototype.start = function (callback, delay) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        Utils.log('Started debounce operation');
        this.stop();
        this.id = window.setTimeout.apply(window, __spreadArray([callback, delay], args, false));
    };
    Object.defineProperty(Debouncer.prototype, "isRunning", {
        /** Gets if the current debounce operation is running */
        get: function () {
            return this.id !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    /** Stops the current debounce operation */
    Debouncer.prototype.stop = function () {
        if (this.id) {
            Utils.log('Stopped debounce operation');
            window.clearTimeout(this.id);
        }
        else {
            Utils.log('No debounce operation to stop');
        }
    };
    return Debouncer;
}());
/// <reference path="settings/settings.ts" />
/// <reference path="utils.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
        Utils.log.apply(Utils, __spreadArray([Utils.VERSION_STRING + "Loaded: IQA Module"], IqaExtensions.VERSION_STYLES, false));
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
        Utils.log.apply(Utils, __spreadArray([Utils.VERSION_STRING + "Loaded: IQA Extensions"], IqaExtensions.VERSION_STYLES, false));
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
        // Sticky the header and top buttons
        this.$('#MainPanel > div[id$=ContentPanel] .Section').first().css({
            position: 'sticky',
            top: '0',
            backgroundColor: 'white',
            borderBottom: '1px solid #DDD',
            paddingBottom: '1rem',
            zIndex: '999'
        });
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
        else {
            this.$('div[id*="SourcesPanel_Body"] table.Grid tr.GridHeader td:last-child').css('width', '35px').css('min-width', '25px');
        }
        this.$('div[id*="SourcesPanel_Body"] table.Grid tr:first-child td:nth-last-child(2)').css('min-width', '150px');
        // Copy the border style inside tr.GridHeader from the third column to the last column
        this.$('div[id*="SourcesPanel_Body"] table.Grid tr.GridHeader td:nth-child(3)').each(function (_, e) {
            _this.$(e).nextAll('td').css('border', _this.$(e).css('border'));
        });
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
        // Query for all table rows after the queryOptsRow
        queryOptsRow.nextAll('tr').find('td').css('border-width', '0');
        // Consistent bolding
        queryOptsRow.nextAll('tr').find('td.PanelTablePrompt span').css('font-weight', '600');
        ft.find('table.Grid tr.GridHeader td:last-child').css('min-width', '140px');
        ft.find('table.Grid tr.GridHeader td:nth-last-child(2)').css('min-width', '180px');
        ft.find('table.Grid tr.GridHeader td:contains("Function")').parent('tr').find('td:nth-last-child(2)').text('Prompt Label');
        // Value column - excludes any combo pickers (in EMS we can have select pickers in the value column)
        if (!isImis2017) {
            ft.find('table.Grid tr.GridRow td:nth-child(5) input[type=text], table.Grid tr.GridAlternateRow td:nth-child(5) input[type=text]').each(function (_, e) {
                var _a;
                if (_this.$(e).parents('span.rcbInner').length === 0) {
                    var betweenComparison = ((_a = _this.$(e).parents('tr').find('td:nth-child(3) select').val()) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) === 'between';
                    var hasCalendarInput = _this.$(e).parents('tr').find('td:nth-child(5) span.CalendarInput').length;
                    if (!betweenComparison && !hasCalendarInput) {
                        _this.$(e).css('width', 'calc(100% - 130px)');
                    }
                }
            });
        }
        // Special case for "between" with date pickers in EMS
        ft.find('table.Grid tr td:nth-child(5) table.GridFilterCalendar td[nowrap] > span > input[type=text]').attr('style', 'width: 110px !important');
        // Find any .RadComboBox items inside the 5th column and set a negative margin
        ft.find('table.Grid tr.GridRow td:nth-child(5) .RadComboBox, table.Grid tr.GridAlternateRow td:nth-child(5) .RadComboBox').css('margin-top', '-4px');
        if (isImis2017) {
            ft.find('td.PanelTablePrompt').parent().find('td').filter(':empty').remove();
            ft.find('td.PanelTablePrompt').parent().find('td').css('border', '0').css('background-color', 'transparent');
            ft.find('td.PanelTablePrompt:eq(1)').append(ft.find('td.PanelTablePrompt:eq(1)').parent().find('input[type=text]'));
        }
        // Fix Values column still being too small
        ft.find('table.Grid tr.GridRow, table.Grid tr.GridAlternateRow').find('td input[type=text]').css('min-width', '150px');
        queryOptsRow.before(ft.find('tbody > tr').first());
        // Prompt inputs full width
        ft.find('table.Grid tr td:nth-last-child(2) input').css('width', '100%');
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
        dt.find('tr.GridHeader td:nth-child(2)').css('width', 'width: 35%');
        dt.find('tr.GridHeader td:last-child').css('width', '50px');
        dt.find('tr.GridHeader td:nth-child(3)').css('width', '110px');
        dt.find('tr.GridHeader td:nth-child(6)').css('width', '82px');
        dt.find('tr:first-child td').css('border', '0').css('border-bottom', '1px solid #ddd');
        // Sticky Table Headers
        var commonStickyStyles = {
            position: 'sticky',
            top: '56px',
            borderBottom: '1px solid #DDD'
        };
        dt.find('table.Grid tr:nth-child(2) td:first-child').css(__assign({ zIndex: '990' }, commonStickyStyles));
        dt.find('table.Grid tr:nth-child(2) td:nth-child(2)').css(__assign({ zIndex: '992' }, commonStickyStyles));
        dt.find('table.Grid .SectionTitle:contains("Available")').closest('td').css(__assign({ zIndex: '991' }, commonStickyStyles));
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
            var _a;
            // Get the contents of the cell - possibly custom SQL
            var expr = (_a = _this.$(el).find('td:nth-child(2)').text()) === null || _a === void 0 ? void 0 : _a.toString().toUpperCase();
            if (isImis2017 && ($(el).find('td:nth-child(3) select option').length === 1
                && _this.$(el).find('td:nth-child(8) input').is(':disabled'))
                || !isImis2017 && ($(el).find('td:nth-child(3) select option').length === 1
                    && _this.$(el).find('td:nth-child(6) input').length === 0)
                || /CASE\s+?WHEN/gim.test(expr) || (expr.indexOf('(') > -1 && expr.indexOf(')') > -1)) {
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
        Utils.log.apply(Utils, __spreadArray([Utils.VERSION_STRING + "Loaded: RiSE Module"], RiseExtensions.VERSION_STYLES, false));
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
    RiseExtensions.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return RiseExtensions;
}());
new RiseExtensions(jQuery);
var ApiHelper = /** @class */ (function () {
    function ApiHelper() {
    }
    ApiHelper.prototype.getParty = function (input, rvToken, baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': rvToken
                            }
                        };
                        return [4 /*yield*/, fetch("".concat(baseUrl, "api/Party?PartyId=").concat(input), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            // Utils.log('GetParty results = ', results);
                            return [2 /*return*/, results.Items.$values[0]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiHelper.prototype.getEvent = function (input, rvToken, baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': rvToken
                            }
                        };
                        return [4 /*yield*/, fetch("".concat(baseUrl, "api/Event?EventId=").concat(input), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            // Utils.log('GetEvent results = ', results);
                            return [2 /*return*/, results.Items.$values[0]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiHelper.prototype.getEventCategory = function (input, rvToken, baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': rvToken
                            }
                        };
                        return [4 /*yield*/, fetch("".concat(baseUrl, "api/EventCategory?EventCategoryId=").concat(input), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            // Utils.log('GetEventCategory results = ', results);
                            return [2 /*return*/, results.Items.$values[0].Description];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiHelper.prototype.getUserName = function (input, rvToken, baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': rvToken
                            }
                        };
                        return [4 /*yield*/, fetch("".concat(baseUrl, "api/User?UserId=").concat(input), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            // Utils.log('GetUserName results = ', results);
                            return [2 /*return*/, results.Items.$values[0].UserName];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiHelper.prototype.findUserIdByName = function (input, rvToken, baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'RequestVerificationToken': rvToken
                            }
                        };
                        return [4 /*yield*/, fetch("".concat(baseUrl, "api/User?UserName=").concat(input), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        if (results.Count !== 1) {
                            return [2 /*return*/, null];
                        }
                        else {
                            // Utils.log('FindUserIdByName results = ', results);
                            return [2 /*return*/, results.Items.$values[0].UserId];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiHelper.prototype.getLatestConfigJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Utils.log('GetLatestConfigJson');
                        return [4 /*yield*/, fetch('https://cdn.cloud.csiinc.com/iep/config.json', { cache: 'no-cache', method: 'GET' })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        results = _a.sent();
                        // console.log('results = ', results);
                        if (results.length > 0) {
                            // console.log('GetLatestConfigJson results = ', results);
                            return [2 /*return*/, results];
                        }
                        // Utils.log('GetUserName results = ', results);
                        return [2 /*return*/, results.Items.$values[0].UserName];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    return ApiHelper;
}());
var AssetHelper = /** @class */ (function () {
    function AssetHelper() {
        //#region Asset Paths
        //View Paths
        this.CommandBarPath = "assets/components/commandBar.html";
        this.EventDetailsViewPath = "assets/views/eventDetailsTab.html";
        this.OpenSearchViewPath = "assets/views/openSearch.html";
        this.UserDetailsViewPath = "assets/views/userDetailsTab.html";
        //SVG Paths
        this.BrowsersIconPath = "assets/images/browserIcon.svg";
        this.BuildingIconPath = "assets/images/buildingIcon.svg";
        this.CakeIconPath = "assets/images/cakeIcon.svg";
        this.CalendarIconPath = "assets/images/calendarIcon.svg";
        this.CalendarLinesPenIconPath = "assets/images/calendarLinesPenIcon.svg";
        this.ChartLineIconPath = "assets/images/chartLineIcon.svg";
        this.CloseIconPath = "assets/images/closeIcon.svg";
        this.CsiLogoPath = "assets/images/csiicon.svg";
        this.DescriptionIconPath = "assets/images/descriptionIcon.svg";
        this.EmailIconPath = "assets/images/emailIcon.svg";
        this.ExternalIconBluePath = "assets/images/externalIconBlue.svg";
        this.ExternalIconPath = "assets/images/externalIcon.svg";
        this.ExternalIconWhitePath = "assets/images/externalIconWhite.svg";
        this.IdCardBluePath = "assets/images/idCardBlue.svg";
        this.LinkSolidIconPath = "assets/images/linkSolidIcon.svg";
        this.LockIconPath = "assets/images/lockIcon.svg";
        this.MailboxIconPath = "assets/images/mailboxIcon.svg";
        this.MenuIconPath = "assets/images/menuIcon.svg";
        this.PhoneIconPath = "assets/images/phoneIcon.svg";
        this.UserTagIconPath = "assets/images/userTagIcon.svg";
        //Component Paths
        this.ControlButtonPath = "assets/components/buttons/control.html";
        this.ControlButton2Path = "assets/components/buttons/control2.html";
        this.EnterButtonPath = "assets/components/buttons/enter.html";
        this.EnterButton2Path = "assets/components/buttons/enter2.html";
        this.PlusButtonPath = "assets/components/buttons/plus.html";
        this.PrimaryButtonPath = "assets/components/buttons/primary.html";
        this.ShiftButtonPath = "assets/components/buttons/shift.html";
        this.VersionBadgeEMSPath = "assets/components/buttons/VersionBadge_ems.html";
        this.VersionBadge2017Path = "assets/components/buttons/VersionBadge_2017.html";
        //#endregion
        //#region Assets
        // Views
        this.CommandBar = null;
        this.EventDetailsView = null;
        this.OpenSearchView = null;
        this.UserDetailsView = null;
        // Icons
        this.BrowsersIcon = null;
        this.BuildingIcon = null;
        this.CakeIcon = null;
        this.CalendarIcon = null;
        this.CalendarLinesPenIcon = null;
        this.ChartLineIcon = null;
        this.CloseIcon = null;
        this.CsiLogo = null;
        this.DescriptionIcon = null;
        this.EmailIcon = null;
        this.ExternalIconBlue = null;
        this.ExternalIcon = null;
        this.ExternalIconWhite = null;
        this.IdCardBlue = null;
        this.LinkSolidIcon = null;
        this.LockIcon = null;
        this.MailboxIcon = null;
        this.MenuIcon = null;
        this.PhoneIcon = null;
        this.UserTagIcon = null;
        // Components
        this.ControlButton = null;
        this.ControlButton2 = null;
        this.EnterButton = null;
        this.EnterButton2 = null;
        this.PlusButton = null;
        this.PrimaryButton = null;
        this.ShiftButton = null;
        this.VersionBadgeEMS = null;
        this.VersionBadge2017 = null;
    }
    //#endregion
    AssetHelper.prototype.GetResource = function (path) {
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
    AssetHelper.prototype.GetAllAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
            return __generator(this, function (_9) {
                switch (_9.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.GetResource(this.CommandBarPath)];
                    case 1:
                        _a.CommandBar = _9.sent();
                        _b = this;
                        return [4 /*yield*/, this.GetResource(this.EventDetailsViewPath)];
                    case 2:
                        _b.EventDetailsView = _9.sent();
                        _c = this;
                        return [4 /*yield*/, this.GetResource(this.OpenSearchViewPath)];
                    case 3:
                        _c.OpenSearchView = _9.sent();
                        _d = this;
                        return [4 /*yield*/, this.GetResource(this.UserDetailsViewPath)];
                    case 4:
                        _d.UserDetailsView = _9.sent();
                        _e = this;
                        return [4 /*yield*/, this.GetResource(this.BrowsersIconPath)];
                    case 5:
                        _e.BrowsersIcon = _9.sent();
                        _f = this;
                        return [4 /*yield*/, this.GetResource(this.BuildingIconPath)];
                    case 6:
                        _f.BuildingIcon = _9.sent();
                        _g = this;
                        return [4 /*yield*/, this.GetResource(this.CakeIconPath)];
                    case 7:
                        _g.CakeIcon = _9.sent();
                        _h = this;
                        return [4 /*yield*/, this.GetResource(this.CalendarIconPath)];
                    case 8:
                        _h.CalendarIcon = _9.sent();
                        _j = this;
                        return [4 /*yield*/, this.GetResource(this.CalendarLinesPenIconPath)];
                    case 9:
                        _j.CalendarLinesPenIcon = _9.sent();
                        _k = this;
                        return [4 /*yield*/, this.GetResource(this.ChartLineIconPath)];
                    case 10:
                        _k.ChartLineIcon = _9.sent();
                        _l = this;
                        return [4 /*yield*/, this.GetResource(this.CloseIconPath)];
                    case 11:
                        _l.CloseIcon = _9.sent();
                        _m = this;
                        return [4 /*yield*/, this.GetResource(this.CsiLogoPath)];
                    case 12:
                        _m.CsiLogo = _9.sent();
                        _o = this;
                        return [4 /*yield*/, this.GetResource(this.DescriptionIconPath)];
                    case 13:
                        _o.DescriptionIcon = _9.sent();
                        _p = this;
                        return [4 /*yield*/, this.GetResource(this.EmailIconPath)];
                    case 14:
                        _p.EmailIcon = _9.sent();
                        _q = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconBluePath)];
                    case 15:
                        _q.ExternalIconBlue = _9.sent();
                        _r = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconPath)];
                    case 16:
                        _r.ExternalIcon = _9.sent();
                        _s = this;
                        return [4 /*yield*/, this.GetResource(this.ExternalIconWhitePath)];
                    case 17:
                        _s.ExternalIconWhite = _9.sent();
                        _t = this;
                        return [4 /*yield*/, this.GetResource(this.IdCardBluePath)];
                    case 18:
                        _t.IdCardBlue = _9.sent();
                        _u = this;
                        return [4 /*yield*/, this.GetResource(this.LinkSolidIconPath)];
                    case 19:
                        _u.LinkSolidIcon = _9.sent();
                        _v = this;
                        return [4 /*yield*/, this.GetResource(this.LockIconPath)];
                    case 20:
                        _v.LockIcon = _9.sent();
                        _w = this;
                        return [4 /*yield*/, this.GetResource(this.MailboxIconPath)];
                    case 21:
                        _w.MailboxIcon = _9.sent();
                        _x = this;
                        return [4 /*yield*/, this.GetResource(this.MenuIconPath)];
                    case 22:
                        _x.MenuIcon = _9.sent();
                        _y = this;
                        return [4 /*yield*/, this.GetResource(this.PhoneIconPath)];
                    case 23:
                        _y.PhoneIcon = _9.sent();
                        _z = this;
                        return [4 /*yield*/, this.GetResource(this.UserTagIconPath)];
                    case 24:
                        _z.UserTagIcon = _9.sent();
                        _0 = this;
                        return [4 /*yield*/, this.GetResource(this.ControlButtonPath)];
                    case 25:
                        _0.ControlButton = _9.sent();
                        _1 = this;
                        return [4 /*yield*/, this.GetResource(this.ControlButton2Path)];
                    case 26:
                        _1.ControlButton2 = _9.sent();
                        _2 = this;
                        return [4 /*yield*/, this.GetResource(this.EnterButtonPath)];
                    case 27:
                        _2.EnterButton = _9.sent();
                        _3 = this;
                        return [4 /*yield*/, this.GetResource(this.EnterButton2Path)];
                    case 28:
                        _3.EnterButton2 = _9.sent();
                        _4 = this;
                        return [4 /*yield*/, this.GetResource(this.PlusButtonPath)];
                    case 29:
                        _4.PlusButton = _9.sent();
                        _5 = this;
                        return [4 /*yield*/, this.GetResource(this.PrimaryButtonPath)];
                    case 30:
                        _5.PrimaryButton = _9.sent();
                        _6 = this;
                        return [4 /*yield*/, this.GetResource(this.ShiftButtonPath)];
                    case 31:
                        _6.ShiftButton = _9.sent();
                        _7 = this;
                        return [4 /*yield*/, this.GetResource(this.VersionBadgeEMSPath)];
                    case 32:
                        _7.VersionBadgeEMS = _9.sent();
                        _8 = this;
                        return [4 /*yield*/, this.GetResource(this.VersionBadge2017Path)];
                    case 33:
                        _8.VersionBadge2017 = _9.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AssetHelper;
}());
var ConfigManager = /** @class */ (function () {
    function ConfigManager(searchBar, apiHelper, assetHelper) {
        this.searchBar = searchBar;
        this.apiHelper = apiHelper;
        this.assetHelper = assetHelper;
    }
    ConfigManager.prototype.checkForConfigUpdate = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var now, lastUpdated, lastUpdatedDate, config, configData;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        now = new Date();
                        now.setUTCHours(0, 0, 0, 0);
                        return [4 /*yield*/, chrome.storage.local.get([ConfigManager.Chrome_LastUpdatedKey])];
                    case 1:
                        lastUpdated = (_c.sent())[ConfigManager.Chrome_LastUpdatedKey];
                        Utils.log('lastUpdated = ', lastUpdated);
                        if (!(lastUpdated !== undefined)) return [3 /*break*/, 6];
                        Utils.log('lastUpdatedKey in chrome.storage.local');
                        lastUpdatedDate = new Date(lastUpdated);
                        lastUpdatedDate.setUTCHours(0, 0, 0, 0);
                        if (!(lastUpdatedDate < now)) return [3 /*break*/, 5];
                        Utils.log('lastUpdatedDate < now');
                        return [4 /*yield*/, this.apiHelper.getLatestConfigJson()];
                    case 2:
                        config = _c.sent();
                        if (!(config && config.length > 0)) return [3 /*break*/, 5];
                        Utils.log('CheckForConfigUpdate -> GetLatestConfigJson -> config = ', config);
                        return [4 /*yield*/, this.setConfig(config, now)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, chrome.storage.local.set((_b = {}, _b[ConfigManager.Chrome_LastUpdatedKey] = (_a = now.toISOString()) === null || _a === void 0 ? void 0 : _a.split('T')[0], _b))];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        Utils.log('lastUpdatedKey NOT in chrome.storage.local');
                        return [4 /*yield*/, this.getInitialConfig()];
                    case 7:
                        configData = _c.sent();
                        return [4 /*yield*/, this.setConfig(configData, now)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ConfigManager.prototype.setConfig = function (data, now) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        Utils.log('SetConfig');
                        return [4 /*yield*/, chrome.storage.local.set((_b = {}, _b[ConfigManager.Chrome_ConfigKey] = data, _b))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, chrome.storage.local.set((_c = {}, _c[ConfigManager.Chrome_LastUpdatedKey] = (_a = now.toISOString()) === null || _a === void 0 ? void 0 : _a.split('T')[0], _c))];
                    case 2:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigManager.prototype.getInitialConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, lastestData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Utils.log('GetInitialConfig');
                        result = [];
                        return [4 /*yield*/, this.apiHelper.getLatestConfigJson()];
                    case 1:
                        lastestData = _a.sent();
                        if (!(lastestData && lastestData.length > 0)) return [3 /*break*/, 2];
                        result = lastestData;
                        Utils.log('GetInitialConfig -> GetLatestConfigJson -> Server Data = ', result);
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, fetch(chrome.runtime.getURL(ConfigManager.ConfigPath))];
                    case 3:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 4:
                        result = (_a.sent());
                        Utils.log('GetInitialConfig -> GetLatestConfigJson -> Local Data = ', result);
                        _a.label = 5;
                    case 5: return [2 /*return*/, result.sort(function (a, b) { return a.displayName.localeCompare(b.displayName); })];
                }
            });
        });
    };
    ConfigManager.prototype.getChromeConfig = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Utils.log('GetChromeConfig');
                        return [4 /*yield*/, chrome.storage.local.get([ConfigManager.Chrome_ConfigKey])];
                    case 1:
                        data = (_b.sent()).iep__searchbBar__config;
                        // Append baseUrls for iMIS links that have client specific urls
                        if (((_a = this.searchBar.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) != null && this.searchBar.ClientContext.baseUrl != "/") {
                            data.forEach(function (item) {
                                var _a;
                                if (item.destination.length > 0 && !_this.isValidUrl(item.destination)) {
                                    var base = (_a = _this.searchBar.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl.slice(0, -1);
                                    item.destination = base + item.destination;
                                }
                            });
                        }
                        return [2 /*return*/, data.sort(function (a, b) { return a.displayName.localeCompare(b.displayName); })];
                }
            });
        });
    };
    ConfigManager.prototype.setEventListeners = function (rvToken, baseUrl, includeTags) {
        var _this = this;
        if (includeTags === void 0) { includeTags = false; }
        // $('.commandBarListItem').off("mouseenter mouseleave click");
        $('.commandBarListItem')
            .on("mouseenter", function (e) { return $(e.currentTarget).addClass('commandBarHover'); })
            .on("mouseleave", function (e) { return $(e.currentTarget).removeClass('commandBarHover'); })
            .on('click', function (e) {
            var anchorId = $(e.currentTarget).find('a').attr('id');
            if (anchorId != "usernameLookup" && anchorId != "eventCodeLookup"
                && $(e.currentTarget).find('.lookupLoader').length == 0) {
                $(e.currentTarget).find('a').append(_this.searchBar.getLoader());
            }
        });
        if (includeTags) {
            var input = $('#commandBarInput').val();
            $('#eventCodeLookup').on("click", function () { return __awaiter(_this, void 0, void 0, function () {
                var event;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $('#eventCodeLookup').append(this.searchBar.getLoader());
                            return [4 /*yield*/, this.apiHelper.getEvent(input, rvToken, baseUrl)];
                        case 1:
                            event = _a.sent();
                            if (!(event == null)) return [3 /*break*/, 2];
                            $('#eventCodeLookup .lookupLoader').remove();
                            if ($('#eventCodeLookup .lookupErrorBadge').length === 0) {
                                $('#eventCodeLookup').append(this.searchBar.getLookupErrorBadge());
                            }
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.searchBar.setEventDetails(event)];
                        case 3:
                            _a.sent();
                            this.searchBar.activateTab(this.searchBar.EventDetailsTab);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            $('#usernameLookup').on("click", function () { return __awaiter(_this, void 0, void 0, function () {
                var imisId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $('#usernameLookup').append(this.searchBar.getLoader());
                            return [4 /*yield*/, this.apiHelper.findUserIdByName(input, rvToken, baseUrl)];
                        case 1:
                            imisId = _a.sent();
                            if (!(imisId == null)) return [3 /*break*/, 2];
                            $('#usernameLookup .lookupLoader').remove();
                            if ($('#usernameLookup .lookupErrorBadge').length === 0) {
                                $('#usernameLookup').append(this.searchBar.getLookupErrorBadge());
                            }
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.searchBar.setUserDetails(imisId)];
                        case 3:
                            _a.sent();
                            this.searchBar.activateTab(this.searchBar.UserDetailsTab);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ConfigManager.prototype.isValidUrl = function (urlString) {
        try {
            return Boolean(new URL(urlString));
        }
        catch (e) {
            return false;
        }
    };
    ConfigManager.prototype.convertToCamelCase = function (input) {
        return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) { return chr.toUpperCase(); });
    };
    ConfigManager.prototype.buildRoutesHtml = function (data) {
        var _this = this;
        var result = '';
        data.forEach(function (item, i) {
            var _a;
            var displayNameWithBadge = _this.addVersionBadge(item.displayName);
            var category = item.category.length > -1 ? "<span class=\"searchCategory\">".concat(item.category, "</span>") : '';
            var externalLinkBadge = _this.isValidUrl(item.destination) ? (_a = _this.assetHelper.ExternalIcon) === null || _a === void 0 ? void 0 : _a.replace("margin-left: 6px;", "margin-left: 3px;") : '';
            var shortcut = item.isShortcut ? "<span class=\"searchDestination\">~".concat(item.destination, "</span>") : '';
            result = result.concat("\n                <li data-index=\"".concat(i, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(i, "\">\n                    <a href=\"").concat(item.destination, "\" style=\"color: #222; text-decoration: none;\">\n                        ").concat(category, "\n                        ").concat(displayNameWithBadge, "\n                        ").concat(externalLinkBadge, "\n                        ").concat(shortcut, "\n                    </a>\n                </li>\n            "));
        });
        return result;
    };
    ConfigManager.prototype.addVersionBadge = function (input) {
        var displayName = "<span class=\"searchDisplayName\">".concat(input, "</span>");
        var oldVersion = "(2017)";
        var newVersion = "(EMS)";
        if (input.includes(oldVersion)) {
            displayName = displayName.replace(oldVersion, '');
            return displayName + this.assetHelper.VersionBadge2017;
        }
        else if (input.includes(newVersion)) {
            displayName = displayName.replace(newVersion, '');
            return displayName + this.assetHelper.VersionBadgeEMS;
        }
        return displayName;
    };
    ConfigManager.prototype.buildTagsHtml = function (data, seed, userInput) {
        var _this = this;
        var result = '';
        data.forEach(function (item, i) {
            var _a;
            var counter = seed + i;
            var id = _this.convertToCamelCase(item.category);
            var destination = id == "eventCodeLookup" || id == "usernameLookup" ? '' : "href=\"".concat(item.destination).concat(userInput, "\" ");
            var category = item.category.length > -1 ? "<span class=\"searchCategory\">".concat(item.category, "</span>") : '';
            var externalLinkBadge = _this.isValidUrl(item.destination) ? (_a = _this.assetHelper.ExternalIcon) === null || _a === void 0 ? void 0 : _a.replace("margin-left: 6px;", "margin-left: 3px;") : '';
            result = result.concat("\n                <li data-index=\"".concat(counter, "\" class=\"commandBarListItem\" name=\"commandBar\" id=\"commandBar").concat(counter, "\">\n                    <a id=\"").concat(id, "\" ").concat(destination, "style=\"color: #222; text-decoration: none;\">\n                        ").concat(category, "\n                        <span class=\"searchDisplayName\">").concat(userInput, "</span>\n                        ").concat(externalLinkBadge, "\n                    </a>\n                </li>\n            "));
        });
        return result;
    };
    ConfigManager.ConfigPath = "assets/search-bar-config.json";
    ConfigManager.Chrome_LastUpdatedKey = "iep__searchbBar__lastUpdated";
    ConfigManager.Chrome_ConfigKey = "iep__searchbBar__config";
    return ConfigManager;
}());
var Sanitizer = /** @class */ (function () {
    function Sanitizer() {
    }
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    Sanitizer.emailType = function (data) {
        var _a, _b, _c;
        // return data?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim() ?? 'Other';
        var email = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Email', '')) === null || _b === void 0 ? void 0 : _b.replace('Address', '')) === null || _c === void 0 ? void 0 : _c.trim();
        return email ? email : 'Other';
    };
    // ex: pass in jsonData?.UpdateInformation?.UpdatedOn
    Sanitizer.date = function (data) {
        var _a, _b, _c;
        return !data ? '' : (_c = (_b = (_a = new Date(data += 'Z')) === null || _a === void 0 ? void 0 : _a.toISOString()) === null || _b === void 0 ? void 0 : _b.split('T')[0]) !== null && _c !== void 0 ? _c : '';
    };
    // ex: pass in jsonData?.Phones?.$values[2]?.PhoneType
    Sanitizer.phone = function (data) {
        var _a, _b;
        var phone = (_b = (_a = data === null || data === void 0 ? void 0 : data.replace('_', '')) === null || _a === void 0 ? void 0 : _a.replace('Phone', '')) === null || _b === void 0 ? void 0 : _b.trim();
        return phone ? phone : 'Other';
    };
    // ex: jsonData?.Addresses?.$values[0]?.Address?.FullAddress
    Sanitizer.fullAddress = function (data) {
        var _a, _b, _c;
        return (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.replace('UNITED STATES', 'United States')) === null || _a === void 0 ? void 0 : _a.replace('CANADA', 'Canada')) === null || _b === void 0 ? void 0 : _b.replace('AUSTRALIA', 'Australia')) === null || _c === void 0 ? void 0 : _c.trim();
    };
    // ex: jsonData?.Addresses?.$values[0]?.AddressPurpose
    Sanitizer.addressPurpose = function (data) {
        var _a, _b;
        var purpose = (_b = (_a = data === null || data === void 0 ? void 0 : data.replace('Permanent Address', 'Permanent')) === null || _a === void 0 ? void 0 : _a.replace('Address', '')) === null || _b === void 0 ? void 0 : _b.trim();
        return purpose ? purpose : 'Other';
    };
    /** Converts an event status code to a human-readable string. */
    Sanitizer.statusCodeDescription = function (statusCode) {
        switch (statusCode) {
            case 'A': return 'Active';
            case 'P': return 'Pending';
            case 'F': return 'Frozen';
            case 'C': return 'Closed';
            case 'X': return 'Canceled';
            default: return 'Unknown';
        }
    };
    return Sanitizer;
}());
/// <reference path="../settings/settings.ts" />
/// <reference path="../utils.ts" />
var WorkBar = /** @class */ (function () {
    function WorkBar($) {
        this.$ = $;
        this.UserDetailsTab = "UserDetailsTab";
        this.EventDetailsTab = "EventDetailsTab";
        this.CommandBarSelectTab = "CommandBarSelectTab";
        this.ConfigRoutes = [];
        this.ConfigTags = [];
        this.RVToken = null;
        this.DocumentationUrl = "https://help.imis.com/enterprise/search.htm";
        this.ClientContext = null;
        this.WebsiteUrl = null;
        this.debouncer = new Debouncer();
        this.PlaceholderTextArray = [
            'Enter an iMIS ID.',
            'Enter an event code.',
            'Enter a username.',
            'Enter a keyword to search.'
        ];
        this.CurrentPlaceholderIndex = 0;
        this.settings = new Settings($);
        this.assetHelper = new AssetHelper();
        this.apiHelper = new ApiHelper();
        this.config = new ConfigManager(this, this.apiHelper, this.assetHelper);
        this.Tabs = [this.CommandBarSelectTab, this.UserDetailsTab, this.EventDetailsTab];
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
    WorkBar.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, myCombo;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settings.load()];
                    case 1:
                        config = _a.sent();
                        if (!config.enableWorkbar)
                            return [2 /*return*/];
                        myCombo = "[".concat(config.workbarShortcut, "]");
                        if (config.workbarKbdShift)
                            myCombo = "[Shift] + " + myCombo;
                        if (config.workbarKbdAlt)
                            myCombo = "[Alt] + " + myCombo;
                        if (config.workbarKbdCtrl)
                            myCombo = "[Control] + " + myCombo;
                        this.PlaceholderTextArray.push("Open the Work Bar with ".concat(myCombo, "."));
                        this.$(function () { return __awaiter(_this, void 0, void 0, function () {
                            var configJson;
                            var _this = this;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        Utils.log('************* init **************');
                                        Utils.log.apply(Utils, __spreadArray([Utils.VERSION_STRING + "Loaded: Search Bar"], WorkBar.VERSION_STYLES, false));
                                        this.RVToken = this.$("#__RequestVerificationToken").val();
                                        this.ClientContext = JSON.parse(this.$('#__ClientContext').val());
                                        if (this.ClientContext.isAnonymous)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.config.checkForConfigUpdate()];
                                    case 1:
                                        _f.sent();
                                        return [4 /*yield*/, this.assetHelper.GetAllAssets()];
                                    case 2:
                                        _f.sent();
                                        this.$('body').prepend((_a = this.assetHelper.CommandBar) !== null && _a !== void 0 ? _a : "");
                                        this.$("#commandBarOverlay #logo-placeholder").replaceWith((_b = this.assetHelper.CsiLogo) !== null && _b !== void 0 ? _b : "");
                                        this.$("#commandBarOverlay .externalIconWhite").replaceWith((_c = this.assetHelper.ExternalIconWhite) !== null && _c !== void 0 ? _c : "");
                                        this.$("#commandBarOverlay .externalIcon").replaceWith((_d = this.assetHelper.ExternalIcon) !== null && _d !== void 0 ? _d : "");
                                        this.$("#commandBarOverlay #commandBarExitButton").html((_e = this.assetHelper.CloseIcon) !== null && _e !== void 0 ? _e : "");
                                        this.buildOpenSearch();
                                        return [4 /*yield*/, this.config.getChromeConfig()];
                                    case 3:
                                        configJson = _f.sent();
                                        this.buildConfig(configJson);
                                        this.$(document).on("keydown", function (event) { return __awaiter(_this, void 0, void 0, function () {
                                            var isCommandBarVisible;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        isCommandBarVisible = this.$("#commandBarOverlay").is(":visible");
                                                        // Replace space in e.key with "Spacebar" for consistency
                                                        if (event.key === " ") {
                                                            event.key = Settings.SPACEBAR;
                                                        }
                                                        if (!((!this.$(event.target).is('input') && !this.$(event.target).is('textarea'))
                                                            && !isCommandBarVisible
                                                            && event.key.toLowerCase() === config.workbarShortcut.toLowerCase()
                                                            && event.ctrlKey === config.workbarKbdCtrl
                                                            && event.altKey === config.workbarKbdAlt
                                                            && event.shiftKey === config.workbarKbdShift)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, this.showOverlay()];
                                                    case 1:
                                                        _a.sent();
                                                        event.preventDefault();
                                                        _a.label = 2;
                                                    case 2:
                                                        if (!(isCommandBarVisible && event.key === "Escape")) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, this.hideOverlay()];
                                                    case 3:
                                                        _a.sent();
                                                        event.preventDefault();
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    WorkBar.prototype.setActionCardHotkeyListeners = function () {
        var _this = this;
        this.$('#commandBarInput').off('keydown.TabCardActions');
        this.$('#commandBarInput').on('keydown.TabCardActions', function (event) {
            var _a, _b;
            if (event.key === "Tab") {
                event.preventDefault();
            }
            if (_this.$("#commandBarOverlay").is(":visible") && event.key === "Enter" && _this.$('#commandBarInput').get(0) === document.activeElement && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                Utils.log('Enter pressed in commandBarInput and commandBarOverlay is visible');
                if (_this.$("#UserDetailsTab").is(":visible")) {
                    Utils.log('UserDetailsTab is visible');
                    (_a = _this.$("#userProfile").get(0)) === null || _a === void 0 ? void 0 : _a.click();
                    event.preventDefault();
                }
                else if (_this.$("#EventDetailsTab").is(":visible")) {
                    Utils.log('EventDetailsTab is visible');
                    (_b = _this.$("#eventDashboard").get(0)) === null || _b === void 0 ? void 0 : _b.click();
                    event.preventDefault();
                }
            }
        });
    };
    WorkBar.prototype.buildUserCardActions = function (userId) {
        var _a, _b;
        var profileUrl = "".concat((_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.websiteRoot, "Party.aspx?ID=").concat(userId);
        var credentialsUrl = "".concat((_b = this.ClientContext) === null || _b === void 0 ? void 0 : _b.websiteRoot, "AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=").concat(userId);
        return "\n                <div id=\"userCardActions\" class=\"userDetails\">\n                    <div class=\"userCardActionArea\">\n                        ".concat(this.assetHelper.IdCardBlue, "\n                        <a id=\"userProfile\" href=\"").concat(profileUrl, "\" class=\"userActionCard\">Profile</a>\n                        ").concat(this.assetHelper.EnterButton2, "\n                    </div>\n                    <div class=\"userCardActionArea\">\n                        ").concat(this.assetHelper.LockIcon, "\n                        <a id=\"userCredentials\" href=\"").concat(credentialsUrl, "\" class=\"userActionCard\">User Credentials</a>\n                    </div>\n                </div>\n            ");
    };
    WorkBar.prototype.buildEventCardActions = function (eventKey) {
        var _a, _b;
        var eventDetailsUrl = "".concat((_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.websiteRoot, "EventDetail?EventKey=").concat(eventKey);
        var eventDashboardUrl = "".concat((_b = this.ClientContext) === null || _b === void 0 ? void 0 : _b.websiteRoot, "EventDashboard?EventKey=").concat(eventKey);
        return "\n                <div id=\"userCardActions\" class=\"userDetails\">\n                    <div class=\"userCardActionArea\">\n                        ".concat(this.assetHelper.ChartLineIcon, "\n                        <a id=\"eventDashboard\" href=\"").concat(eventDashboardUrl, "\" class=\"userActionCard\">Event Dashboard</a>\n                        ").concat(this.assetHelper.EnterButton2, "\n                    </div>\n                    <div class=\"userCardActionArea\">\n                        ").concat(this.assetHelper.CalendarLinesPenIcon, "\n                        <a id=\"eventDetails\" href=\"").concat(eventDetailsUrl, "\" class=\"userActionCard\">Event Details</a>\n                    </div>\n                </div>\n            ");
    };
    WorkBar.prototype.buildProfile = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
        var status = (_a = data === null || data === void 0 ? void 0 : data.Status) === null || _a === void 0 ? void 0 : _a.Description;
        var memberType = (_b = data === null || data === void 0 ? void 0 : data.AdditionalAttributes) === null || _b === void 0 ? void 0 : _b.$values[0].Value;
        var birthDate = Sanitizer.date(data === null || data === void 0 ? void 0 : data.BirthDate);
        var phone0 = (_d = (_c = data === null || data === void 0 ? void 0 : data.Phones) === null || _c === void 0 ? void 0 : _c.$values[0]) === null || _d === void 0 ? void 0 : _d.Number;
        var phone0Type = Sanitizer.phone((_f = (_e = data === null || data === void 0 ? void 0 : data.Phones) === null || _e === void 0 ? void 0 : _e.$values[0]) === null || _f === void 0 ? void 0 : _f.PhoneType);
        var phone1 = (_h = (_g = data === null || data === void 0 ? void 0 : data.Phones) === null || _g === void 0 ? void 0 : _g.$values[1]) === null || _h === void 0 ? void 0 : _h.Number;
        var phone1Type = Sanitizer.phone((_k = (_j = data === null || data === void 0 ? void 0 : data.Phones) === null || _j === void 0 ? void 0 : _j.$values[1]) === null || _k === void 0 ? void 0 : _k.PhoneType);
        var email1 = (_m = (_l = data === null || data === void 0 ? void 0 : data.Emails) === null || _l === void 0 ? void 0 : _l.$values[0]) === null || _m === void 0 ? void 0 : _m.Address;
        var email1IsPrimary = (_p = (_o = data === null || data === void 0 ? void 0 : data.Emails) === null || _o === void 0 ? void 0 : _o.$values[0]) === null || _p === void 0 ? void 0 : _p.IsPrimary;
        var email1Type = Sanitizer.emailType((_r = (_q = data === null || data === void 0 ? void 0 : data.Emails) === null || _q === void 0 ? void 0 : _q.$values[0]) === null || _r === void 0 ? void 0 : _r.EmailType);
        var email2 = (_t = (_s = data === null || data === void 0 ? void 0 : data.Emails) === null || _s === void 0 ? void 0 : _s.$values[1]) === null || _t === void 0 ? void 0 : _t.Address;
        var email2IsPrimary = (_v = (_u = data === null || data === void 0 ? void 0 : data.Emails) === null || _u === void 0 ? void 0 : _u.$values[1]) === null || _v === void 0 ? void 0 : _v.IsPrimary;
        var email2Type = Sanitizer.emailType((_x = (_w = data === null || data === void 0 ? void 0 : data.Emails) === null || _w === void 0 ? void 0 : _w.$values[1]) === null || _x === void 0 ? void 0 : _x.EmailType);
        var email3 = (_z = (_y = data === null || data === void 0 ? void 0 : data.Emails) === null || _y === void 0 ? void 0 : _y.$values[2]) === null || _z === void 0 ? void 0 : _z.Address;
        var email3IsPrimary = (_1 = (_0 = data === null || data === void 0 ? void 0 : data.Emails) === null || _0 === void 0 ? void 0 : _0.$values[2]) === null || _1 === void 0 ? void 0 : _1.IsPrimary;
        var email3Type = Sanitizer.emailType((_3 = (_2 = data === null || data === void 0 ? void 0 : data.Emails) === null || _2 === void 0 ? void 0 : _2.$values[2]) === null || _3 === void 0 ? void 0 : _3.EmailType);
        var address0 = Sanitizer.fullAddress((_6 = (_5 = (_4 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _4 === void 0 ? void 0 : _4.$values[0]) === null || _5 === void 0 ? void 0 : _5.Address) === null || _6 === void 0 ? void 0 : _6.FullAddress);
        var address0Type = Sanitizer.addressPurpose((_8 = (_7 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _7 === void 0 ? void 0 : _7.$values[0]) === null || _8 === void 0 ? void 0 : _8.AddressPurpose);
        var address1 = Sanitizer.fullAddress((_11 = (_10 = (_9 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _9 === void 0 ? void 0 : _9.$values[1]) === null || _10 === void 0 ? void 0 : _10.Address) === null || _11 === void 0 ? void 0 : _11.FullAddress);
        var address1Type = Sanitizer.addressPurpose((_13 = (_12 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _12 === void 0 ? void 0 : _12.$values[1]) === null || _13 === void 0 ? void 0 : _13.AddressPurpose);
        var address2 = Sanitizer.fullAddress((_16 = (_15 = (_14 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _14 === void 0 ? void 0 : _14.$values[2]) === null || _15 === void 0 ? void 0 : _15.Address) === null || _16 === void 0 ? void 0 : _16.FullAddress);
        var address2Type = Sanitizer.addressPurpose((_18 = (_17 = data === null || data === void 0 ? void 0 : data.Addresses) === null || _17 === void 0 ? void 0 : _17.$values[2]) === null || _18 === void 0 ? void 0 : _18.AddressPurpose);
        var companyName = (_19 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _19 === void 0 ? void 0 : _19.Name;
        var companyId = (_20 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _20 === void 0 ? void 0 : _20.OrganizationPartyId;
        var userTitle = (_21 = data === null || data === void 0 ? void 0 : data.PrimaryOrganization) === null || _21 === void 0 ? void 0 : _21.Title;
        return "\n            <div id=\"userCardProfile\" class=\"userDetails\">\n                <h3 id=\"destinationUsersName\" style=\"color: #005e7d; margin: 2px\">".concat(data === null || data === void 0 ? void 0 : data.Name, "</h3>\n                <div id=\"details\" style=\"font-size: 90%;\">\n                    <div id=\"userDetailsTop\" style=\"margin: 0px 0px 5px 1px;\">\n                        <span id=\"destinationUsersId\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersIdLabel\">ID </span>").concat(data === null || data === void 0 ? void 0 : data.Id, "\n                        </span>\n                        <span id=\"destinationUsersStatus\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersStatusLabel\">Status </span>").concat(status, "\n                        </span>\n                        <span id=\"destinationUsersMemberType\" class=\"userDetails userSpecificDetail\">\n                            <span class=\"Label workBarLabel destinationUsersTypeLabel\">Type </span>").concat(memberType, "\n                        </span>\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(birthDate ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.CakeIcon, "\n                            <span class=\"textBadge\">Date of Birth</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(birthDate, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber0\">\n                        ").concat(phone0 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone0Type, "</span>\n                            <a href=\"tel:").concat(phone0, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone0, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersPhoneNumber1\">\n                        ").concat(phone1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.PhoneIcon, "\n                            <span class=\"textBadge\">").concat(phone1Type, "</span>\n                            <a href=\"tel:").concat(phone1, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(phone1, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail1\">\n                        ").concat(email1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.EmailIcon, "\n                            ").concat(email1IsPrimary ? "".concat(this.assetHelper.PrimaryButton) : "<span class=\"textBadge\">".concat(email1Type, "</span>"), "\n                            <a href=\"mailto:").concat(email1, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email1, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail2\">\n                        ").concat(email2 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.EmailIcon, "\n                            ").concat(email2IsPrimary ? "".concat(this.assetHelper.PrimaryButton) : "<span class=\"textBadge\">".concat(email2Type, "</span>"), "\n                            <a href=\"mailto:").concat(email2, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email2, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersEmail3\">\n                        ").concat(email3 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.EmailIcon, "\n                            ").concat(email3IsPrimary ? "".concat(this.assetHelper.PrimaryButton) : "<span class=\"textBadge\">".concat(email3Type, "</span>"), "\n                            <a href=\"mailto:").concat(email3, "\" style=\"display:inline-block; vertical-align: middle;\">").concat(email3, "</a>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress0\">\n                        ").concat(address0 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address0Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address0, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress1\">\n                        ").concat(address1 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address1Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address1, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersAddress2\">\n                        ").concat(address2 ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.MailboxIcon, "\n                            <span class=\"textBadge\">").concat(address2Type, "</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(address2, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersCompanyName\">\n                        ").concat(companyName ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.BuildingIcon, "\n                            ").concat(companyId ? "\n                                <a href=\"".concat((_22 = this.ClientContext) === null || _22 === void 0 ? void 0 : _22.websiteRoot, "Party.aspx?ID=").concat(companyId, "\">\n                                    <span style=\"vertical-align: middle;\">").concat(companyName, "</span>\n                                    <span class=\"userDetailsBadge\">ID ").concat(companyId, "</span>\n                                </a>\n                                ") : "\n                                <span style=\"vertical-align: middle;\">".concat(companyName, "</span>\n                                <span class=\"userDetailsBadge\">Company ID Not Correctly Linked</span>"), "\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersTitle\">\n                        ").concat(userTitle ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.UserTagIcon, "\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(userTitle, "</span>\n                        </div>") : '', "\n                    </div>\n                </div>\n            </div>\n        ");
    };
    WorkBar.prototype.buildProfileFooter = function (username, data) {
        var _a, _b, _c, _d;
        var createdOn = Sanitizer.date((_a = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _a === void 0 ? void 0 : _a.CreatedOn);
        var createdBy = (_b = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _b === void 0 ? void 0 : _b.CreatedBy;
        var updatedOn = Sanitizer.date((_c = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _c === void 0 ? void 0 : _c.UpdatedOn);
        var updatedBy = (_d = data === null || data === void 0 ? void 0 : data.UpdateInformation) === null || _d === void 0 ? void 0 : _d.UpdatedBy;
        return "\n            <div class=\"userDetails\" id=\"userCardChangeDetails\">\n                <span id=\"destinationUsersCreatedOn\">\n                    <span class=\"Label workBarLabel\">Created </span>".concat(createdOn, "\n                </span>\n                <span id=\"destinationUsersCreatedBy\">by ").concat(createdBy, "</span>\n                <span id=\"destinationUsersUpdatedOn\">\n                    <span class=\"Label workBarLabel\">Last Updated </span>").concat(updatedOn, "\n                </span>\n                <span id=\"destinationUsersUpdatedBy\">by ").concat(updatedBy, "</span>\n                <span id=\"destinationUsersUsername\">\n                    ").concat(username ? "\n                        <span class=\"Label workBarLabel workBarUsernameLabel\">Username </span>".concat(username, "\n                    ") : '', "\n                </span>\n            </div>\n        ");
    };
    WorkBar.prototype.buildOpenSearch = function () {
        var _this = this;
        var _a;
        var view = this.assetHelper.OpenSearchView;
        var result = view === null || view === void 0 ? void 0 : view.replace("<svg class=\"menu-icon\"></svg>", (_a = this.assetHelper.MenuIcon) !== null && _a !== void 0 ? _a : "");
        this.$('#masterTopBarAuxiliary > .navbar-left').css('display', 'flex');
        this.$('#masterTopBarAuxiliary > .navbar-left').append(this.$.parseHTML(result !== null && result !== void 0 ? result : ""));
        this.$('.menu-icon-container')
            .on('mouseenter', function (e) {
            _this.$(e).animate({ width: 104 }, 100, 'linear');
            setTimeout(function () {
                _this.$('.hover-text').animate({ 'font-size': '90%' }, 100, 'linear');
                _this.$('.hover-text').show();
            }, 25);
        })
            .on("mouseleave", function (e) {
            _this.$('.hover-text').hide().css('font-size', '1px');
            _this.$(e).css('width', 'auto');
        })
            .on("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showOverlay()];
                    case 1:
                        _a.sent();
                        e.preventDefault();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    WorkBar.prototype.buildEvent = function (event, staffContactName, eventCategoryDescription) {
        var _a;
        var name = event === null || event === void 0 ? void 0 : event.Name;
        var id = event === null || event === void 0 ? void 0 : event.EventId;
        var status = Sanitizer.statusCodeDescription(event === null || event === void 0 ? void 0 : event.Status);
        var startDate = Sanitizer.date(event === null || event === void 0 ? void 0 : event.StartDateTime);
        var endDate = Sanitizer.date(event === null || event === void 0 ? void 0 : event.EndDateTime);
        var description = ((_a = event === null || event === void 0 ? void 0 : event.Description) !== null && _a !== void 0 ? _a : "").trim().replace(/(<([^>]+)>)/gi, "");
        var virtualMeetingUrl = event === null || event === void 0 ? void 0 : event.VirtualMeetingUrl;
        return "\n            <div id=\"userCardProfile\" class=\"userDetails\">\n                <h3 id=\"destinationUsersName\" style=\"color: #005e7d; margin: 2px\">".concat(name, "</h3>\n                <div id=\"details\" style=\"font-size: 90%;\">\n                    <div id=\"userDetailsTop\" style=\"margin: 0px 0px 5px 1px;\">\n                        <span id=\"destinationUsersId\" class=\"userDetails userSpecificDetail userIndividual\" style=\"padding-right: 6px;\">\n                            <span class=\"Label workBarLabel destinationUsersIdLabel\">ID </span>").concat(id, "\n                        </span>\n                        <span id=\"destinationUsersMemberType\" class=\"userDetails userSpecificDetail\">\n                            <span class=\"Label workBarLabel destinationUsersTypeLabel\">Category </span>").concat(eventCategoryDescription !== null && eventCategoryDescription !== void 0 ? eventCategoryDescription : "", "\n                        </span>\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(startDate ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.CalendarIcon, "\n                            <span class=\"textBadge\">Start Date</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(startDate, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(endDate ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.CalendarIcon, "\n                            <span class=\"textBadge\">End Date</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(endDate, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(staffContactName ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.UserTagIcon, "\n                            <span class=\"textBadge\">Staff Contact</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">").concat(staffContactName, "</span>\n                        </div>") : '', "\n                    </div>\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(virtualMeetingUrl ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.LinkSolidIcon, "\n                            <span class=\"textBadge\">Virtual Meeting URL</span>\n                            <span style=\"display:inline-block; vertical-align: middle;\">\n                                <a href=\"").concat(virtualMeetingUrl, "\" class=\"userActionCard\">").concat(virtualMeetingUrl, "</a>\n                            </span>\n                        </div>") : '', "\n                    </div>\n                    <br />\n                    <div class=\"userDetails userSpecificDetail displayBlock\" id=\"destinationUsersBirthdate\">\n                        ").concat(description ? "\n                        <div style=\"padding:2px 0;\">\n                            ".concat(this.assetHelper.DescriptionIcon, "\n                            <span class=\"textBadge\">Description</span>\n                            <span style=\"display:inline-block; vertical-align: middle; padding-top:4px;\">").concat(description, "</span>\n                        </div>") : '', "\n                    </div>\n                </div>\n            </div>\n        ");
    };
    WorkBar.prototype.buildEventFooter = function (status) {
        return "\n            <div class=\"userDetails\" id=\"userCardChangeDetails\">\n                <span id=\"destinationUsersCreatedOn\">\n                    <span class=\"Label workBarLabel\">Status </span>".concat(status, "\n                </span>\n            </div>\n        ");
    };
    WorkBar.prototype.setEventDetails = function (event) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var input, url, rvToken, content, eventCategoryId, eventCategoryDescription, _e, staffContactId, contactData, _f, staffContactName, eventHtml, eventActions, changeDetails;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        input = this.$('#commandBarInput').val();
                        url = (_b = (_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
                        rvToken = (_c = this.RVToken) !== null && _c !== void 0 ? _c : "";
                        if (!event) return [3 /*break*/, 7];
                        content = this.assetHelper.EventDetailsView;
                        this.$("#EventDetailsTab").replaceWith(content !== null && content !== void 0 ? content : "");
                        eventCategoryId = (_d = event === null || event === void 0 ? void 0 : event.Category) === null || _d === void 0 ? void 0 : _d.EventCategoryId;
                        if (!eventCategoryId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.apiHelper.getEventCategory(eventCategoryId, rvToken, url)];
                    case 1:
                        _e = _g.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _e = null;
                        _g.label = 3;
                    case 3:
                        eventCategoryDescription = _e;
                        staffContactId = event === null || event === void 0 ? void 0 : event.NotificationPartyId;
                        if (!staffContactId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.apiHelper.getParty(staffContactId, rvToken, url)];
                    case 4:
                        _f = _g.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _f = null;
                        _g.label = 6;
                    case 6:
                        contactData = _f;
                        staffContactName = contactData === null || contactData === void 0 ? void 0 : contactData.Name;
                        eventHtml = this.buildEvent(event, staffContactName, eventCategoryDescription);
                        this.$('#userCardProfile').replaceWith(eventHtml);
                        eventActions = this.buildEventCardActions(input);
                        this.$('#userCardActions').replaceWith(eventActions);
                        changeDetails = this.buildEventFooter(Sanitizer.statusCodeDescription(event === null || event === void 0 ? void 0 : event.Status));
                        this.$("#userCardChangeDetails").replaceWith(changeDetails);
                        return [2 /*return*/, true];
                    case 7: return [2 /*return*/, false];
                }
            });
        });
    };
    WorkBar.prototype.setUserDetails = function (userId) {
        var _a, _b, _c, _d;
        if (userId === void 0) { userId = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var input, url, rvToken, data, content, username, profile, userActions, changeDetails;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        input = userId ? userId : this.$('#commandBarInput').val();
                        if (!input)
                            return [2 /*return*/, false];
                        url = (_b = (_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
                        rvToken = (_c = this.RVToken) !== null && _c !== void 0 ? _c : "";
                        return [4 /*yield*/, this.apiHelper.getParty(input, rvToken, url)];
                    case 1:
                        data = _e.sent();
                        if (!data) return [3 /*break*/, 3];
                        content = this.assetHelper.UserDetailsView;
                        this.$("#UserDetailsTab").replaceWith(content !== null && content !== void 0 ? content : "");
                        return [4 /*yield*/, this.apiHelper.getUserName(input, rvToken, url)];
                    case 2:
                        username = (_d = _e.sent()) !== null && _d !== void 0 ? _d : "";
                        profile = this.buildProfile(data);
                        this.$('#userCardProfile').replaceWith(profile);
                        userActions = this.buildUserCardActions(input);
                        this.$('#userCardActions').replaceWith(userActions);
                        changeDetails = this.buildProfileFooter(username, data);
                        this.$("#userCardChangeDetails").replaceWith(changeDetails);
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    WorkBar.prototype.removeUserDetailsInfo = function () {
        this.$("#UserDetailsTab").empty();
    };
    WorkBar.prototype.buildConfig = function (configJson) {
        var _a, _b, _c;
        var baseUrl = (_b = (_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
        var rvToken = (_c = this.RVToken) !== null && _c !== void 0 ? _c : "";
        this.ConfigRoutes = configJson.filter(function (d) { return !d.isTag; });
        this.ConfigTags = configJson.filter(function (d) { return d.isTag; });
        var view = this.config.buildRoutesHtml(this.ConfigRoutes);
        this.$('#commandBarUl').html(view);
        this.config.setEventListeners(rvToken, baseUrl);
    };
    WorkBar.prototype.getLoader = function () {
        return "<div class=\"lookupLoader\" style=\"display: inline; margin-left: 6px;\">\n                    <span class=\"spinner\"></span>\n                </div>";
    };
    WorkBar.prototype.getInputLoader = function () {
        return "<div class=\"inputLoader\">\n                    <span class=\"spinner\"></span>\n                </div>";
    };
    WorkBar.prototype.getInputErrorBadge = function () {
        return "<span class=\"inputErrorBadge\">No Matching Record Found</span>";
    };
    WorkBar.prototype.getLookupErrorBadge = function () {
        return "<span class=\"lookupErrorBadge\">No Matching Record Found</span>";
    };
    WorkBar.prototype.activateTab = function (activateTab) {
        var _this = this;
        if (activateTab !== '') {
            var showTab = this.Tabs.filter(function (t) { return t == activateTab; })[0];
            this.$("#".concat(showTab)).show();
            this.$('.loaderParent').hide();
        }
        else {
            this.$('.loaderParent').show();
        }
        var hideTabs = this.Tabs.filter(function (t) { return t !== activateTab; });
        hideTabs.forEach(function (tab) {
            if (tab == _this.UserDetailsTab) {
                _this.removeUserDetailsInfo();
            }
            _this.$("#".concat(tab)).hide();
        });
    };
    WorkBar.prototype.setArrowEventListeners = function () {
        var _this = this;
        this.$('#commandBarInput').off("keydown.ArrowEvents");
        var index = 0;
        var listItems = this.$(".commandBarListItem");
        this.$(listItems[index]).addClass("commandBarSelected");
        this.$('#commandBarInput').on("keydown.ArrowEvents", function (event) {
            var _a, _b, _c;
            if (_this.$("#CommandBarSelectTab").is(":visible")) {
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault();
                        _this.$(listItems[index]).removeClass("commandBarSelected");
                        index = index > 0 ? --index : 0;
                        _this.$(listItems[index]).addClass("commandBarSelected");
                        (_a = _this.$(listItems[index]).get(0)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        _this.$(listItems[index]).removeClass("commandBarSelected");
                        index = index < listItems.length - 1 ? ++index : listItems.length - 1;
                        _this.$(listItems[index]).addClass("commandBarSelected");
                        (_b = _this.$(listItems[index]).get(0)) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "Enter":
                        event.preventDefault();
                        (_c = _this.$(listItems[index]).children().get(0)) === null || _c === void 0 ? void 0 : _c.click();
                        break;
                }
            }
        });
    };
    WorkBar.prototype.checkUser = function (currentActionBarValue) {
        var _this = this;
        var _a, _b, _c;
        var baseUrl = (_b = (_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
        var rvToken = (_c = this.RVToken) !== null && _c !== void 0 ? _c : "";
        var inputSpinner = this.$("#commandBarInput").siblings(".inputLoader");
        if (inputSpinner.length == 0) {
            this.$("#commandBarInput").after(this.getInputLoader());
        }
        this.setUserDetails().then(function (foundUser) {
            _this.$('#commandBarInput').siblings(".inputLoader").remove();
            if (foundUser) {
                _this.activateTab(_this.UserDetailsTab);
            }
            else {
                _this.$("#commandBarInput").after(_this.getInputErrorBadge());
                if (_this.$("#CommandBarSelectTab").is(":hidden")) {
                    _this.activateTab(_this.CommandBarSelectTab);
                    var tagsHTML = _this.config.buildTagsHtml(_this.ConfigTags, 0, currentActionBarValue);
                    _this.$('#commandBarUl').html(tagsHTML);
                    _this.config.setEventListeners(rvToken, baseUrl, true);
                    _this.setArrowEventListeners();
                }
            }
        });
    };
    WorkBar.prototype.captureInput = function () {
        var _this = this;
        this.$('#commandBarInput').off('input.CaptureInput');
        this.$('#commandBarInput').on('input.CaptureInput', function (event) {
            var _a, _b, _c, _d, _e, _f;
            var baseUrl = (_b = (_a = _this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
            var rvToken = (_c = _this.RVToken) !== null && _c !== void 0 ? _c : "";
            if (_this.$(".commandBarListItem")[0]) {
                _this.$(".commandBarListItem")[0].scrollIntoView();
            }
            (_d = _this.$('#commandBarOverlay').find('.lookupErrorBadge')) === null || _d === void 0 ? void 0 : _d.remove();
            (_e = _this.$('#commandBarOverlay').find('.inputErrorBadge')) === null || _e === void 0 ? void 0 : _e.remove();
            var currentActionBarValue = _this.$(event.target).val();
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);
            if (isActionBarNumeric === true && currentActionBarValue.length >= 1 && currentActionBarValue.length <= 10) {
                _this.debouncer.start(function (v) { return _this.checkUser(v); }, 500, currentActionBarValue);
            }
            else {
                (_f = _this.$("#commandBarInput").siblings(".inputLoader")) === null || _f === void 0 ? void 0 : _f.remove();
                _this.debouncer.stop();
                if (_this.$("#CommandBarSelectTab").is(":hidden")) {
                    _this.activateTab(_this.CommandBarSelectTab);
                    Utils.log('remove user details view...');
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
                    var routesHTML = _this.config.buildRoutesHtml(filteredResults);
                    var tagsHTML = _this.config.buildTagsHtml(_this.ConfigTags, filteredResults.length, currentActionBarValue);
                    _this.$('#commandBarUl').html(routesHTML.concat(tagsHTML));
                    _this.config.setEventListeners(rvToken, baseUrl, true);
                    _this.setArrowEventListeners();
                    _this.setActionCardHotkeyListeners();
                }
                else {
                    _this.buildDefaultView(rvToken, baseUrl);
                }
            }
        });
    };
    WorkBar.prototype.getNextPlaceholder = function () {
        var currentItem = this.PlaceholderTextArray[this.CurrentPlaceholderIndex];
        this.CurrentPlaceholderIndex = (this.CurrentPlaceholderIndex + 1) % this.PlaceholderTextArray.length;
        return currentItem;
    };
    WorkBar.prototype.buildDefaultView = function (rvToken, baseUrl) {
        var routesHTML = this.config.buildRoutesHtml(this.ConfigRoutes);
        this.$('#commandBarUl').html(routesHTML);
        this.config.setEventListeners(rvToken, baseUrl);
        this.setArrowEventListeners();
        this.setActionCardHotkeyListeners();
    };
    WorkBar.prototype.showOverlay = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, rvToken;
            var _this = this;
            return __generator(this, function (_d) {
                baseUrl = (_b = (_a = this.ClientContext) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : "";
                rvToken = (_c = this.RVToken) !== null && _c !== void 0 ? _c : "";
                if (this.$("#commandBarOverlay").is(":hidden")) {
                    this.activateTab(this.CommandBarSelectTab);
                    this.buildDefaultView(rvToken, baseUrl);
                    this.$("#commandBarInput").attr("placeholder", this.getNextPlaceholder());
                    // set up event listeners
                    this.setArrowEventListeners();
                    this.setActionCardHotkeyListeners();
                    this.$('#commandBarExitButton').off("click.CloseSearchBar");
                    this.$('#commandBarExitButton').on("click.CloseSearchBar", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.hideOverlay()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    this.captureInput();
                    this.$('#commandBarOverlay').show();
                    this.$('#commandBarInput').trigger("focus");
                }
                return [2 /*return*/];
            });
        });
    };
    WorkBar.prototype.hideOverlay = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                // remove error badges
                (_a = this.$('#commandBarOverlay').find('.lookupErrorBadge')) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = this.$('#commandBarOverlay').find('.inputErrorBadge')) === null || _b === void 0 ? void 0 : _b.remove();
                // remove user input
                this.$('#commandBarInput').val('');
                // hide search bar
                this.$('#commandBarOverlay').hide();
                // remove handlers
                this.$('#commandBarExitButton').off("click.CloseSearchBar");
                this.$('#commandBarInput').off('input.CaptureInput');
                this.$('#commandBarInput').off('keydown.ArrowEvents');
                this.$('#commandBarInput').off('keydown.TabCardActions');
                return [2 /*return*/];
            });
        });
    };
    WorkBar.VERSION_STYLES = [
        "background-color: #e6b222; color: white;",
        "background-color: #374ea2; color: white;",
        "background-color: #00a4e0; color: white;",
        "background-color: inherit; color: inherit;", // Message
    ];
    return WorkBar;
}());
new WorkBar(jQuery);
