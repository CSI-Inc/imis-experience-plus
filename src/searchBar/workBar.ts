/// <reference path="../settings/settings.ts" />
/// <reference path="../utils.ts" />

class WorkBar
{
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    // Tabs
    private Tabs: string[];
    public UserDetailsTab: string = "UserDetailsTab";
    public EventDetailsTab: string = "EventDetailsTab";
    public CommandBarSelectTab: string = "CommandBarSelectTab";

    // Config
    private config: ConfigManager;
    private ConfigRoutes: ConfigItem[] = [];
    private ConfigTags: ConfigItem[] = [];

    private RVToken: string | null = null;
    private DocumentationUrl: string = "https://help.imis.com/enterprise/search.htm";
    public ClientContext: ClientContext | null = null;
    private WebsiteUrl: string | null = null;

    private settings: Settings;

    private assetHelper: AssetHelper;

    private apiHelper: ApiHelper;

    private debouncer: Debouncer = new Debouncer();

    constructor(private $: JQueryStatic)
    {
        this.settings = new Settings($);

        this.assetHelper = new AssetHelper();

        this.apiHelper = new ApiHelper();

        this.config = new ConfigManager(this, this.apiHelper, this.assetHelper);

        this.Tabs = [this.CommandBarSelectTab, this.UserDetailsTab, this.EventDetailsTab];

        if (!Utils.isImisPage($))
        {
            // Not iMIS - do nothing
            return;
        }

        // Initialize the module
        this.init();
    }

    public PlaceholderTextArray: Array<string> = [
        'Enter an iMIS ID.',
        'Enter an event code.',
        'Enter a username.',
        'Enter a keyword to search.'
    ];

    public CurrentPlaceholderIndex: number = 0;

    /**
     * Initializes the various elements of this module..
     */
    async init(): Promise<void>
    {
        var config = await this.settings.load();

        if (!config.enableWorkbarv2) return;

        var myCombo = `[${config.workbarShortcut}]`;
        if (config.workbarKbdShift) myCombo = "[Shift] + " + myCombo;
        if (config.workbarKbdAlt) myCombo = "[Alt] + " + myCombo;
        if (config.workbarKbdCtrl) myCombo = "[Control] + " + myCombo;
        this.PlaceholderTextArray.push(`Open the Work Bar with ${myCombo}.`);

        this.$(async () =>
        {
            Utils.log('************* init **************');
            Utils.log(Utils.VERSION_STRING + "Loaded: Search Bar", ...WorkBar.VERSION_STYLES);

            this.RVToken = this.$("#__RequestVerificationToken").val() as string;
            this.ClientContext = JSON.parse(this.$('#__ClientContext').val() as string) as ClientContext;

            if (this.ClientContext.isAnonymous) return;

            await this.config.checkForConfigUpdate();

            await this.assetHelper.GetAllAssets();
            this.$('body').prepend(this.assetHelper.CommandBar ?? "");
            this.$("#commandBarOverlay #logo-placeholder").replaceWith(this.assetHelper.CsiLogo ?? "");
            this.$("#commandBarOverlay .externalIconWhite").replaceWith(this.assetHelper.ExternalIconWhite ?? "");
            this.$("#commandBarOverlay .externalIcon").replaceWith(this.assetHelper.ExternalIcon ?? "");
            this.$("#commandBarOverlay #commandBarExitButton").html(this.assetHelper.CloseIcon ?? "");
            this.buildOpenSearch();
            var configJson = await this.config.getChromeConfig();
            this.buildConfig(configJson);

            this.$(document).on("keydown", async event =>
            {
                var isCommandBarVisible = this.$("#commandBarOverlay").is(":visible");

                // Replace space in e.key with "Spacebar" for consistency
                if (event.key === " ")
                {
                    event.key = Settings.SPACEBAR;
                }

                // Open Work Bar
                if ((!this.$(event.target).is('input') && !this.$(event.target).is('textarea'))
                    && !isCommandBarVisible
                    && event.key.toLowerCase() === config.workbarShortcut.toLowerCase()
                    && event.ctrlKey === config.workbarKbdCtrl
                    && event.altKey === config.workbarKbdAlt
                    && event.shiftKey === config.workbarKbdShift)
                {
                    await this.showOverlay();
                    event.preventDefault();
                }

                // Close Work Bar
                if (isCommandBarVisible && event.key === "Escape")
                {
                    await this.hideOverlay();
                    event.preventDefault();
                }
            });
        });
    }

    private setActionCardHotkeyListeners(): void
    {
        this.$('#commandBarInput').off('keydown.TabCardActions');
        this.$('#commandBarInput').on('keydown.TabCardActions', event =>
        {
            if (event.key === "Tab")
            {
                event.preventDefault();
            }

            if (this.$("#commandBarOverlay").is(":visible") && event.key === "Enter" && this.$('#commandBarInput').get(0) === document.activeElement && !event.shiftKey && !event.ctrlKey && !event.altKey)
            {
                Utils.log('Enter pressed in commandBarInput and commandBarOverlay is visible');
                if (this.$("#UserDetailsTab").is(":visible"))
                {
                    Utils.log('UserDetailsTab is visible');
                    this.$("#userProfile").get(0)?.click();
                    event.preventDefault();
                }
                else if (this.$("#EventDetailsTab").is(":visible"))
                {
                    Utils.log('EventDetailsTab is visible');
                    this.$("#eventDashboard").get(0)?.click();
                    event.preventDefault();
                }
            }
        });
    }

    private buildUserCardActions(userId: string): string
    {
        var profileUrl = `${this.ClientContext?.websiteRoot}Party.aspx?ID=${userId}`;
        var credentialsUrl = `${this.ClientContext?.websiteRoot}AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=${userId}`;
        return `
                <div id="userCardActions" class="userDetails">
                    <div class="userCardActionArea">
                        ${this.assetHelper.IdCardBlue}
                        <a id="userProfile" href="${profileUrl}" class="userActionCard">Profile</a>
                        ${this.assetHelper.EnterButton2}
                    </div>
                    <div class="userCardActionArea">
                        ${this.assetHelper.LockIcon}
                        <a id="userCredentials" href="${credentialsUrl}" class="userActionCard">User Credentials</a>
                    </div>
                </div>
            `;
    }

    private buildEventCardActions(eventKey: string): string
    {
        var eventDetailsUrl = `${this.ClientContext?.websiteRoot}EventDetail?EventKey=${eventKey}`;
        var eventDashboardUrl = `${this.ClientContext?.websiteRoot}EventDashboard?EventKey=${eventKey}`;
        return `
                <div id="userCardActions" class="userDetails">
                    <div class="userCardActionArea">
                        ${this.assetHelper.ChartLineIcon}
                        <a id="eventDashboard" href="${eventDashboardUrl}" class="userActionCard">Event Dashboard</a>
                        ${this.assetHelper.EnterButton2}
                    </div>
                    <div class="userCardActionArea">
                        ${this.assetHelper.CalendarLinesPenIcon}
                        <a id="eventDetails" href="${eventDetailsUrl}" class="userActionCard">Event Details</a>
                    </div>
                </div>
            `;
    }

    private buildProfile(data: any): string
    {
        var status = data?.Status?.Description;
        var memberType = data?.AdditionalAttributes?.$values[0].Value;
        var birthDate = Sanitizer.date(data?.BirthDate);
        var phone0 = data?.Phones?.$values[0]?.Number;
        var phone0Type = Sanitizer.phone(data?.Phones?.$values[0]?.PhoneType);
        var phone1 = data?.Phones?.$values[1]?.Number;
        var phone1Type = Sanitizer.phone(data?.Phones?.$values[1]?.PhoneType);
        var email1 = data?.Emails?.$values[0]?.Address;
        var email1IsPrimary = data?.Emails?.$values[0]?.IsPrimary;
        var email1Type = Sanitizer.emailType(data?.Emails?.$values[0]?.EmailType);
        var email2 = data?.Emails?.$values[1]?.Address;
        var email2IsPrimary = data?.Emails?.$values[1]?.IsPrimary;
        var email2Type = Sanitizer.emailType(data?.Emails?.$values[1]?.EmailType);
        var email3 = data?.Emails?.$values[2]?.Address;
        var email3IsPrimary = data?.Emails?.$values[2]?.IsPrimary;
        var email3Type = Sanitizer.emailType(data?.Emails?.$values[2]?.EmailType);
        var address0 = Sanitizer.fullAddress(data?.Addresses?.$values[0]?.Address?.FullAddress);
        var address0Type = Sanitizer.addressPurpose(data?.Addresses?.$values[0]?.AddressPurpose);
        var address1 = Sanitizer.fullAddress(data?.Addresses?.$values[1]?.Address?.FullAddress);
        var address1Type = Sanitizer.addressPurpose(data?.Addresses?.$values[1]?.AddressPurpose);
        var address2 = Sanitizer.fullAddress(data?.Addresses?.$values[2]?.Address?.FullAddress);
        var address2Type = Sanitizer.addressPurpose(data?.Addresses?.$values[2]?.AddressPurpose);
        var companyName = data?.PrimaryOrganization?.Name;
        var companyId = data?.PrimaryOrganization?.OrganizationPartyId
        var userTitle = data?.PrimaryOrganization?.Title;
        return `
            <div id="userCardProfile" class="userDetails">
                <h3 id="destinationUsersName" style="color: #005e7d; margin: 2px">${data?.Name}</h3>
                <div id="details" style="font-size: 90%;">
                    <div id="userDetailsTop" style="margin: 0px 0px 5px 1px;">
                        <span id="destinationUsersId" class="userDetails userSpecificDetail userIndividual" style="padding-right: 6px;">
                            <span class="Label workBarLabel destinationUsersIdLabel">ID </span>${data?.Id}
                        </span>
                        <span id="destinationUsersStatus" class="userDetails userSpecificDetail userIndividual" style="padding-right: 6px;">
                            <span class="Label workBarLabel destinationUsersStatusLabel">Status </span>${status}
                        </span>
                        <span id="destinationUsersMemberType" class="userDetails userSpecificDetail">
                            <span class="Label workBarLabel destinationUsersTypeLabel">Type </span>${memberType}
                        </span>
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${birthDate ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.CakeIcon}
                            <span class="textBadge">Date of Birth</span>
                            <span style="display:inline-block; vertical-align: middle;">${birthDate}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber0">
                        ${phone0 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.PhoneIcon}
                            <span class="textBadge">${phone0Type}</span>
                            <a href="tel:${phone0}" style="display:inline-block; vertical-align: middle;">${phone0}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber1">
                        ${phone1 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.PhoneIcon}
                            <span class="textBadge">${phone1Type}</span>
                            <a href="tel:${phone1}" style="display:inline-block; vertical-align: middle;">${phone1}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail1">
                        ${email1 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.EmailIcon}
                            ${email1IsPrimary ? `${this.assetHelper.PrimaryButton}` : `<span class="textBadge">${email1Type}</span>`}
                            <a href="mailto:${email1}" style="display:inline-block; vertical-align: middle;">${email1}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail2">
                        ${email2 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.EmailIcon}
                            ${email2IsPrimary ? `${this.assetHelper.PrimaryButton}` : `<span class="textBadge">${email2Type}</span>`}
                            <a href="mailto:${email2}" style="display:inline-block; vertical-align: middle;">${email2}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail3">
                        ${email3 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.EmailIcon}
                            ${email3IsPrimary ? `${this.assetHelper.PrimaryButton}` : `<span class="textBadge">${email3Type}</span>`}
                            <a href="mailto:${email3}" style="display:inline-block; vertical-align: middle;">${email3}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress0">
                        ${address0 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.MailboxIcon}
                            <span class="textBadge">${address0Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address0}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress1">
                        ${address1 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.MailboxIcon}
                            <span class="textBadge">${address1Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address1}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress2">
                        ${address2 ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.MailboxIcon}
                            <span class="textBadge">${address2Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address2}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersCompanyName">
                        ${companyName ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.BuildingIcon}
                            ${companyId ? `
                                <a href="${this.ClientContext?.websiteRoot}Party.aspx?ID=${companyId}">
                                    <span style="vertical-align: middle;">${companyName}</span>
                                    <span class="userDetailsBadge">ID ${companyId}</span>
                                </a>
                                ` : `
                                <span style="vertical-align: middle;">${companyName}</span>
                                <span class="userDetailsBadge">Company ID Not Correctly Linked</span>`
                }
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersTitle">
                        ${userTitle ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.UserTagIcon}
                            <span style="display:inline-block; vertical-align: middle;">${userTitle}</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    private buildProfileFooter(username: string, data: any): string
    {
        var createdOn = Sanitizer.date(data?.UpdateInformation?.CreatedOn);
        var createdBy = data?.UpdateInformation?.CreatedBy;
        var updatedOn = Sanitizer.date(data?.UpdateInformation?.UpdatedOn);
        var updatedBy = data?.UpdateInformation?.UpdatedBy;
        return `
            <div class="userDetails" id="userCardChangeDetails">
                <span id="destinationUsersCreatedOn">
                    <span class="Label workBarLabel">Created </span>${createdOn}
                </span>
                <span id="destinationUsersCreatedBy">by ${createdBy}</span>
                <span id="destinationUsersUpdatedOn">
                    <span class="Label workBarLabel">Last Updated </span>${updatedOn}
                </span>
                <span id="destinationUsersUpdatedBy">by ${updatedBy}</span>
                <span id="destinationUsersUsername">
                    ${username ? `
                        <span class="Label workBarLabel workBarUsernameLabel">Username </span>${username}
                    ` : ''}
                </span>
            </div>
        `;
    }

    private buildOpenSearch(): void
    {
        var view = this.assetHelper.OpenSearchView;
        var result = view?.replace(`<svg class="menu-icon"></svg>`, this.assetHelper.MenuIcon ?? "");
        this.$('#masterTopBarAuxiliary > .navbar-left').css('display', 'flex');
        this.$('#masterTopBarAuxiliary > .navbar-left').append(this.$.parseHTML(result ?? ""));
        this.$('.menu-icon-container')
            .on('mouseenter', e =>
            {
                this.$(e).animate({ width: 104 }, 100, 'linear');
                setTimeout(() =>
                {
                    this.$('.hover-text').animate({ 'font-size': '90%' }, 100, 'linear');
                    this.$('.hover-text').show();
                }, 25);
            })
            .on("mouseleave", e =>
            {
                this.$('.hover-text').hide().css('font-size', '1px');
                this.$(e).css('width', 'auto');
            })
            .on("click", async e =>
            {
                await this.showOverlay();
                e.preventDefault();
            });
    }

    private buildEvent(event: any, staffContactName: string, eventCategoryDescription: string): string
    {
        var name = event?.Name;
        var id = event?.EventId;
        var status = Sanitizer.statusCodeDescription(event?.Status);
        var startDate = Sanitizer.date(event?.StartDateTime);
        var endDate = Sanitizer.date(event?.EndDateTime);
        var description = (event?.Description ?? "").trim().replace(/(<([^>]+)>)/gi, "");
        var virtualMeetingUrl = event?.VirtualMeetingUrl
        return `
            <div id="userCardProfile" class="userDetails">
                <h3 id="destinationUsersName" style="color: #005e7d; margin: 2px">${name}</h3>
                <div id="details" style="font-size: 90%;">
                    <div id="userDetailsTop" style="margin: 0px 0px 5px 1px;">
                        <span id="destinationUsersId" class="userDetails userSpecificDetail userIndividual" style="padding-right: 6px;">
                            <span class="Label workBarLabel destinationUsersIdLabel">ID </span>${id}
                        </span>
                        <span id="destinationUsersMemberType" class="userDetails userSpecificDetail">
                            <span class="Label workBarLabel destinationUsersTypeLabel">Category </span>${eventCategoryDescription ?? ""}
                        </span>
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${startDate ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.CalendarIcon}
                            <span class="textBadge">Start Date</span>
                            <span style="display:inline-block; vertical-align: middle;">${startDate}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${endDate ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.CalendarIcon}
                            <span class="textBadge">End Date</span>
                            <span style="display:inline-block; vertical-align: middle;">${endDate}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${staffContactName ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.UserTagIcon}
                            <span class="textBadge">Staff Contact</span>
                            <span style="display:inline-block; vertical-align: middle;">${staffContactName}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${virtualMeetingUrl ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.LinkSolidIcon}
                            <span class="textBadge">Virtual Meeting URL</span>
                            <span style="display:inline-block; vertical-align: middle;">
                                <a href="${virtualMeetingUrl}" class="userActionCard">${virtualMeetingUrl}</a>
                            </span>
                        </div>`: ''}
                    </div>
                    <br />
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${description ? `
                        <div style="padding:2px 0;">
                            ${this.assetHelper.DescriptionIcon}
                            <span class="textBadge">Description</span>
                            <span style="display:inline-block; vertical-align: middle; padding-top:4px;">${description}</span>
                        </div>`: ''}
                    </div>
                </div>
            </div>
        `;
    }

    private buildEventFooter(status: string): string
    {
        return `
            <div class="userDetails" id="userCardChangeDetails">
                <span id="destinationUsersCreatedOn">
                    <span class="Label workBarLabel">Status </span>${status}
                </span>
            </div>
        `;
    }

    public async setEventDetails(event: any): Promise<boolean>
    {
        var input = this.$('#commandBarInput').val() as string;
        var url = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        if (event)
        {
            // Set up view
            var content = this.assetHelper.EventDetailsView;
            this.$("#EventDetailsTab").replaceWith(content ?? "");

            var eventCategoryId = event?.Category?.EventCategoryId;
            var eventCategoryDescription = eventCategoryId ? await this.apiHelper.getEventCategory(eventCategoryId, rvToken, url) as any : null;

            var staffContactId = event?.NotificationPartyId;
            var contactData = staffContactId ? await this.apiHelper.getParty(staffContactId, rvToken, url) as any : null;
            var staffContactName = contactData?.Name;

            // Update view left column
            var eventHtml = this.buildEvent(event, staffContactName, eventCategoryDescription)
            this.$('#userCardProfile').replaceWith(eventHtml);

            // Update view right column
            var eventActions = this.buildEventCardActions(input);
            this.$('#userCardActions').replaceWith(eventActions);

            // Update view footer
            var changeDetails = this.buildEventFooter(Sanitizer.statusCodeDescription(event?.Status));
            this.$("#userCardChangeDetails").replaceWith(changeDetails);

            return true;
        }
        else
        {
            return false;
        }
    }

    public async setUserDetails(userId = ''): Promise<boolean>
    {
        var input = userId ? userId : this.$('#commandBarInput').val() as string;
        if (!input) return false;

        var url = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        var data = await this.apiHelper.getParty(input, rvToken, url);
        if (data)
        {
            // Set up view
            var content = this.assetHelper.UserDetailsView;
            this.$("#UserDetailsTab").replaceWith(content ?? "");

            var username = await this.apiHelper.getUserName(input, rvToken, url) ?? "";

            // Update view left column
            var profile = this.buildProfile(data)
            this.$('#userCardProfile').replaceWith(profile);

            // Update view right column
            var userActions = this.buildUserCardActions(input);
            this.$('#userCardActions').replaceWith(userActions);

            // Update view footer
            var changeDetails = this.buildProfileFooter(username, data);
            this.$("#userCardChangeDetails").replaceWith(changeDetails);

            return true;
        }
        else
        {
            return false;
        }
    }

    private removeUserDetailsInfo(): void
    {
        this.$("#UserDetailsTab").empty();
    }

    private buildConfig(configJson: ConfigItem[]): void
    {
        var baseUrl = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        this.ConfigRoutes = configJson.filter(d => !d.isTag);
        this.ConfigTags = configJson.filter(d => d.isTag);
        var view = this.config.buildRoutesHtml(this.ConfigRoutes);
        this.$('#commandBarUl').html(view);
        this.config.setEventListeners(rvToken, baseUrl);
    }

    public getLoader(): string
    {
        return `<div class="lookupLoader" style="display: inline; margin-left: 6px;">
                    <span class="spinner"></span>
                </div>`;
    }

    public getInputLoader(): string
    {
        return `<div class="inputLoader">
                    <span class="spinner"></span>
                </div>`;
    }

    public getInputErrorBadge(): string
    {
        return `<span class="inputErrorBadge">No Matching Record Found</span>`;
    }

    public getLookupErrorBadge(): string
    {
        return `<span class="lookupErrorBadge">No Matching Record Found</span>`;
    }

    public activateTab(activateTab: string): void
    {
        if (activateTab !== '')
        {
            var showTab = this.Tabs.filter(t => t == activateTab)[0];
            this.$(`#${showTab}`).show();
            this.$('.loaderParent').hide();
        }
        else
        {
            this.$('.loaderParent').show();
        }

        var hideTabs = this.Tabs.filter(t => t !== activateTab);
        hideTabs.forEach(tab =>
        {
            if (tab == this.UserDetailsTab)
            {
                this.removeUserDetailsInfo();
            }
            this.$(`#${tab}`).hide();
        });
    }

    private setArrowEventListeners(): void
    {
        this.$('#commandBarInput').off("keydown.ArrowEvents");
        var index = 0;
        var listItems = this.$(".commandBarListItem");
        this.$(listItems[index]).addClass("commandBarSelected");
        this.$('#commandBarInput').on("keydown.ArrowEvents", event =>
        {
            if (this.$("#CommandBarSelectTab").is(":visible"))
            {
                switch (event.key)
                {
                    case "ArrowUp":
                        event.preventDefault();
                        this.$(listItems[index]).removeClass("commandBarSelected");
                        index = index > 0 ? --index : 0;
                        this.$(listItems[index]).addClass("commandBarSelected");
                        this.$(listItems[index]).get(0)?.scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        this.$(listItems[index]).removeClass("commandBarSelected");
                        index = index < listItems.length - 1 ? ++index : listItems.length - 1;
                        this.$(listItems[index]).addClass("commandBarSelected");
                        this.$(listItems[index]).get(0)?.scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "Enter":
                        event.preventDefault();
                        this.$(listItems[index]).children().get(0)?.click();
                        break;
                }
            }
        });
    }

    private checkUser(currentActionBarValue: string): void
    {
        var baseUrl = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        var inputSpinner = this.$("#commandBarInput").siblings(".inputLoader");

        if (inputSpinner.length == 0)
        {
            this.$("#commandBarInput").after(this.getInputLoader());
        }

        this.setUserDetails().then(foundUser =>
        {
            this.$('#commandBarInput').siblings(".inputLoader").remove();
            if (foundUser)
            {
                this.activateTab(this.UserDetailsTab);
            }
            else
            {
                this.$("#commandBarInput").after(this.getInputErrorBadge());
                if (this.$("#CommandBarSelectTab").is(":hidden"))
                {
                    this.activateTab(this.CommandBarSelectTab);
                    var tagsHTML = this.config.buildTagsHtml(this.ConfigTags, 0, currentActionBarValue);
                    this.$('#commandBarUl').html(tagsHTML);
                    this.config.setEventListeners(rvToken, baseUrl, true);
                    this.setArrowEventListeners();
                }
            }
        })
    }

    private captureInput(): void
    {
        this.$('#commandBarInput').off('input.CaptureInput');
        this.$('#commandBarInput').on('input.CaptureInput', event =>
        {
            var baseUrl = this.ClientContext?.baseUrl ?? "";
            var rvToken = this.RVToken ?? "";
            if (this.$(".commandBarListItem")[0])
            {
                this.$(".commandBarListItem")[0].scrollIntoView();
            }
            this.$('#commandBarOverlay').find('.lookupErrorBadge')?.remove();
            this.$('#commandBarOverlay').find('.inputErrorBadge')?.remove();
            var currentActionBarValue = this.$(event.target).val() as string;
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);
            if (isActionBarNumeric === true && currentActionBarValue.length >= 1 && currentActionBarValue.length <= 10)
            {
                this.debouncer.start(v => this.checkUser(v), 500, currentActionBarValue);
            }
            else
            {
                this.$("#commandBarInput").siblings(".inputLoader")?.remove();
                this.debouncer.stop();
                if (this.$("#CommandBarSelectTab").is(":hidden"))
                {
                    this.activateTab(this.CommandBarSelectTab);
                    Utils.log('remove user details view...');
                }

                if (currentActionBarValue)
                {
                    var filteredSearch = (result: any) => result.score < 0.6;
                    const options = {
                        includeScore: true,
                        ignoreLocation: true,
                        includeMatches: true,
                        findAllMatches: true,
                        threshold: 0.2,
                        keys: ['category', 'displayName', 'altName'],
                        shouldSort: true
                    }
                    const fuse = new Fuse(this.ConfigRoutes, options)
                    var results: Fuzzy[] = fuse.search(currentActionBarValue);
                    var filteredResults = results.filter(filteredSearch).map(fr => fr.item);
                    var routesHTML = this.config.buildRoutesHtml(filteredResults);
                    var tagsHTML = this.config.buildTagsHtml(this.ConfigTags, filteredResults.length, currentActionBarValue);
                    this.$('#commandBarUl').html(routesHTML.concat(tagsHTML));
                    this.config.setEventListeners(rvToken, baseUrl, true);
                    this.setArrowEventListeners();
                    this.setActionCardHotkeyListeners();
                }
                else
                {
                    this.buildDefaultView(rvToken, baseUrl);
                }
            }
        });
    }

    private getNextPlaceholder(): string
    {
        const currentItem = this.PlaceholderTextArray[this.CurrentPlaceholderIndex];
        this.CurrentPlaceholderIndex = (this.CurrentPlaceholderIndex + 1) % this.PlaceholderTextArray.length;
        return currentItem;
    }

    private buildDefaultView(rvToken: string, baseUrl: string): void
    {
        var routesHTML = this.config.buildRoutesHtml(this.ConfigRoutes);
        this.$('#commandBarUl').html(routesHTML);
        this.config.setEventListeners(rvToken, baseUrl);
        this.setArrowEventListeners();
        this.setActionCardHotkeyListeners();
    }

    private async showOverlay(): Promise<void>
    {
        var baseUrl = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";

        if (this.$("#commandBarOverlay").is(":hidden"))
        {
            this.activateTab(this.CommandBarSelectTab);

            this.buildDefaultView(rvToken, baseUrl);

            this.$("#commandBarInput").attr("placeholder", this.getNextPlaceholder());

            // set up event listeners
            this.setArrowEventListeners();
            this.setActionCardHotkeyListeners();
            this.$('#commandBarExitButton').off("click.CloseSearchBar");
            this.$('#commandBarExitButton').on("click.CloseSearchBar", async () =>
            {
                await this.hideOverlay();
            });
            this.captureInput();
            this.$('#commandBarOverlay').show();
            this.$('#commandBarInput').trigger("focus");
        }
    }

    private async hideOverlay(): Promise<void>
    {
        // remove error badges
        this.$('#commandBarOverlay').find('.lookupErrorBadge')?.remove();
        this.$('#commandBarOverlay').find('.inputErrorBadge')?.remove();

        // remove user input
        this.$('#commandBarInput').val('');

        // hide search bar
        this.$('#commandBarOverlay').hide();

        // remove handlers
        this.$('#commandBarExitButton').off("click.CloseSearchBar");
        this.$('#commandBarInput').off('input.CaptureInput');
        this.$('#commandBarInput').off('keydown.ArrowEvents');
        this.$('#commandBarInput').off('keydown.TabCardActions');
    }
}

new WorkBar(jQuery);