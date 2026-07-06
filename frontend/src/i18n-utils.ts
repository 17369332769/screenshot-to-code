export type Language = "en" | "zh";

export const LANGUAGE_STORAGE_KEY = "app-language";

const translations = {
  en: {
    language: "Language",
    settings: "Settings",
    theme: "Theme",
    appTheme: "App Theme",
    appThemeDescription: "System default, with optional light/dark override",
    codeEditorTheme: "Code Editor Theme",
    codeEditorThemeDescription: "Requires page refresh to update",
    system: "System",
    light: "Light",
    dark: "Dark",
    apiKeys: "API Keys",
    openAiApiKey: "OpenAI API key",
    browserStorageDescription:
      "Only stored in your browser. Never stored on servers. Overrides your .env config.",
    openAiBaseUrlOptional: "OpenAI Base URL (optional)",
    openAiBaseUrlDescription:
      "Replace with a proxy URL if you don't want to use the default.",
    anthropicApiKey: "Anthropic API key",
    geminiApiKey: "Gemini API key",
    imageGeneration: "Image Generation",
    placeholderImages: "Placeholder Images",
    placeholderImagesDescription:
      "More fun with it but if you want to save money, turn it off.",
    screenshotByUrl: "Screenshot by URL",
    screenshotByUrlDescription:
      "If you want to use URLs directly instead of taking the screenshot yourself, add a ScreenshotOne API key.",
    getFreeScreenshots: "Get 100 screenshots/mo for free.",
    screenshotOneApiKey: "ScreenshotOne API key",
    imageToCodeWebsite: "Visual to Code",
    turnScreenshotsIntoCode: "Turn anything visual into frontend code.",
    heroDescription:
      "From screenshots, Figma, URLs, videos, and mockups to production-ready front-end code in seconds.",
    startConverting: "Start Converting",
    seeHowItWorks: "See How It Works",
    navProduct: "Product",
    navExamples: "Examples",
    navPricing: "Pricing",
    navFaq: "FAQ",
    socialProofTitle: "Design and product teams recognize these workflows",
    supportedInputs: "Supported Inputs",
    supportedInputsValue: "Screenshot, URL, Text",
    buildTargets: "Build Targets",
    buildTargetsValue: "React, HTML, Vue",
    bestFor: "Best For",
    bestForValue: "MVPs, clones, redesigns",
    waysToStart: "Ways to start",
    waysToStartTitle: "Start from the material you already have",
    waysToStartDescription:
      "Upload references, capture a live page, describe a concept, or bring your existing code in for refinement.",
    startModeUploadDescription:
      "Drop screenshots, wireframes, or short recordings to anchor the first draft in something concrete.",
    startModeUrlDescription:
      "Point at a live URL when you want to clone structure, benchmark patterns, or speed through teardown work.",
    startModeTextDescription:
      "Start from a prompt when the idea is still rough and you want layout, content, and hierarchy to take shape together.",
    startModeImportDescription:
      "Paste existing code when the work is less about generation and more about upgrading, extending, or reworking a draft.",
    instantPrototypeFlow: "Instant Prototype Flow",
    liveAi: "Live AI",
    uploadScreenshot: "Upload a screenshot",
    uploadScreenshotDescription:
      "Landing pages, dashboard shots, mobile UI, or wireframes.",
    chooseOutputStack: "Choose your output stack",
    chooseOutputStackDescription:
      "HTML, React, Vue, Tailwind, Bootstrap, and more.",
    refineUntilItMatches: "Refine until it matches",
    refineUntilItMatchesDescription:
      "Keep editing with prompts and export clean front-end code.",
    coreProduct: "Core Product",
    imageToCodeReady: "Image to code, ready for your users",
    coreProductDescription:
      "Start with a screenshot, a website URL, or a text description. The generated result opens immediately in the live preview and code editor.",
    multiImageInput: "Multi-image input",
    livePreview: "Live preview",
    editableOutput: "Editable output",
    exportReady: "Export ready",
    fastFirstDraft: "Fast first draft",
    fastFirstDraftDescription:
      "Get a working front-end starting point from a single screenshot instead of rebuilding layouts from scratch.",
    builtForIteration: "Built for iteration",
    builtForIterationDescription:
      "After generation, keep refining the result with follow-up instructions and side-by-side previews.",
    deploymentFriendly: "Deployment-friendly",
    deploymentFriendlyDescription:
      "Use this as the front door of a hosted product, then connect your own domain, API keys, and deployment pipeline.",
    builtForRealWork: "Built for real work",
    workflowTitle: "From reference to working front-end without losing momentum",
    workflowDescription:
      "The strongest part of the experience is not the first generation alone. It is the ability to move from source material into a previewable draft, keep editing, and stay inside one continuous workflow.",
    workflowMapEyebrow: "Workflow map",
    workflowMapTitle: "A tighter loop from idea to iteration",
    workflowMapDescription:
      "Move from source material into a previewable draft, then keep improving it without restarting from scratch.",
    localWorkspaceTitle: "A strong local workspace still deserves a strong homepage",
    localWorkspaceDescription:
      "Even when everything runs locally, teams still need a workflow that feels flexible, deep, and believable enough to turn rough drafts into usable front-end output.",
    beforeAfter: "Before and after",
    beforeAfterTitle: "Show the transformation, not just the promise",
    beforeAfterDescription:
      "These examples show what the generated front-end usually looks like after a screenshot turns into an editable draft.",
    beforeReference: "Before · reference",
    afterOutput: "After · generated output",
    showcaseLandingPage: "Marketing landing page",
    showcaseLandingPageSource:
      "A screenshot of a polished hero section with feature blocks, pricing teaser, and a bold call to action.",
    showcaseLandingPageResult:
      "A reusable landing page draft with a clear hero, section spacing, conversion-focused content blocks, and code that is ready for iteration.",
    showcaseLandingPageHighlight1: "Reusable hero + CTA",
    showcaseLandingPageHighlight2: "Feature and pricing sections",
    showcaseLandingPageHighlight3: "Editable marketing layout",
    showcaseDashboard: "SaaS dashboard",
    showcaseDashboardSource:
      "A product dashboard reference with stats cards, filters, table views, and navigation patterns.",
    showcaseDashboardResult:
      "A dashboard scaffold with stats panels, filter controls, table regions, and cleaner component boundaries for follow-up product work.",
    showcaseDashboardHighlight1: "Stats cards and filters",
    showcaseDashboardHighlight2: "Responsive table layout",
    showcaseDashboardHighlight3: "Sidebar and content shell",
    showcaseMobileApp: "Mobile app UI",
    showcaseMobileAppSource:
      "A mobile screen collection showing onboarding, cards, bottom navigation, and progress elements.",
    showcaseMobileAppResult:
      "A mobile-first draft that preserves screen flow, card hierarchy, navigation patterns, and the structure needed for faster iteration.",
    showcaseMobileAppHighlight1: "Screen-by-screen flow",
    showcaseMobileAppHighlight2: "Bottom navigation states",
    showcaseMobileAppHighlight3: "Cards and progress UI",
    whoThisIsFor: "Who this is for",
    whoThisIsForDescription:
      "These are the teams most likely to get useful front-end drafts quickly from screenshots, references, and early UI ideas.",
    useCaseFounders: "Startup teams",
    useCaseFoundersTitle: "Turn ideas into MVPs without rebuilding every screen",
    useCaseFoundersDescription:
      "Use screenshots, references, and rough mockups to ship clickable product drafts faster while keeping engineering focused on core logic.",
    useCaseDesigners: "Design workflows",
    useCaseDesignersTitle: "Bridge the gap between mockups and usable front-end",
    useCaseDesignersDescription:
      "Convert polished UI references into editable code that can be reviewed, iterated on, and handed off with less friction.",
    useCaseAgencies: "Client delivery",
    useCaseAgenciesTitle: "Speed up landing pages, redesigns, and visual experiments",
    useCaseAgenciesDescription:
      "Generate a strong first pass from screenshots or competitor references, then refine the result for campaigns, demos, or client previews.",
    testimonials: "User feedback",
    testimonialsTitle: "What teams want to hear before they commit",
    testimonialsDescription:
      "People are more likely to try the product when they can picture similar teams using it successfully.",
    testimonialBridgeEyebrow: "What it looks like in practice",
    testimonialBridgeTitle: "Signals that the workflow keeps paying off after the first draft",
    testimonial1Quote:
      "We used screenshot references to move from idea to working landing page draft in a single afternoon instead of losing a week in back-and-forth.",
    testimonial1Author: "Maya Chen",
    testimonial1Role: "Founder · B2B SaaS",
    testimonial2Quote:
      "The useful part was not just generation. It was being able to keep iterating on the output until the front-end looked close enough to ship internally.",
    testimonial2Author: "Jordan Lee",
    testimonial2Role: "Product Designer",
    testimonial3Quote:
      "For client mockups and redesign pitches, this gave us a much faster first pass that still felt editable and presentable.",
    testimonial3Author: "Alicia Ramos",
    testimonial3Role: "Creative Agency Lead",
    whatYouGet: "What you get",
    whatYouGetTitle: "More than a demo. A usable front-end starting point.",
    whatYouGetDescription:
      "The best image-to-code workflows do not stop at generation. They help you preview, revise, and keep moving toward a shippable result.",
    resultResponsiveLayouts: "Responsive layout structure",
    resultComponentStructure: "Organized page and component output",
    resultEditableCode: "Editable code after generation",
    resultFastIteration: "Follow-up iterations with prompts",
    resultExportableFiles: "Exportable files for handoff",
    resultStackFlexibility: "Multiple front-end stack targets",
    whyPeopleTrustThis: "Why people trust this",
    whyPeopleTrustThisTitle: "Proof matters more than promises.",
    trustTransparentInputs: "Transparent ways to start",
    trustTransparentInputsDescription:
      "Users can begin from screenshots, URLs, text prompts, recordings, or imported code instead of being forced into a single workflow.",
    trustMultipleWaysToStart: "Useful before a full rebuild",
    trustMultipleWaysToStartDescription:
      "It works well for first drafts, redesign exploration, competitor teardowns, and internal mockups where speed matters more than perfect polish.",
    trustKeepEditing: "You can keep editing after generation",
    trustKeepEditingDescription:
      "The product does not trap users in a one-shot result. It opens into preview, follow-up edits, and repeated iteration so progress keeps compounding.",
    trustShipFaster: "Closer to something you can actually ship",
    trustShipFasterDescription:
      "The result is closer to a usable front-end draft that teams can review internally, hand off, or keep refining toward launch.",
    pricing: "Pricing",
    pricingTitle: "Start free. Upgrade when the workflow sticks.",
    pricingDescription:
      "The free plan should answer one question quickly: does this save your team time? Paid plans make sense when you start using it repeatedly.",
    pricingFreePlan: "Free",
    pricingFreePrice: "$0",
    pricingFreeDescription:
      "Best for trying the workflow, checking screenshot quality, and deciding whether the generated draft is useful for your use case.",
    pricingFreeFeature1: "A small number of free generations",
    pricingFreeFeature2: "Saved projects after sign-in",
    pricingFreeFeature3: "Access to the full core flow",
    pricingFreeCta: "Try for free",
    pricingProPlan: "Pro",
    pricingProPrice: "$29/mo",
    pricingProDescription:
      "Best for solo builders and designers who already know the workflow saves time and want enough volume to use it every week.",
    pricingProFeature1: "More monthly generations",
    pricingProFeature2: "Room for repeated iteration",
    pricingProFeature3: "Best fit for personal product work",
    pricingProCta: "Choose Pro",
    pricingTeamPlan: "Team",
    pricingTeamPrice: "Custom",
    pricingTeamDescription:
      "Best for agencies or product teams that want shared usage, higher volume, and a clearer rollout path inside the team.",
    pricingTeamFeature1: "Shared team usage",
    pricingTeamFeature2: "Higher-volume workflows",
    pricingTeamFeature3: "Fits agency or product teams",
    pricingTeamCta: "Talk to sales",
    faq: "FAQ",
    faqTitle: "Questions that matter before you commit time",
    faqDescription:
      "These are the questions most people ask before they decide whether the workflow is worth trying seriously.",
    faq1Question: "Can this generate production-ready code?",
    faq1Answer:
      "It generates a strong front-end starting point that is meant to be previewed, edited, and refined. The better your reference and instructions, the closer the first pass gets.",
    faq2Question: "What kinds of inputs work best?",
    faq2Answer:
      "Clean UI screenshots, landing pages, app screens, wireframes, and short product recordings work best. You can also start from a URL or a text description.",
    faq3Question: "Can I keep editing the generated result?",
    faq3Answer:
      "Yes. After generation, you can iterate with follow-up instructions, compare variants, and keep adjusting the output instead of starting over.",
    faq4Question: "Who is this best suited for?",
    faq4Answer:
      "It is especially useful for founders, designers, agencies, and product teams who want to move from a visual reference to a working front-end draft quickly.",
    finalCtaEyebrow: "Ready to try it",
    finalCtaTitle: "Start with a screenshot. Leave with code you can keep shaping.",
    finalCtaDescription:
      "Try the core workflow without guessing what happens next.",
    footerDescription:
      "Image to Code helps teams move from screenshots, mockups, and references to editable front-end code faster.",
    footerProduct: "Product",
    footerResources: "Resources",
    footerCompany: "Company",
    account: "Account",
    accountDescription:
      "Sign in to save projects and track free generation usage.",
    logOut: "Log out",
    signIn: "Sign in",
    signingIn: "Signing in...",
    emailPlaceholder: "you@example.com",
    freeGenerationsLeft: "{remaining}/{limit} free generations left",
    projects: "Projects",
    noSavedProjects:
      "No saved projects yet. Generate or import something and it will autosave here.",
    updatedAt: "Updated {date}",
    delete: "Delete",
    uploadTab: "Upload",
    urlTab: "URL",
    textTab: "Text",
    importTab: "Import",
    outputStack: "Output stack",
    selectStack: "Select a stack",
    noDesignSystem: "No design system",
    designSystem: "Design system:",
    addDesignSystem: "Add a design system",
    addDesignSystemAction: "+ Add design system",
    newDesignSystem: "+ New design system…",
    manageDesignSystems: "Manage design systems…",
    designSystemTitle: "Design system: {name}",
    createDesignSystemError: "Could not create design system.",
    dropUiScreenshot: "Drop your UI screenshot here",
    uploadLimitDescription:
      "Upload up to {count} screenshots or one short product video.",
    uploadSupportTypes:
      "Supports PNG, JPG, MP4, MOV, WebM (max 20MB each, 30s video)",
    browseFiles: "Browse files",
    uploadedScreenshots: "Uploaded Screenshots ({count}/{max})",
    clearAll: "Clear all",
    limitReached: "Limit reached",
    remaining: "{count} remaining",
    dragToAddMore: "Drag and drop to add more screenshots",
    dropToAdd: "Drop to add",
    addInstructionsOptional: "Add instructions (optional)",
    uploadPromptPlaceholder:
      "Describe details like spacing, components, colors, interactions, or mobile behavior...",
    generateCode: "Generate Code",
    pressEnterToGenerate: "Press Enter to generate",
    or: "or",
    recordScreen: "Record Screen",
    recording: "Recording...",
    finishRecording: "Finish Recording",
    recordingCaptured: "Screen Recording Captured.",
    reRecord: "Re-record",
    generate: "Generate",
    uploadEitherVideoOrScreenshots:
      "Upload either one video or up to {count} screenshots (not both).",
    removeVideoToAddImages: "Remove the video to add images.",
    screenshotLimitReached:
      "You’ve reached the limit of {count} screenshots. Remove one to add another.",
    screenshotOnlySomeAdded:
      "Only {count} more screenshot{suffix} will be added to stay within the {max}-screenshot limit.",
    readFilesError: "Error reading files.",
    someFilesRejected: "Some files were rejected.",
    fileTooLarge: "One or more files exceed the 20MB limit.",
    unsupportedFileType:
      "Unsupported file type. Use PNG, JPG, MP4, MOV, or WebM.",
    uploadUpToScreenshots: "You can upload up to {count} screenshots.",
    removeVideo: "Remove video",
    previewScreenshot: "Preview screenshot {count}",
    thumbnail: "Thumbnail {count}",
    removeScreenshot: "Remove screenshot {count}",
    addMoreScreenshots: "Add more screenshots",
    urlTitle: "Screenshot from URL",
    screenshotApiKeyMissing:
      "Please add a ScreenshotOne API key in Settings. You can also upload screenshots directly in the Upload tab.",
    enterUrl: "Please enter a URL",
    fileUrlNotSupported:
      "file:// URLs can't be screenshot. If you're trying to import a local file, please use the Import tab.",
    figmaNotSupported:
      "Direct Figma import is not supported. Take a screenshot of your design or export the artboards as images, then use the Upload tab.",
    captureScreenshotFailed:
      "Failed to capture screenshot. Check console for details.",
    figmaHint:
      "Direct Figma import is not supported. Take a screenshot of your design or export the artboards as images, then use the Upload tab.",
    capturing: "Capturing...",
    captureAndGenerate: "Capture & Generate",
    requiresScreenshotOneKey: "Requires ScreenshotOne API key.",
    textTitle: "Generate from Text",
    describeUiPlaceholder: "Describe the UI you want to create...",
    tryExample: "Try an example:",
    pressCmdCtrlEnterGenerate: "Press Cmd/Ctrl + Enter to generate",
    enterDescription: "Please enter a description",
    textExample1:
      "An ecommerce homepage for eco-friendly skincare with product grid, reviews, and newsletter signup",
    textExample2:
      "A portfolio site for a product designer with case studies, process steps, and contact",
    textExample3:
      "A mobile fitness app dashboard with workout plan, progress ring, and quick-start buttons",
    textExample4:
      "A music streaming app with now-playing, recommended playlists, and recent listens",
    importTitle: "Import Existing Code",
    pasteHtmlPlaceholder:
      "Paste your HTML code here or drag/drop a .html file...",
    stackLabel: "Stack:",
    importCode: "Import Code",
    pressCmdCtrlEnterImport: "Press Cmd/Ctrl + Enter to import",
    pasteSomeCode: "Please paste in some code",
    selectStackError: "Please select your stack",
    editor: "Editor",
    versions: "Versions",
    newProject: "New",
    startNewProject: "Start a new project",
    preview: "Preview",
    chat: "Chat",
    websiteBuilderFromScreenshots: "Website builder from screenshots",
    launchGenerator: "Launch Generator",
    noCurrentVersion:
      "No current version set. Please contact support via chat or Github.",
    onlyFirstVersionRegenerate: "Only the first version can be regenerated.",
    noUpdateInstructions:
      "Please include some instructions for AI on what to update.",
    noCurrentVersionIssue:
      "No current version set. Contact support or open a Github issue.",
    backToEditor: "Back to editor",
    onboardingNote:
      "To use Screenshot to Code, buy some credits (100 generations for $36) or use your own OpenAI API key with GPT4 vision access. Follow these instructions to get yourself a key, and paste it in the Settings dialog (gear icon above). Your key is only stored in your browser. Never stored on our servers.",
    onboardingBuyCredits: "buy some credits (100 generations for $36)",
    onboardingFollowInstructions:
      "Follow these instructions to get yourself a key.",
    desktop: "Desktop",
    mobile: "Mobile",
    code: "Code",
    scaleDownToFit: "Scale down to fit the screen",
    originalSize: "View at original size (100%)",
    openInNewTab: "Open in New Tab",
    previousVersion: "Previous version",
    viewAllVersions: "View all versions",
    versionNumber: "Version {count}",
    latest: "Latest",
    nextVersion: "Next version",
    downloadCode: "Download Code",
    refreshPreview: "Refresh Preview",
    exitSelectionMode: "Exit selection mode",
    selectElementToTarget:
      "Select an element in the preview to target your edit",
    exitSelectMode: "Exit select mode",
    selectAndEdit: "Select & edit",
    importedExistingCode: "Imported existing code.",
    createSummary: "Create",
    updatedWithReferenceImages:
      "Updated with {count} reference images.",
    updatedWithOneReferenceImage: "Updated with one reference image.",
    updatedCode: "Updated code.",
    referenceImageLimitReached:
      "You’ve reached the limit of {count} reference images. Remove one to add another.",
    referenceOnlySomeAdded:
      "Only {count} more image{suffix} will be added to stay within the {max}-image limit.",
    selected: "Selected:",
    less: "less",
    more: "more",
    referenceImage: "Reference {count}",
    working: "Working...",
    timeSoFar: "Time so far {time}",
    slowGeminiNotice:
      "Slow, high quality model. May take 5-10 mins on some images/videos.",
    viewingOlderVersion: "You are viewing an older version",
    allVersions: "All versions",
    viewLatest: "View latest",
    retry: "Retry",
    cancelAllGenerations: "Cancel All Generations",
    optionFailedBecause: "This option failed to generate because",
    showLess: "Show less",
    showMore: "Show more",
    retryCreateRequest: "Click Retry to run the create request again.",
    switchOptionForUpdates: "Switch to another option above to make updates.",
    clickElementToEditIt: "Click an element to edit it",
    exit: "Exit",
    updatePromptForElement:
      "Describe changes for the selected <{tag}> element...",
    tellAiWhatToChange: "Tell the AI what to change...",
    send: "Send",
    dropImagesHere: "Drop images here",
    addImages: "Add images",
    readImageFilesError: "Error reading image files",
    addImageLimitTitle: "Limit reached ({count})",
    option: "Option {count}",
    createType: "Create",
    editType: "Edit",
    fromVersion: "from v{count}",
    target: "Target:",
    projectLoaded: "Project loaded",
    projectDeleted: "Project deleted",
    couldNotLoadProject: "Could not load project.",
    couldNotDeleteProject: "Could not delete project.",
    pleaseEnterEmail: "Please enter your email.",
    signedIn: "Signed in",
    couldNotSignIn: "Could not sign in.",
    signedOut: "Signed out",
    couldNotSignOut: "Could not sign out.",
    couldNotStartRecording: "Could not start screen recording",
    recordingMissing: "Screen recording does not exist. Please try again.",
    generationError:
      "Error generating code. Check the Developer Console AND the backend logs for details. Feel free to open a Github issue.",
    generationCancelled: "Code generation cancelled",
  },
  zh: {
    language: "语言",
    settings: "设置",
    theme: "主题",
    appTheme: "界面主题",
    appThemeDescription: "默认跟随系统，也可手动切换浅色或深色",
    codeEditorTheme: "代码编辑器主题",
    codeEditorThemeDescription: "切换后需要刷新页面生效",
    system: "跟随系统",
    light: "浅色",
    dark: "深色",
    apiKeys: "API 密钥",
    openAiApiKey: "OpenAI API Key",
    browserStorageDescription:
      "仅保存在你的浏览器中，不会存到服务器上，并会覆盖 .env 配置。",
    openAiBaseUrlOptional: "OpenAI Base URL（可选）",
    openAiBaseUrlDescription: "如果你不想使用默认地址，可以替换为代理 URL。",
    anthropicApiKey: "Anthropic API Key",
    geminiApiKey: "Gemini API Key",
    imageGeneration: "图片生成",
    placeholderImages: "占位图片",
    placeholderImagesDescription: "开启后更有趣；如果你想省钱，可以关闭。",
    screenshotByUrl: "URL 截图",
    screenshotByUrlDescription:
      "如果你想直接输入 URL，而不是自己先截图，请添加 ScreenshotOne API Key。",
    getFreeScreenshots: "每月免费 100 次截图。",
    screenshotOneApiKey: "ScreenshotOne API Key",
    imageToCodeWebsite: "Visual to Code",
    turnScreenshotsIntoCode: "把任何视觉输入变成前端代码。",
    heroDescription:
      "从截图、Figma、URL、视频和设计稿出发，几秒内生成可继续编辑的生产级前端代码。",
    startConverting: "开始转换",
    seeHowItWorks: "查看工作方式",
    navProduct: "产品",
    navExamples: "案例",
    navPricing: "价格",
    navFaq: "FAQ",
    socialProofTitle: "这些工作流受到设计与产品团队关注",
    supportedInputs: "支持输入",
    supportedInputsValue: "截图、URL、文本",
    buildTargets: "输出目标",
    buildTargetsValue: "React、HTML、Vue",
    bestFor: "适用场景",
    bestForValue: "MVP、仿站、改版",
    waysToStart: "开始方式",
    waysToStartTitle: "从你已经拥有的素材开始",
    waysToStartDescription:
      "你可以上传参考图、抓取在线页面、描述想法，或者直接导入已有代码继续打磨。",
    startModeUploadDescription:
      "上传截图、线框图或短录屏，让第一稿从具体视觉参考出发，而不是空想生成。",
    startModeUrlDescription:
      "输入在线 URL，适合做结构复刻、竞品拆解或快速提炼页面模式。",
    startModeTextDescription:
      "如果想法还比较粗糙，可以直接从提示词开始，让布局、内容和层级一起长出来。",
    startModeImportDescription:
      "把现有代码贴进来，适合做升级、扩展或局部重做，而不只是从零生成。",
    instantPrototypeFlow: "快速原型流程",
    liveAi: "实时 AI",
    uploadScreenshot: "上传截图",
    uploadScreenshotDescription: "支持落地页、仪表盘、移动端界面或线框图。",
    chooseOutputStack: "选择输出技术栈",
    chooseOutputStackDescription:
      "支持 HTML、React、Vue、Tailwind、Bootstrap 等。",
    refineUntilItMatches: "持续迭代到满意为止",
    refineUntilItMatchesDescription:
      "通过追加提示词持续修改，并导出整洁的前端代码。",
    coreProduct: "核心能力",
    imageToCodeReady: "从图片到代码，直接给用户使用",
    coreProductDescription:
      "你可以从截图、网页 URL 或文本描述开始，生成结果会立即在实时预览和代码编辑器中打开。",
    multiImageInput: "多图输入",
    livePreview: "实时预览",
    editableOutput: "可编辑输出",
    exportReady: "可直接导出",
    fastFirstDraft: "快速首稿",
    fastFirstDraftDescription:
      "只用一张截图就能得到可运行的前端初稿，不必从零重搭布局。",
    builtForIteration: "为迭代而生",
    builtForIterationDescription:
      "生成后还能继续用追问和对比预览不断打磨结果。",
    deploymentFriendly: "适合部署",
    deploymentFriendlyDescription:
      "可以把它作为托管产品的前门，再接入你自己的域名、API Key 和部署流水线。",
    builtForRealWork: "面向真实工作流",
    workflowTitle: "从参考图到可运行前端，中间尽量不断档",
    workflowDescription:
      "真正有价值的不只是第一次生成，而是你能从素材快速进入可预览的前端初稿，再继续编辑、继续迭代，始终待在一个连续工作流里。",
    workflowMapEyebrow: "工作流地图",
    workflowMapTitle: "把想法变成迭代闭环，而不是一次性输出",
    workflowMapDescription:
      "从参考素材快速进入可预览的前端初稿，再在这个基础上持续迭代，而不是反复从头开始。",
    localWorkspaceTitle: "就算是本地工作区，也值得拥有成熟的网站体验",
    localWorkspaceDescription:
      "即使所有能力都在本地运行，团队仍然需要一个足够灵活、足够深入、也足够可信的流程，把草稿推进成可用的前端结果。",
    beforeAfter: "前后对比",
    beforeAfterTitle: "不只讲能力，也要展示变化结果",
    beforeAfterDescription:
      "通过这些案例，访客能更直观理解参考图进入流程之后，最终通常会产出什么样的可编辑前端草稿。",
    beforeReference: "之前 · 参考图",
    afterOutput: "之后 · 生成结果",
    showcaseLandingPage: "营销落地页",
    showcaseLandingPageSource:
      "一张成熟 Hero 区截图，包含功能模块、价格预告和强 CTA。",
    showcaseLandingPageResult:
      "生成出可复用的落地页初稿，包含清晰的 Hero、转化导向区块、稳定留白节奏，并且便于继续迭代。",
    showcaseLandingPageHighlight1: "可复用 Hero 与 CTA",
    showcaseLandingPageHighlight2: "功能区与价格区",
    showcaseLandingPageHighlight3: "可编辑营销页结构",
    showcaseDashboard: "SaaS 仪表盘",
    showcaseDashboardSource:
      "一个包含统计卡片、筛选区、表格视图和导航结构的产品后台参考图。",
    showcaseDashboardResult:
      "生成后台骨架，包含统计面板、筛选控件、表格区域和更清晰的组件边界，便于继续做产品化迭代。",
    showcaseDashboardHighlight1: "统计卡片与筛选区",
    showcaseDashboardHighlight2: "响应式表格布局",
    showcaseDashboardHighlight3: "侧边栏与内容骨架",
    showcaseMobileApp: "移动端应用界面",
    showcaseMobileAppSource:
      "一组包含引导页、卡片、底部导航和进度元素的移动端界面参考。",
    showcaseMobileAppResult:
      "生成移动优先的代码草稿，保留页面流转、卡片层级和导航结构，让后续调整流程与样式更轻松。",
    showcaseMobileAppHighlight1: "逐屏流程结构",
    showcaseMobileAppHighlight2: "底部导航状态",
    showcaseMobileAppHighlight3: "卡片与进度组件",
    whoThisIsFor: "这个产品适合谁",
    whoThisIsForDescription:
      "下面这些团队，通常最容易从截图、参考图和早期 UI 想法里快速拿到有用的前端初稿。",
    useCaseFounders: "创业团队",
    useCaseFoundersTitle: "不用每个页面都重写，也能更快做出 MVP",
    useCaseFoundersDescription:
      "你可以用截图、参考图和粗略草图更快做出可点击的产品初稿，让工程时间集中在真正的业务逻辑上。",
    useCaseDesigners: "设计协作",
    useCaseDesignersTitle: "缩短设计稿和可用前端之间的距离",
    useCaseDesignersDescription:
      "把成熟的 UI 参考直接转成可编辑代码，便于评审、继续迭代，以及更顺畅地交付给开发。",
    useCaseAgencies: "客户交付",
    useCaseAgenciesTitle: "更快完成落地页、改版和视觉实验",
    useCaseAgenciesDescription:
      "基于截图或竞品参考快速生成第一稿，再继续打磨，用于活动页、演示稿或客户预览都更高效。",
    testimonials: "用户评价",
    testimonialsTitle: "用户在决定尝试之前，通常想看到这些反馈",
    testimonialsDescription:
      "当访客能想象“和我类似的人已经用过并受益”，他们会更容易迈出第一次尝试。",
    testimonialBridgeEyebrow: "真实使用信号",
    testimonialBridgeTitle: "这些反馈说明，它的价值不只停在第一版生成",
    testimonial1Quote:
      "我们用截图参考图，从想法走到能跑的落地页初稿，只花了一个下午，而不是来回拉扯一整周。",
    testimonial1Author: "Maya Chen",
    testimonial1Role: "B2B SaaS 创始人",
    testimonial2Quote:
      "真正有价值的不是只生成一次，而是能继续在结果上反复迭代，直到前端版本足够接近内部可交付标准。",
    testimonial2Author: "Jordan Lee",
    testimonial2Role: "产品设计师",
    testimonial3Quote:
      "对于客户提案和改版预演，这让我们能更快拿出第一版，而且结果仍然可编辑、可展示。",
    testimonial3Author: "Alicia Ramos",
    testimonial3Role: "创意代理团队负责人",
    whatYouGet: "你能得到什么",
    whatYouGetTitle: "不只是演示，而是可继续推进的前端初稿。",
    whatYouGetDescription:
      "更成熟的 image-to-code 工作流，不应该停在“生成一下”。它还要帮助你预览、修改，并继续向可交付结果推进。",
    resultResponsiveLayouts: "响应式布局骨架",
    resultComponentStructure: "更清晰的页面与组件结构",
    resultEditableCode: "生成后仍可继续编辑",
    resultFastIteration: "可通过提示词持续迭代",
    resultExportableFiles: "支持导出用于交付",
    resultStackFlexibility: "支持多种前端技术栈",
    whyPeopleTrustThis: "为什么更值得信任",
    whyPeopleTrustThisTitle: "真正有说服力的是证据，而不只是口号。",
    trustTransparentInputs: "开始方式足够透明",
    trustTransparentInputsDescription:
      "用户可以从截图、URL、文本、录屏或现有代码开始，而不是被限制在单一工作流里。",
    trustMultipleWaysToStart: "不只适合完整重建",
    trustMultipleWaysToStartDescription:
      "它也适合首稿生成、改版探索、竞品拆解和内部原型这些更强调速度而不是完美还原的场景。",
    trustKeepEditing: "生成之后还能继续改",
    trustKeepEditingDescription:
      "产品不会把用户困在“一次性结果”里，而是继续提供预览、后续修改和反复迭代能力。",
    trustShipFaster: "更接近真正可交付的结果",
    trustShipFasterDescription:
      "结果会更接近可评审、可交接、也可继续推进上线的前端草稿，而不只是一次演示。",
    pricing: "价格方案",
    pricingTitle: "先免费开始，确认有价值再升级。",
    pricingDescription:
      "免费版最重要的作用，是帮你快速判断这个流程到底能不能给团队省时间。只有开始高频使用时，付费才真正有意义。",
    pricingFreePlan: "免费版",
    pricingFreePrice: "¥0",
    pricingFreeDescription:
      "适合先体验工作流、检查截图质量，并判断这类前端初稿是否真的适合你的场景。",
    pricingFreeFeature1: "少量免费生成次数",
    pricingFreeFeature2: "登录后可保存项目",
    pricingFreeFeature3: "可体验完整核心流程",
    pricingFreeCta: "免费开始",
    pricingProPlan: "专业版",
    pricingProPrice: "¥199/月",
    pricingProDescription:
      "适合已经确认这套流程能省时间的独立开发者和设计师，让它可以进入每周都会用的工作节奏。",
    pricingProFeature1: "更多每月生成额度",
    pricingProFeature2: "更适合反复迭代修改",
    pricingProFeature3: "适合个人产品工作流",
    pricingProCta: "选择专业版",
    pricingTeamPlan: "团队版",
    pricingTeamPrice: "定制",
    pricingTeamDescription:
      "适合代理团队或产品团队，需要共享使用、更高用量，以及更清晰的内部推广路径。",
    pricingTeamFeature1: "支持团队共享使用",
    pricingTeamFeature2: "支持更高频流程",
    pricingTeamFeature3: "适合代理或产品团队",
    pricingTeamCta: "联系销售",
    faq: "常见问题",
    faqTitle: "这些问题，值得在投入时间前先问清楚",
    faqDescription:
      "大多数人会先问清楚质量、工作流和输出边界，再决定要不要认真把它接进自己的流程。",
    faq1Question: "它能直接生成可上线的代码吗？",
    faq1Answer:
      "它会生成一个很强的前端起点，但最佳使用方式仍然是先预览、再修改、再迭代。参考图和指令越清晰，首稿越接近可用结果。",
    faq2Question: "什么类型的输入效果最好？",
    faq2Answer:
      "清晰的 UI 截图、落地页、App 页面、线框图和简短的产品录屏通常效果最好。你也可以从 URL 或文本描述开始。",
    faq3Question: "生成之后还能继续编辑吗？",
    faq3Answer:
      "可以。生成完成后，你还可以继续通过后续指令迭代、比较多个候选版本，并持续修改，而不是重新来过。",
    faq4Question: "它最适合哪些人使用？",
    faq4Answer:
      "尤其适合创业者、设计师、代理团队和产品团队，他们希望快速从视觉参考进入一个可运行的前端初稿。",
    finalCtaEyebrow: "准备开始了吗",
    finalCtaTitle: "从一张截图开始，得到一份你可以继续打磨的代码。",
    finalCtaDescription:
      "直接进入核心流程，不用猜接下来会发生什么。",
    footerDescription:
      "Image to Code 帮助团队更快从截图、设计稿和参考图进入可编辑的前端代码阶段。",
    footerProduct: "产品",
    footerResources: "资源",
    footerCompany: "公司",
    account: "账号",
    accountDescription: "登录后可以保存项目并查看免费生成额度。",
    logOut: "退出登录",
    signIn: "登录",
    signingIn: "登录中...",
    emailPlaceholder: "you@example.com",
    freeGenerationsLeft: "剩余免费生成次数：{remaining}/{limit}",
    projects: "项目",
    noSavedProjects: "还没有已保存的项目。只要生成或导入内容，就会自动保存在这里。",
    updatedAt: "更新于 {date}",
    delete: "删除",
    uploadTab: "上传",
    urlTab: "URL",
    textTab: "文本",
    importTab: "导入",
    outputStack: "输出技术栈",
    selectStack: "选择技术栈",
    noDesignSystem: "不使用设计系统",
    designSystem: "设计系统：",
    addDesignSystem: "添加设计系统",
    addDesignSystemAction: "+ 添加设计系统",
    newDesignSystem: "+ 新建设计系统…",
    manageDesignSystems: "管理设计系统…",
    designSystemTitle: "设计系统：{name}",
    createDesignSystemError: "创建设计系统失败。",
    dropUiScreenshot: "把你的 UI 截图拖到这里",
    uploadLimitDescription: "最多上传 {count} 张截图，或 1 段简短产品视频。",
    uploadSupportTypes:
      "支持 PNG、JPG、MP4、MOV、WebM（每个文件最大 20MB，视频 30 秒内）",
    browseFiles: "选择文件",
    uploadedScreenshots: "已上传截图（{count}/{max}）",
    clearAll: "清空",
    limitReached: "已达上限",
    remaining: "还可添加 {count} 个",
    dragToAddMore: "拖拽可继续添加截图",
    dropToAdd: "松手即可添加",
    addInstructionsOptional: "添加补充说明（可选）",
    uploadPromptPlaceholder:
      "描述你关心的间距、组件、颜色、交互或移动端行为...",
    generateCode: "生成代码",
    pressEnterToGenerate: "按 Enter 生成",
    or: "或",
    recordScreen: "录制屏幕",
    recording: "录制中...",
    finishRecording: "结束录制",
    recordingCaptured: "已捕获屏幕录制。",
    reRecord: "重新录制",
    generate: "生成",
    uploadEitherVideoOrScreenshots:
      "请上传 1 个视频，或者最多 {count} 张截图，二者不能混用。",
    removeVideoToAddImages: "请先移除视频再添加图片。",
    screenshotLimitReached: "已达到 {count} 张截图上限，删除后才能继续添加。",
    screenshotOnlySomeAdded:
      "为了不超过 {max} 张截图上限，本次只会添加另外 {count} 张截图。",
    readFilesError: "读取文件失败。",
    someFilesRejected: "有些文件未通过校验。",
    fileTooLarge: "一个或多个文件超过 20MB 限制。",
    unsupportedFileType: "不支持的文件类型，请使用 PNG、JPG、MP4、MOV 或 WebM。",
    uploadUpToScreenshots: "最多可上传 {count} 张截图。",
    removeVideo: "移除视频",
    previewScreenshot: "预览截图 {count}",
    thumbnail: "缩略图 {count}",
    removeScreenshot: "删除截图 {count}",
    addMoreScreenshots: "继续添加截图",
    urlTitle: "从 URL 截图",
    screenshotApiKeyMissing:
      "请先在设置中添加 ScreenshotOne API Key。你也可以直接到上传页签上传截图。",
    enterUrl: "请输入 URL",
    fileUrlNotSupported:
      "不支持对 file:// URL 截图。如果你想导入本地文件，请使用导入页签。",
    figmaNotSupported:
      "暂不支持直接导入 Figma。请先对设计稿截图，或导出画板为图片后使用上传页签。",
    captureScreenshotFailed: "截图失败，请查看控制台获取详细信息。",
    figmaHint:
      "暂不支持直接导入 Figma。请先对设计稿截图，或导出画板为图片后使用上传页签。",
    capturing: "截图中...",
    captureAndGenerate: "截图并生成",
    requiresScreenshotOneKey: "需要 ScreenshotOne API Key。",
    textTitle: "从文本生成",
    describeUiPlaceholder: "描述你想创建的 UI...",
    tryExample: "试试这些示例：",
    pressCmdCtrlEnterGenerate: "按 Cmd/Ctrl + Enter 生成",
    enterDescription: "请输入描述",
    textExample1:
      "一个环保护肤品牌的电商首页，包含商品网格、评价和订阅表单",
    textExample2: "一个产品设计师的作品集网站，包含案例、流程和联系方式",
    textExample3: "一个移动健身应用仪表盘，包含训练计划、进度环和快捷按钮",
    textExample4: "一个音乐流媒体应用，包含当前播放、推荐歌单和最近收听",
    importTitle: "导入现有代码",
    pasteHtmlPlaceholder: "粘贴 HTML 代码，或拖拽一个 .html 文件到这里...",
    stackLabel: "技术栈：",
    importCode: "导入代码",
    pressCmdCtrlEnterImport: "按 Cmd/Ctrl + Enter 导入",
    pasteSomeCode: "请粘贴一些代码",
    selectStackError: "请选择技术栈",
    editor: "编辑器",
    versions: "版本",
    newProject: "新建",
    startNewProject: "开始一个新项目",
    preview: "预览",
    chat: "对话",
    websiteBuilderFromScreenshots: "从截图生成网站",
    launchGenerator: "启动生成器",
    noCurrentVersion: "当前没有可用版本，请通过聊天或 Github 联系支持。",
    onlyFirstVersionRegenerate: "只有第一个版本可以重新生成。",
    noUpdateInstructions: "请告诉 AI 你希望更新什么。",
    noCurrentVersionIssue: "当前没有可用版本，请联系支持或提交 Github issue。",
    backToEditor: "返回编辑器",
    onboardingNote:
      "要使用 Screenshot to Code，你可以购买额度（100 次生成 36 美元），或者使用你自己的、已开通 GPT4 vision 的 OpenAI API Key。请按照这些说明获取 Key，然后粘贴到设置对话框（上方齿轮图标）中。你的 Key 仅保存在浏览器中，不会存到我们的服务器。",
    onboardingBuyCredits: "购买额度（100 次生成 36 美元）",
    onboardingFollowInstructions: "按这些说明获取你的 Key。",
    desktop: "桌面",
    mobile: "手机",
    code: "代码",
    scaleDownToFit: "缩放以适配屏幕",
    originalSize: "按原始尺寸查看（100%）",
    openInNewTab: "新标签页打开",
    previousVersion: "上一版本",
    viewAllVersions: "查看所有版本",
    versionNumber: "版本 {count}",
    latest: "最新",
    nextVersion: "下一版本",
    downloadCode: "下载代码",
    refreshPreview: "刷新预览",
    exitSelectionMode: "退出选择模式",
    selectElementToTarget: "在预览中选择元素，精准修改",
    exitSelectMode: "退出选择模式",
    selectAndEdit: "选择并编辑",
    importedExistingCode: "已导入现有代码。",
    createSummary: "创建",
    updatedWithReferenceImages: "已使用 {count} 张参考图更新。",
    updatedWithOneReferenceImage: "已使用 1 张参考图更新。",
    updatedCode: "已更新代码。",
    referenceImageLimitReached:
      "已达到 {count} 张参考图上限，删除后才能继续添加。",
    referenceOnlySomeAdded:
      "为了不超过 {max} 张图片上限，本次只会额外添加 {count} 张图片。",
    selected: "已选中：",
    less: "收起",
    more: "展开",
    referenceImage: "参考图 {count}",
    working: "生成中...",
    timeSoFar: "已用时 {time}",
    slowGeminiNotice: "当前模型较慢但质量更高，某些图片或视频可能需要 5 到 10 分钟。",
    viewingOlderVersion: "你正在查看旧版本",
    allVersions: "所有版本",
    viewLatest: "查看最新版本",
    retry: "重试",
    cancelAllGenerations: "取消全部生成",
    optionFailedBecause: "这个方案生成失败，原因是",
    showLess: "收起",
    showMore: "展开",
    retryCreateRequest: "点击重试可再次执行创建请求。",
    switchOptionForUpdates: "请切换到上方其他方案后再继续修改。",
    clickElementToEditIt: "点击一个元素来编辑它",
    exit: "退出",
    updatePromptForElement: "描述对选中 <{tag}> 元素的修改...",
    tellAiWhatToChange: "告诉 AI 你想改什么...",
    send: "发送",
    dropImagesHere: "把图片拖到这里",
    addImages: "添加图片",
    readImageFilesError: "读取图片文件失败",
    addImageLimitTitle: "已达上限（{count}）",
    option: "方案 {count}",
    createType: "创建",
    editType: "编辑",
    fromVersion: "来自 v{count}",
    target: "目标：",
    projectLoaded: "项目已加载",
    projectDeleted: "项目已删除",
    couldNotLoadProject: "加载项目失败。",
    couldNotDeleteProject: "删除项目失败。",
    pleaseEnterEmail: "请输入邮箱。",
    signedIn: "已登录",
    couldNotSignIn: "登录失败。",
    signedOut: "已退出登录",
    couldNotSignOut: "退出登录失败。",
    couldNotStartRecording: "无法开始录屏",
    recordingMissing: "录屏不存在，请重试。",
    generationError:
      "生成代码时出错。请查看开发者控制台和后端日志，也欢迎提交 Github issue。",
    generationCancelled: "代码生成已取消",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
type TranslationVariables = Record<string, number | string>;

function interpolate(
  template: string,
  variables: TranslationVariables = {}
): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    template
  );
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const rawValue = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!rawValue) {
    return "en";
  }

  try {
    const parsed = JSON.parse(rawValue) as Language;
    return parsed === "zh" ? "zh" : "en";
  } catch {
    return rawValue === "zh" ? "zh" : "en";
  }
}

export function translate(
  language: Language,
  key: TranslationKey,
  variables?: TranslationVariables
): string {
  return interpolate(translations[language][key], variables);
}

export function translateCurrent(
  key: TranslationKey,
  variables?: TranslationVariables
): string {
  return translate(getStoredLanguage(), key, variables);
}
