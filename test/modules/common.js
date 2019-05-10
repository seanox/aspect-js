if (navigator.userAgentType === undefined) {
    navigator.userAgentType = navigator.userAgent.match(/edge/i);
    if (!navigator.userAgentType
            && navigator.userAgent.match(/version.*safari/i))
        navigator.userAgentType = "safari";
    if (!navigator.userAgentType)
        navigator.userAgentType = navigator.userAgent.match(/firefox/i);
    if (!navigator.userAgentType
            && navigator.userAgent.match(/QupZilla/i))
        navigator.userAgentType = "QT";
    if (!navigator.userAgentType)
        navigator.userAgentType = navigator.userAgent.match(/chrome/i);
    if (navigator.userAgentType)
        navigator.userAgentType = String(navigator.userAgentType).toLowerCase();
};