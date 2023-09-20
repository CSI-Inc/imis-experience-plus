class AssetHelper
{
    //#region Asset Paths

    //View Paths
    public CommandBarPath: string = "assets/components/commandBar.html";
    public EventDetailsViewPath: string = "assets/views/eventDetailsTab.html";
    public OpenSearchViewPath: string = "assets/views/openSearch.html";
    public UserDetailsViewPath: string = "assets/views/userDetailsTab.html";

    //SVG Paths
    public BrowsersIconPath: string = "assets/images/browserIcon.svg";
    public BuildingIconPath: string = "assets/images/buildingIcon.svg"
    public CakeIconPath: string = "assets/images/cakeIcon.svg"
    public CalendarIconPath: string = "assets/images/calendarIcon.svg"
    public CalendarLinesPenIconPath: string = "assets/images/calendarLinesPenIcon.svg"
    public ChartLineIconPath: string = "assets/images/chartLineIcon.svg"
    public CloseIconPath: string = "assets/images/closeIcon.svg";
    public CsiLogoPath: string = "assets/images/csiicon.svg"
    public DescriptionIconPath: string = "assets/images/descriptionIcon.svg"
    public EmailIconPath: string = "assets/images/emailIcon.svg"
    public ExternalIconBluePath: string = "assets/images/externalIconBlue.svg";
    public ExternalIconPath: string = "assets/images/externalIcon.svg";
    public ExternalIconWhitePath: string = "assets/images/externalIconWhite.svg";
    public IdCardBluePath: string = "assets/images/idCardBlue.svg";
    public LinkSolidIconPath: string = "assets/images/linkSolidIcon.svg";
    public LockIconPath: string = "assets/images/lockIcon.svg";
    public MailboxIconPath: string = "assets/images/mailboxIcon.svg"
    public MenuIconPath: string = "assets/images/menuIcon.svg"
    public PhoneIconPath: string = "assets/images/phoneIcon.svg"
    public UserTagIconPath: string = "assets/images/userTagIcon.svg"

    //Component Paths
    public ControlButtonPath: string = "assets/components/buttons/control.html";
    public ControlButton2Path: string = "assets/components/buttons/control2.html";
    public EnterButtonPath: string = "assets/components/buttons/enter.html";
    public EnterButton2Path: string = "assets/components/buttons/enter2.html";
    public PlusButtonPath: string = "assets/components/buttons/plus.html";
    public PrimaryButtonPath: string = "assets/components/buttons/primary.html";
    public ShiftButtonPath: string = "assets/components/buttons/shift.html";
    public VersionBadgeEMSPath: string = "assets/components/buttons/VersionBadge_ems.html";
    public VersionBadge2017Path: string = "assets/components/buttons/VersionBadge_2017.html";

    //#endregion

    //#region Assets

    // Views
    public CommandBar: string | null = null;
    public EventDetailsView: string | null = null;
    public OpenSearchView: string | null = null;
    public UserDetailsView: string | null = null;

    // Icons
    public BrowsersIcon: string | null = null;
    public BuildingIcon: string | null = null;
    public CakeIcon: string | null = null;
    public CalendarIcon: string | null = null;
    public CalendarLinesPenIcon: string | null = null;
    public ChartLineIcon: string | null = null;
    public CloseIcon: string | null = null;
    public CsiLogo: string | null = null;
    public DescriptionIcon: string | null = null;
    public EmailIcon: string | null = null;
    public ExternalIconBlue: string | null = null;
    public ExternalIcon: string | null = null;
    public ExternalIconWhite: string | null = null;
    public IdCardBlue: string | null = null;
    public LinkSolidIcon: string | null = null;
    public LockIcon: string | null = null;
    public MailboxIcon: string | null = null;
    public MenuIcon: string | null = null;
    public PhoneIcon: string | null = null;
    public UserTagIcon: string | null = null;

    // Components
    public ControlButton: string | null = null;
    public ControlButton2: string | null = null;
    public EnterButton: string | null = null;
    public EnterButton2: string | null = null;
    public PlusButton: string | null = null;
    public PrimaryButton: string | null = null;
    public ShiftButton: string | null = null;
    public VersionBadgeEMS: string | null = null;
    public VersionBadge2017: string | null = null;

    //#endregion

    public async GetResource(path: string): Promise<string>
    {
        var url = chrome.runtime.getURL(path);
        return await $.get({ url, dataType: 'html', type: 'GET' });
    }

    public async GetAllAssets(): Promise<void>
    {
        this.CommandBar = await this.GetResource(this.CommandBarPath);
        this.EventDetailsView = await this.GetResource(this.EventDetailsViewPath);
        this.OpenSearchView = await this.GetResource(this.OpenSearchViewPath)
        this.UserDetailsView = await this.GetResource(this.UserDetailsViewPath);

        this.BrowsersIcon = await this.GetResource(this.BrowsersIconPath);
        this.BuildingIcon = await this.GetResource(this.BuildingIconPath);
        this.CakeIcon = await this.GetResource(this.CakeIconPath);
        this.CalendarIcon = await this.GetResource(this.CalendarIconPath);
        this.CalendarLinesPenIcon = await this.GetResource(this.CalendarLinesPenIconPath);
        this.ChartLineIcon = await this.GetResource(this.ChartLineIconPath);
        this.CloseIcon = await this.GetResource(this.CloseIconPath);
        this.CsiLogo = await this.GetResource(this.CsiLogoPath);
        this.DescriptionIcon = await this.GetResource(this.DescriptionIconPath);
        this.EmailIcon = await this.GetResource(this.EmailIconPath);
        this.ExternalIconBlue = await this.GetResource(this.ExternalIconBluePath);
        this.ExternalIcon = await this.GetResource(this.ExternalIconPath);
        this.ExternalIconWhite = await this.GetResource(this.ExternalIconWhitePath);
        this.IdCardBlue = await this.GetResource(this.IdCardBluePath);
        this.LinkSolidIcon = await this.GetResource(this.LinkSolidIconPath);
        this.LockIcon = await this.GetResource(this.LockIconPath);
        this.MailboxIcon = await this.GetResource(this.MailboxIconPath);
        this.MenuIcon = await this.GetResource(this.MenuIconPath);
        this.PhoneIcon = await this.GetResource(this.PhoneIconPath);
        this.UserTagIcon = await this.GetResource(this.UserTagIconPath);

        this.ControlButton = await this.GetResource(this.ControlButtonPath);
        this.ControlButton2 = await this.GetResource(this.ControlButton2Path);
        this.EnterButton = await this.GetResource(this.EnterButtonPath);
        this.EnterButton2 = await this.GetResource(this.EnterButton2Path);
        this.PlusButton = await this.GetResource(this.PlusButtonPath);
        this.PrimaryButton = await this.GetResource(this.PrimaryButtonPath);
        this.ShiftButton = await this.GetResource(this.ShiftButtonPath);
        this.VersionBadgeEMS = await this.GetResource(this.VersionBadgeEMSPath);
        this.VersionBadge2017 = await this.GetResource(this.VersionBadge2017Path);
    }
}