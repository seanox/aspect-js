# Manual
Machine translation with [DeepL](https://deepl.com).

## Table Of Contents 
- [Motivation](#motivation)
- [Introduction](#introduction)
- [Expression Language](#expression-language)
- [Markup](#markup)
- [Scripting](#scripting)
- [DataSource](#datasource)
- [Resource Bundle](#resource-bundle-i18nl10n)
- [Model View Controller](#model-view-controller)
- [Routing](#routing)
- [Composite](#composite)
- [Reactivity Rendering](#reactivity-rendering)
- [API Extensions](#api-extensions)
- [Events](#events)
- [Test](#test)
- [Development](#development)

### Motivation
- [Motivation](motivation.md#motivation)

### Introduction
- [Introduction](introduction.md#introduction)

### Expression Language
- [Expression Language](expression.md#expression-language)
  - [Elements](expression.md#elements)
    - [Text](expression.md#Text)
    - [Literal](expression.md#literal)
    - [Keyword](expression.md#keyword)
    - [Value](expression.md#value)
    - [Method](expression.md#method)
    - [Logic](expression.md#logic)
  - [Expressions](expression.md#expressions)
    - [Value-Expression](expression.md#value-expression)
    - [Method-Expression](expression.md#method-expression)
    - [Element-Expression](expression.md#element-expression)
    - [Variable-Expression](expression.md#variable-expression)
    - [Combination](expression.md#combination)
    - [(?...) tolerate](expression.md#-tolerate)
  - [Supplement](expression.md#supplement)

### Markup
- [Markup](markup.md#markup)
  - [Attributes](markup.md#attributes)
    - [composite](markup.md#composite)
    - [condition](markup.md#condition)
    - [events](markup.md#events)
    - [id](markup.md#id)
    - [import](markup.md#import)
    - [interval](markup.md#interval)
    - [iterate](markup.md#iterate)
    - [message](markup.md#message)
    - [output](markup.md#output)
    - [release](markup.md#release)
    - [render](markup.md#render)
    - [route](markup.md#route)
    - [validate](markup.md#validate)
  - [@-Attributes](markup.md#-attributes)
  - [Expression Language](markup.md#expression-language)
  - [Scripting](markup.md#scripting)
  - [Customizing](markup.md#customizing)
    - [Tag](markup.md#tag)
    - [Selector](markup.md#selector)
    - [Interceptor](markup.md#interceptor)
    - [Parameters](markup.md#parameters)
  - [Hardening](markup.md#hardening)

### Scripting
- [Scripting](scripting.md#scripting)
  - [Embedded Composite-JavaScript](scripting.md#embedded-composite-javascript)
  - [Moduls](scripting.md#moduls)
  - [Macros](scripting.md#macros)
    - [#export](scripting.md#export)
    - [#import](scripting.md#import)
    - [#module](scripting.md#module)
    - [#use](scripting.md#use)
    - [(?...) tolerate](scripting.md#-tolerate)
  - [Debugging](scripting.md#debugging)

### DataSource
- [DataSource](datasource.md#datasource)
  - [Data Storage](datasource.md#data-storage)
  - [Locales](datasource.md#locales)
  - [Locator](datasource.md#locator)
  - [XPath and XPath Functions](datasource.md#xpath-and-xpath-functions)
  - [fetch](datasource.md#fetch)
  - [transform](datasource.md#transform)
  - [collect](datasource.md#collect)
  - [Supplement](datasource.md#supplement)

### Resource Bundle (i18n/l10n)
- [Resource Bundle (i18n/l10n)](message.md#resource-bundle-messagesi18nl10n)

### Model View Controller
- [Model View Controller](mvc.md#model-view-controller)
  - [Model](mvc.md#model)
  - [View](mvc.md#view)
  - [Controller](mvc.md#controller)
  - [View Model Binding](mvc.md#view-model-binding)
    - [Composite](mvc.md#composite)
    - [Binding](mvc.md#binding)
    - [Dock](mvc.md#dock)
    - [Undock](mvc.md#undock)
    - [Synchronization](mvc.md#synchronization)
    - [Validation](mvc.md#validation)
    - [Events](mvc.md#events)

### Routing
- [Routing](routing.md#routing)
  - [Terms](routing.md#terms)
    - [Page](routing.md#page)
    - [View](routing.md#view)
    - [View Flow](routing.md#view-flow)
  - [Navigation](routing.md#navigation)
  - [Permission Concept](routing.md#permission-concept)
  - [Interceptors](routing.md#interceptors)
  - [Paths](routing.md#paths)
    - [Root Path](routing.md#root-path)
    - [Relative Path](routing.md#relative-path)
    - [Absolute Path](routing.md#absolute-path)

### Composite
- [Composite](composite.md#composite)
  - [Module](composite.md#module)
  - [Component](composite.md#component)
  - [Composite](composite.md#composite)
  - [Structure](composite.md#structure)
  - [Resources](composite.md#resources)
  - [Loading](composite.md#loading)
    - [CSS](composite.md#css)
    - [JavaScript](composite.md#javascript)
    - [HTML](composite.md#html)
  - [Common Standard Component](composite.md#common-standard-component)
  - [Namespace](composite.md#namespace)
  - [Supplement](composite.md#supplement)

### Reactivity Rendering
- [Reactivity Rendering](reactive.md#reactivity-rendering)

### API Extensions
- [API Extensions](extension.md#api-extensions)
  - [Namespace](extension.md#namespace)
  - [Element](extension.md#element)
  - [Math](extension.md#math)
  - [Object](extension.md#object)
  - [RegExp](extension.md#regexp)
  - [String](extension.md#string)
  - [window](extension.md#window)
  - [XMLHttpRequest](extension.md#xmlhttprequest)

### Events
- [Events](events.md#events)
  - [Rendering](events.md#rendering)
    - [Composite.EVENT_RENDER_START](events.md#compositeevent_render_start)
    - [Composite.EVENT_RENDER_NEXT](events.md#compositeevent_render_next)
    - [Composite.EVENT_RENDER_END](events.md#compositeevent_render_end)
  - [View Model Binding](events.md#view-model-binding)
    - [Composite.EVENT_MOUNT_START](events.md#compositeevent_mount_start)
    - [Composite.EVENT_MOUNT_NEXT](events.md#compositeevent_mount_next)
    - [Composite.EVENT_MOUNT_END](events.md#compositeevent_mount_end)
  - [Modules](events.md#modules)
    - [Composite.EVENT_MODULE_LOAD](events.md#compositeevent_module_load)
    - [Composite.EVENT_MODULE_DOCK](#compositeevent_module_dock)
    - [Composite.EVENT_MODULE_READY](#compositeevent_module_ready)
    - [Composite.EVENT_MODULE_UNDOCK](#compositeevent_module_undock)
  - [HTTP](events.md#http)
    - [Composite.EVENT_HTTP_START](events.md#compositeevent_http_start)
    - [Composite.EVENT_HTTP_PROGRESS](events.md#compositeevent_http_progress)
    - [Composite.EVENT_HTTP_RECEIVE](events.md#compositeevent_http_receive)
    - [Composite.EVENT_HTTP_LOAD](events.md#compositeevent_http_load)
    - [Composite.EVENT_HTTP_ABORT](events.md#compositeevent_http_abort)
    - [Composite.EVENT_HTTP_TIMEOUT](events.md#compositeevent_http_timeout)
    - [Composite.EVENT_HTTP_ERROR](events.md#compositeevent_http_error)
    - [Composite.EVENT_HTTP_END](events.md#compositeevent_http_end)
  - [Error](events.md#error)
    - [Composite.EVENT_ERROR](events.md#compositeevent_error)

### Test
- [Test](test.md#test)
  - [Task](test.md#task)
    - [name](test.md#name)
    - [test](test.md#test)
    - [timeout](test.md#timeout)
    - [expected](test.md#expected)
    - [ignore](test.md#ignore)
  - [Scenario](test.md#scenario)
  - [Suite](test.md#suite)
  - [Assert](test.md#assert)
    - [assertTrue](test.md#asserttrue)
    - [assertFalse](test.md#assertfalse)
    - [assertEquals](test.md#assertequals)
    - [assertNotEquals](test.md#assertnotequals)
    - [assertSame](test.md#assertsame)
    - [assertNotSame](test.md#assertnotsame)
    - [assertNull](test.md#assertnull)
    - [assertNotNull](test.md#assertnotnull)
    - [assertUndefined](test.md#assertundefined)
    - [assertNotUndefined](test.md#assertnotundefined)
    - [fail](test.md#fail)
  - [Configuration](test.md#configuration)
    - [auto](test.md#auto)
    - [output](test.md#output)
    - [monitor](test.md#monitor)
  - [Output](test.md#output-1)
    - [Forwarding](test.md#forwarding)
    - [Buffer](test.md#buffer)
    - [Listener](test.md#listener)
  - [Monitoring](test.md#monitoring)
  - [Control](test.md#control)
  - [Events](test.md#events)
  - [Extension](test.md#extension)

### Development
- [Development](development.md#development)
  - [Server](development.md#server)
  - [Build](development.md#build)
  - [Test](development.md#test)
    - [Firewall](development.md#firewall)
    - [Browsers for Testing](development.md#browsers-for-testing)
    - [Procedure](development.md#procedure)
  - [Release](development.md#release)
    - [GitHub](development.md#github)
    - [npmjs.com](development.md#npmjscom)
    - [cdn.jsdelivr.net](development.md#cdnjsdelivrnet)
  - [Playground](development.md#playground)
