/// <reference path="../settings/settings.ts" />
/// <reference path="../utils.ts" />

class SearchBar
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

    // TESTING
    private RVToken: string | null = null;
    private DocumentationUrl: string = "https://help.imis.com/enterprise/search.htm";
    private ClientContext: ClientContext | null = null;
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

    /**
     * Initializes the various elements of this module..
     */
    async init(): Promise<void>
    {
        var config = await this.settings.load();

        if (!config.enableWorkbar) return;

        this.$(() =>
        {
            console.log(Utils.VERSION_STRING + "Loaded: Search Bar", ...SearchBar.VERSION_STYLES);

            this.RVToken = this.$("#__RequestVerificationToken").val() as string;
            this.ClientContext = JSON.parse(this.$('#__ClientContext').val() as string) as ClientContext;

            // we want to prevent non-users from using the searchbar
            if (this.ClientContext.isAnonymous) return;

            this.config.CheckForConfigUpdate().then(() =>
            {
                console.log('CheckForConfigUpdate complete');
                this.assetHelper.GetAllAssets()
                    .then(() =>
                    {
                        console.log('GetAllAssets complete');
                        this.$('body').prepend(this.assetHelper.CommandBar ?? "");
                        this.$("#commandBarOverlay #logo-placeholder").replaceWith(this.assetHelper.CsiLogo ?? "");
                        this.$("#commandBarOverlay .externalIconWhite").replaceWith(this.assetHelper.ExternalIconWhite ?? "");
                        this.$("#commandBarOverlay .externalIcon").replaceWith(this.assetHelper.ExternalIcon ?? "");
                        this.$("#commandBarOverlay #commandBarExitButton").html(this.assetHelper.CloseIcon ?? "");
                        this.BuildOpenSearch();
                    })
                    .then(() => this.config.GetConfig())
                    .then(configJson => this.BuildConfig(configJson));

                let keysPressed: { [key: string]: boolean } = {};

                // on key down
                this.$(document).on("keydown", async e =>
                {
                    var isCommandBarVisible = this.$("#commandBarOverlay").is(":visible");

                    // Replace space in e.key with "Spacebar"
                    if (e.key === " ")
                    {
                        e.key = Settings.SPACEBAR;
                    }

                    // Open CommandBar
                    if (!isCommandBarVisible
                        && e.key.toLowerCase() === config.workbarShortcut.toLowerCase()
                        && e.ctrlKey === config.workbarKbdCtrl
                        && e.altKey === config.workbarKbdAlt
                        && e.shiftKey === config.workbarKbdShift)
                    {
                        await this.showOverlay();
                        e.preventDefault();
                    }
                    // Close Command Bar
                    else if (isCommandBarVisible && e.key === "Escape")
                    {
                        await this.hideOverlay();
                    }
                    // Go to User Profile
                    else if (isCommandBarVisible && e.key === "Enter" && this.$("#UserDetailsTab").is(":visible") && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"])
                    {
                        if (this.$('#commandBarInput').get(0) === document.activeElement)
                        {
                            this.ActivateTab('');
                            this.$("#userProfile").get(0)?.click();
                        }
                        e.preventDefault();
                    }
                    // Go to Event Details
                    else if (isCommandBarVisible && e.key === "Enter" && this.$("#EventDetailsTab").is(":visible") && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"])
                    {
                        if (this.$('#commandBarInput').get(0) === document.activeElement)
                        {
                            this.ActivateTab('');
                            this.$("#eventDetails").get(0)?.click();
                        }
                        e.preventDefault();
                    }
                });

                document.addEventListener('keyup', (event) =>
                {
                    var key = event.key.toLowerCase();
                    delete keysPressed[key];
                });
            });
        });
    }

    private BuildUserCardActions(userId: string): string
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

    private BuildEventCardActions(eventKey: string): string
    {
        var eventDetailsUrl = `${this.ClientContext?.websiteRoot}EventDetail?EventKey=${eventKey}`;
        var eventDashboardUrl = `${this.ClientContext?.websiteRoot}EventDashboard?EventKey=${eventKey}`;
        return `
                <div id="userCardActions" class="userDetails">
                    <div class="userCardActionArea">
                        ${this.assetHelper.CalendarLinesPenIcon}
                        <a id="eventDetails" href="${eventDetailsUrl}" class="userActionCard">Event Details</a>
                        ${this.assetHelper.EnterButton2}
                    </div>
                    <div class="userCardActionArea">
                        ${this.assetHelper.ChartLineIcon}
                        <a id="eventDashboard" href="${eventDashboardUrl}" class="userActionCard">Event Dashboard</a>
                    </div>
                </div>
            `;
    }

    private BuildProfile(data: any): string
    {
        var status = data?.Status?.Description;
        var memberType = data?.AdditionalAttributes?.$values[0].Value;
        var birthDate = CleanUp.Date(data?.BirthDate);
        var phone0 = data?.Phones?.$values[0]?.Number;
        var phone0Type = CleanUp.Phone(data?.Phones?.$values[0]?.PhoneType);
        var phone1 = data?.Phones?.$values[1]?.Number;
        var phone1Type = CleanUp.Phone(data?.Phones?.$values[1]?.PhoneType);
        var email1 = data?.Emails?.$values[0]?.Address;
        var email1IsPrimary = data?.Emails?.$values[0]?.IsPrimary;
        var email1Type = CleanUp.EmailType(data?.Emails?.$values[0]?.EmailType);
        var email2 = data?.Emails?.$values[1]?.Address;
        var email2IsPrimary = data?.Emails?.$values[1]?.IsPrimary;
        var email2Type = CleanUp.EmailType(data?.Emails?.$values[1]?.EmailType);
        var email3 = data?.Emails?.$values[2]?.Address;
        var email3IsPrimary = data?.Emails?.$values[2]?.IsPrimary;
        var email3Type = CleanUp.EmailType(data?.Emails?.$values[2]?.EmailType);
        var address0 = CleanUp.FullAddress(data?.Addresses?.$values[0]?.Address?.FullAddress);
        var address0Type = CleanUp.AddressPurpose(data?.Addresses?.$values[0]?.AddressPurpose);
        var address1 = CleanUp.FullAddress(data?.Addresses?.$values[1]?.Address?.FullAddress);
        var address1Type = CleanUp.AddressPurpose(data?.Addresses?.$values[1]?.AddressPurpose);
        var address2 = CleanUp.FullAddress(data?.Addresses?.$values[2]?.Address?.FullAddress);
        var address2Type = CleanUp.AddressPurpose(data?.Addresses?.$values[2]?.AddressPurpose);
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

    private BuildProfileFooter(username: string, data: any): string
    {
        var createdOn = CleanUp.Date(data?.UpdateInformation?.CreatedOn);
        var createdBy = data?.UpdateInformation?.CreatedBy;
        var updatedOn = CleanUp.Date(data?.UpdateInformation?.UpdatedOn);
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

    private BuildOpenSearch(): void
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

    private BuildEvent(event: any, staffContactName: string, eventCategoryDescription: string): string
    {
        var name = event?.Name;
        var id = event?.EventId;
        var status = CleanUp.Status(event?.Status);
        var startDate = CleanUp.Date(event?.StartDateTime);
        var endDate = CleanUp.Date(event?.EndDateTime);
        var description = (event?.Description ?? "").trim().replace(/(<([^>]+)>)/gi, "");
        // TODO: remove - this is for testing
        var virtualMeetingUrl = event?.VirtualMeetingUrl ? event?.VirtualMeetingUrl : "https://www.google.com";
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
                            <span style="display:inline-block; vertical-align: middle;">${virtualMeetingUrl}</span>
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

    private BuildEventFooter(status: string): string
    {
        return `
            <div class="userDetails" id="userCardChangeDetails">
                <span id="destinationUsersCreatedOn">
                    <span class="Label workBarLabel">Status </span>${status}
                </span>
            </div>
        `;
    }

    public async SetEventDetails(event: any): Promise<boolean>
    {
        var input = this.$('#commandBarInput').val() as string;
        var url = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        console.log('event = ', event);
        if (event)
        {
            // Set up view
            var content = this.assetHelper.EventDetailsView;
            this.$("#EventDetailsTab").replaceWith(content ?? "");

            var eventCategoryId = event?.Category?.EventCategoryId;
            var eventCategoryDescription = eventCategoryId ? await this.apiHelper.GetEventCategory(eventCategoryId, rvToken, url) as any : null;

            var staffContactId = event?.NotificationPartyId;
            var contactData = staffContactId ? await this.apiHelper.GetParty(staffContactId, rvToken, url) as any : null;
            var staffContactName = contactData?.Name;

            var eventHtml = this.BuildEvent(event, staffContactName, eventCategoryDescription)
            this.$('#userCardProfile').replaceWith(eventHtml);

            var eventActions = this.BuildEventCardActions(input);
            this.$('#userCardActions').replaceWith(eventActions);
            this.$('#eventDetails').on('click', () => this.ActivateTab(''));
            this.$('#eventDashboard').on('click', () => this.ActivateTab(''));

            // Update view footer
            var changeDetails = this.BuildEventFooter(CleanUp.Status(event?.Status));
            this.$("#userCardChangeDetails").replaceWith(changeDetails);

            return true;
        }
        else
        {
            return false;
        }
    }

    // Build this Tab on the fly and scrap the whole thing when you're done
    public async SetUserDetails(userId = ''): Promise<boolean>
    {
        var input = userId ? userId : this.$('#commandBarInput').val() as string;
        if (!input) return false;
        console.log('input = ', input);
        var url = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        var data = await this.apiHelper.GetParty(input, rvToken, url);
        console.log('GetParty = ', data);
        if (data)
        {
            // Set up view
            var content = this.assetHelper.UserDetailsView;
            this.$("#UserDetailsTab").replaceWith(content ?? "");

            var username = await this.apiHelper.GetUserName(input, rvToken, url) ?? "";

            // Update view left column
            var profile = this.BuildProfile(data)
            this.$('#userCardProfile').replaceWith(profile);

            // Update view right column
            var userActions = this.BuildUserCardActions(input);
            this.$('#userCardActions').replaceWith(userActions);
            this.$('#userProfile').on('click', () => this.ActivateTab(''));
            this.$('#userCredentials').on('click', () => this.ActivateTab(''));

            // Update view footer
            var changeDetails = this.BuildProfileFooter(username, data);
            this.$("#userCardChangeDetails").replaceWith(changeDetails);

            return true;
        }
        else
        {
            return false;
        }
    }

    private RemoveUserDetailsInfo(): void
    {
        this.$("#UserDetailsTab").empty();
    }

    private BuildConfig(configJson: ConfigItem[]): void
    {
        console.log('BuildConfig');
        var baseUrl = this.ClientContext?.baseUrl ?? "";
        var rvToken = this.RVToken ?? "";
        this.ConfigRoutes = configJson.filter(d => !d.isTag);
        this.ConfigTags = configJson.filter(d => d.isTag);
        var view = this.config.BuildRoutesHTML(this.ConfigRoutes);
        this.$('#commandBarUl').html(view);
        this.config.SetEventListeners(rvToken, baseUrl);
        console.log('BuildConfig complete');
    }

    public GetLoader(): string
    {
        return `<div class="lookupLoader" style="display: inline; margin-left: 6px;">
                    <span class="spinner"></span>
                </div>`;
    }

    public GetInputErrorBadge(): string
    {
        return `<span class="inputErrorBadge">No Matching Record Found</span>`;
    }

    public GetLookupErrorBadge(): string
    {
        return `<span class="lookupErrorBadge">No Matching Record Found</span>`;
    }

    // Use this with '' for showing the spinner so that all tabs are hidden
    public ActivateTab(activateTab: string): void
    {
        console.log('ActivateTab = ', activateTab);
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
            console.log('hide tab...');
            // if (tab == this.CommandBarSelectTab)
            // {
            //     //TODO: this is currently bleeding resources...
            //     this.$(".commandBarListItem").off('keydown');
            // }
            this.$(`#${tab}`).hide();
        });
    }

    private SetArrowEventListeners(): void
    {
        var index = 0;
        var listItems = this.$(".commandBarListItem");
        this.$(listItems[index]).addClass("commandBarSelected");
        this.$(document).on("keydown", event =>
        {
            if (this.$("#CommandBarSelectTab").is(":visible"))
            {
                // console.log('listItems.length = ', listItems.length);
                // console.log('this.$(".commandBarListItem").length = ', this.$(".commandBarListItem").length);
                if (listItems.length != this.$(".commandBarListItem").length)
                {
                    listItems = this.$(".commandBarListItem");
                    index = 0;
                }
                // console.log('arrow navigation index START = ', index);
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
                        this.$(listItems[index]).children().get(0)?.click();
                        break;
                }

                // console.log('arrow navigation index END = ', index);
            }
        });
    }

    private checkUser(currentActionBarValue: string): void
    {
        this.SetUserDetails().then(foundUser =>
        {
            console.log('foundUser = ', foundUser);
            if (foundUser)
            {
                this.ActivateTab(this.UserDetailsTab);
            }
            else
            {
                if (this.$("#CommandBarSelectTab").is(":hidden"))
                {
                    this.ActivateTab(this.CommandBarSelectTab);
                    this.RemoveUserDetailsInfo();

                    var baseUrl = this.ClientContext?.baseUrl ?? "";
                    var rvToken = this.RVToken ?? "";
                    var tagsHTML = this.config.BuildTagsHTML(this.ConfigTags, 0, currentActionBarValue);
                    this.$('#commandBarUl').html(tagsHTML);
                    this.config.SetEventListeners(rvToken, baseUrl, true);
                    this.SetArrowEventListeners();

                    // // add in error badge from jake (this needs to be removed everywhere in activate tab probably)
                    // if (currentActionBarValue.length >= 1 && currentActionBarValue.length <= 10)
                    // {
                    //     this.$("#commandBarInput").siblings(".error").show();
                    // }
                }
            }
        })
    }

    private CaptureInput(): void
    {
        this.$('#commandBarInput').on('input', (event) =>
        {

            if (this.$(".commandBarListItem")[0])
            {
                this.$(".commandBarListItem")[0].scrollIntoView();
            }
            this.$('#commandBarInputDiv').find('.lookupErrorBadge')?.remove();
            var baseUrl = this.ClientContext?.baseUrl ?? "";
            var rvToken = this.RVToken ?? "";
            var currentActionBarValue = this.$(event.target).val() as string;
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);
            if (isActionBarNumeric === true)
            {
                this.ActivateTab('');
                this.debouncer.start(v => this.checkUser(v), 500, currentActionBarValue);
            }
            else
            {
                this.debouncer.stop();
                if (this.$("#CommandBarSelectTab").is(":hidden"))
                {
                    this.ActivateTab(this.CommandBarSelectTab);
                    console.log('remove user details view...');
                    this.RemoveUserDetailsInfo();
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
                    var routesHTML = this.config.BuildRoutesHTML(filteredResults);
                    var tagsHTML = this.config.BuildTagsHTML(this.ConfigTags, filteredResults.length, currentActionBarValue);
                    this.$('#commandBarUl').html(routesHTML.concat(tagsHTML));
                    this.config.SetEventListeners(rvToken, baseUrl, true);
                    this.SetArrowEventListeners();
                }
                else
                {
                    var routesHTML = this.config.BuildRoutesHTML(this.ConfigRoutes);
                    this.$('#commandBarUl').html(routesHTML);
                    this.config.SetEventListeners(rvToken, baseUrl);
                    this.SetArrowEventListeners();
                }
            }
        });
    }

    private async showOverlay(): Promise<void>
    {
        //if already showing
        if (this.$("#commandBarOverlay").is(":hidden"))
        {
            this.ActivateTab(this.CommandBarSelectTab);
            this.RemoveUserDetailsInfo();
            // this.$("#commandBarInput").siblings(".error").hide();

            var routesHTML = this.config.BuildRoutesHTML(this.ConfigRoutes);
            this.$('#commandBarUl').html(routesHTML);

            this.$('#commandBarOverlay').show();
            this.$('#commandBarExitButton').on("click", async () =>
            {
                await this.hideOverlay();
            });
            this.CaptureInput();
            this.$('#commandBarInput').trigger("focus");
            this.SetArrowEventListeners();

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
    }

    private async hideOverlay(): Promise<void>
    {
        console.log('HIDE OVERLAY');
        this.$('#commandBarInputDiv').find('.lookupErrorBadge')?.remove();
        this.$('#commandBarOverlay').hide();

        // remove handlers
        this.$('#commandBarExitButton').off("click");
        this.$('#commandBarInput').off('input');

        // reset whatever view we left off on back to the original
        this.$('#commandBarInput').val('');

        // todo: add search results / config clearing
        this.RemoveUserDetailsInfo();
    }
}

new SearchBar(jQuery);