# The Stylesheets Folder

The stylesheets folder contains a default tree and `less` files to ease development of
"Object Oriented CSS" through `elements`, `modules` and `templates`.
These are included by the `site.less` file, which loads dependencies through the `dependencies.less`
file and then loads `elements`, `modules` and `templates`, in that order.

## CSS Elements

CSS elements are the base style of the site.
Usually, these are rules applied to html tags (e.g. `body`, `p` or `h1` tags, without classes).

These element rules will determine the basic style of the site, while leaving out specific uses.

## CSS Modules

CSS modules are interdependent on HTML modules. Files inside this folder should have a corresponding
HTML file in the [html/modules folder](../html/modules) with the same name.

These style rules should be independent of outer context, and should make each module independent of it
as well. A few guidelines to accomplish this are:

* Use classes / Avoid IDs
* If a module looks slightly different depending on the context, add a `modifier` class that changes only that
* Do not hard-code the outer-most tag's positioning (let that be decided by the template)

As with HTML modules, CSS modules could contain elements or other modules, so make sure your rules are flexible
enough to control everything inside the defined class rule, while letting an outer module define your outer
behavior.

## CSS Templates

CSS templates are interdependent with HTML templates. They usually define positioning of modules in each page
context. Think of CSS templates as the wire frame of each page, with no concern on each module's inner content.

### Why isn't there a CSS Layouts folder?

CSS applies to `<body>` content, and usually layouts contain the basic `<html>` + `<head>` structure and leave content to each
`template` to define.

If there's a need to define common outer behavior for all `template`s, this could be done by:

* a `layout.less` file inside the templates folder, or
* a `body` rule inside the elements folder, or
* a specific `class` rule inside `site.less`

Usually the latter is not recommended, as site.less is a very basic file with only includes.



