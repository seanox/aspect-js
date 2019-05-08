if (navigator.userAgentType === undefined) {
    navigator.userAgentType = navigator.userAgent.match(/edge/i);
    if (!navigator.userAgentType)
        navigator.userAgentType = navigator.userAgent.match(/chrome/i);
    if (!navigator.userAgentType)
        navigator.userAgentType = navigator.userAgent.match(/safari/i);
    if (!navigator.userAgentType)
        navigator.userAgentType = navigator.userAgent.match(/firefox/i);
    if (navigator.userAgentType)
        navigator.userAgentType = String(navigator.userAgentType).toLowerCase();
};