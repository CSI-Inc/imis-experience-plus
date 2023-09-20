/// <reference path="settings/settings.ts" />
/// <reference path="utils.ts" />

class RiseExtensions
{
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    private settings: Settings;

    constructor(private $: JQueryStatic)
    {
        this.settings = new Settings($);

        // Run some checks to determine if we are inside of the iMIS staff site
        if (!Utils.isImisPage($))
        {
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
    async init(): Promise<void>
    {
        var config = await this.settings.load();

        if (!config.enableRise) return;

        if (window.location.pathname.indexOf('/ContentManagement/ContentDesigner/ContentRecordEdit.aspx') > -1)
        {
            this.$(() =>
            {
                this.initRiseEditorExtensions();
            });
        }
    }

    /**
     * Initializes the IQA Browser extensions.
     */
    initRiseEditorExtensions(): void
    {
        Utils.log(Utils.VERSION_STRING + "Loaded: RiSE Module", ...RiseExtensions.VERSION_STYLES);

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
        while (this.$('.PanelFieldValue > #LinkButtons br + *').length)
        {
            // remove anything after the first <br>
            this.$('.PanelFieldValue > #LinkButtons br + *').remove();
        }

        this.$('.PanelFieldValue > #LinkButtons').parent().addClass('InputXLargeWrapper');

        var fullUrl = this.$('.PanelFieldValue > #LinkButtons').find('a').attr('href');
        var freeLink = this.$("#ctl01_TemplateBody_WebPartControl_PublishFileName_TextField").val();

        this.$('.PanelFieldValue > #LinkButtons').prepend(`
            <div style="margin-bottom: 0.5rem;">
                <input type="text" id="__csi__iep__fullUrl" readonly value="${fullUrl}" />
                <button id="__csi__iep__copyFullUrl" style="margin: 0 0.5rem;" class="btn btn-primary">
                    <i class="fas fa-copy fa-fw"></i>
                    Copy
                </button>
            </div>
        `);

        // if freelink is not empty, then we have a custom URL
        if (freeLink)
        {
            this.$('.PanelFieldValue > #LinkButtons').closest('.PanelField').after(`
                <div class="PanelField Left InputLargeWrapper">
                    <div style="display: inline;">
                        <label class="PanelFieldLabel">Freelink</labeb>
                    </div>
                    <div class="PanelFieldValue">
                        <input type="text" id="__csi__iep__freeLink" readonly value="[[${freeLink}]]" />
                        <button id="__csi__iep__copyFreeLink" style="margin: 0 0.5rem;" class="btn btn-primary">
                            <i class="fas fa-copy fa-fw"></i>
                            Copy
                        </button>
                    </div>
                </div>
            `);
        }
        else
        {
            this.$('.PanelFieldValue > #LinkButtons').closest('.PanelField').append(`
                <div class="PanelField Left">
                    <div style="display: inline;">
                        <label class="PanelFieldLabel">Freelink</labeb>
                    </div>
                    <div class="PanelFieldValue">
                        <em>This page does not have a freelink.</em>
                    </div>
                </div>
            `);
        }

        // If the user clicks on ID __csi__iep__copyFullUrl or __csi__iep__copyFreeLink, copy the value to the clipboard
        this.$('#__csi__iep__copyFullUrl, #__csi__iep__copyFreeLink').on('click', (e) =>
        {
            e.preventDefault();

            let target = this.$(e.currentTarget);
            target.addClass('disabled').css('pointerEvents', 'none');
            let qt = target.siblings('input').val()?.toString() ?? '';
            navigator.clipboard.writeText(qt.trim()).then(() =>
            {
                target.after('<span class="csi__iep__tempmsg"> Copied!</span>');
                window.setTimeout(() => this.$('.csi__iep__tempmsg').fadeOut(() =>
                {
                    this.$('.csi__iep__tempmsg').remove();
                    $('#__csi__iep__copyFullUrl, #__csi__iep__copyFreeLink').removeClass('disabled').css('pointerEvents', '');
                }), 2000);
            });
        });

        // Zone style tidying / organization
        this.$('.WebPartZoneDesignTimeAction').each((_, e) =>
        {
            this.$(e).closest('tr').appendTo(this.$(e).closest('table'));
        });

        this.$('.WebPartZoneDesignTimeAction').each((_, e) =>
        {
            this.$(e).children().wrapAll(
                $('<div />').addClass('__csi__iep__addButton')
            );
        });

        this.$('.__csi__iep__addButton').each((_, e) =>
        {
            this.$(e).find('br + div').each((_, e) =>
            {
                this.$(e).insertBefore(this.$(e).closest('table'));
                this.$(e).find('span').addClass('__csi__iep__zoneName');
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
        this.$('div[id$=FieldsPanel]').append(`
            <div class="PanelColumn">
                <input type="checkbox" id="__csi__iep__previewMode" />
                <label for="__csi__iep__previewMode">Preview Mode</label>
            </div>
        `);

        this.$('#__csi__iep__previewMode').on('change', (e) =>
        {
            if (this.$(e.target).is(':checked'))
            {
                this.$('.WebPartsTitleBar, .WebPartZoneDesignTime, .__csi__iep__zoneName').addClass('__csi__iep__preview');
            }
            else
            {
                this.$('.WebPartsTitleBar, .WebPartZoneDesignTime, .__csi__iep__zoneName').removeClass('__csi__iep__preview');
            }
        });
    }

    /**
     * Sources:
     * https://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery
     */
    addJQueryExtensions(): void
    {
        this.$.fn.changeElementType = function (newType)
        {
            var newElements: ArrayLike<HTMLElement> = [];
            var attrs: any;
            var newElement: JQuery<HTMLElement>;

            this.each(function ()
            {
                attrs = {};

                $.each(this.attributes, function ()
                {
                    attrs[this.nodeName] = this.nodeValue;
                });

                newElement = $("<" + newType + "/>", attrs).append($(this).contents());

                $(this).replaceWith(newElement);

                if (!newElements)
                {
                    newElements = newElement;
                } else
                {
                    $.merge(newElements, newElement);
                }
            });

            return $(newElements);
        }
    }
}

new RiseExtensions(jQuery);