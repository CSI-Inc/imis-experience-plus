class RiseExtensions {
    private static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    constructor(private $: JQueryStatic) {
        // Run some checks to determine if we are inside of the iMIS staff site
        if (this.$('head').get(0)?.id !== 'ctl00_Head1' && this.$('form').get(0)?.id !== 'aspnetForm') {
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
    init(): void {
        if (window.location.pathname.indexOf('/ContentManagement/ContentDesigner/ContentRecordEdit.aspx') > -1) {
            this.$(() => {
                this.initRiseEditorExtensions();
            });
        }
    }

    /**
     * Initializes the IQA Browser extensions.
     */
    initRiseEditorExtensions(): void {
        console.log(RiseExtensions.VERSION_STRING + "Loaded: RiSE Module", ...RiseExtensions.VERSION_STYLES);

        // Inject Font Awesome 
        this.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />');

        // Zone style tidying / organization
        this.$('.WebPartZoneDesignTimeAction').each((_, e) => {
            this.$(e).closest('tr').appendTo(this.$(e).closest('table'));
        });

        this.$('.WebPartZoneDesignTimeAction').each((_, e) => {
            this.$(e).children().wrapAll(
                $('<div />').addClass('__csi__iep__addButton')
            );
        });

        this.$('.__csi__iep__addButton').each((_, e) => {
            this.$(e).find('br + div').each((_, e) => {
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
            .html('<i class="fas fa-cog fa-fw"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Copy To")')
            .addClass('__csi__iep__verb_copy')
            .html('<i class="fas fa-copy fa-fw fc-teal"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Move To")')
            .addClass('__csi__iep__verb_move')
            .html('<i class="fas fa-file-export fa-fw fc-orange"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Connect")')
            .addClass('__csi__iep__verb_connect')
            .html('<i class="fas fa-link fa-fw fc-green"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Minimize")')
            .addClass('__csi__iep__verb_minimize')
            .html('<i class="fas fa-arrows-up-to-line fa-fw fc-purple"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Restore")')
            .addClass('__csi__iep__verb_restore')
            .html('<i class="fas fa-arrows-down-to-line fa-fw fc-purple"></i>');

        this.$('.WebPartsTitleBar a.WebPartsTitleBarVerb:contains("Remove")')
            .addClass('__csi__iep__verb_remove')
            .html('<i class="fas fa-trash-can fa-fw fc-red"></i>');
    }

    /**
     * Sources: 
     * https://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery 
     */
    addJQueryExtensions(): void {
        this.$.fn.changeElementType = function (newType) {
            var newElements: ArrayLike<HTMLElement> = [];
            var attrs: any;
            var newElement: JQuery<HTMLElement>;

            this.each(function () {
                attrs = {};

                $.each(this.attributes, function () {
                    attrs[this.nodeName] = this.nodeValue;
                });

                newElement = $("<" + newType + "/>", attrs).append($(this).contents());

                $(this).replaceWith(newElement);

                if (!newElements) {
                    newElements = newElement;
                } else {
                    $.merge(newElements, newElement);
                }
            });

            return $(newElements);
        }
    }
}

new RiseExtensions(jQuery);