The website was developed and tested primarily on Ubuntu machines using
Firefox and Chrome. Here are a few important things worth noting, especially
if something appears not to work:

-   The animated globe on the homepage works on the latest versions of firefox
    and chrome, but on older versions of firefox it would not animate, hence
    why we put a placeholder image there in case of incompatibility with the
    animation.

-   We have put in the required differences in css (such as using webkit, moz
    and -o specifiers so it should style the same across the safari, chrome,
    opera and firefox) in css and used jquery for the built-in polyfills.
    However we were not able to test on safari in the end through absence of
    a mac computer

-   Crucially, the latest version of Node Js (v6) was used for ubuntu before
    using npm install to get the sqlite3 package. The link for the instructions
    we used for getting this version of node is:
    https://nodejs.org/en/download/package-manager/
    where the v6 option was used.
    It is our understanding that the node-modules folder (created by installing)
    the sqlite3 package, should contain the necessary files to work straight
    away with the database (providing you have the node js v6 of course).
    If not, we simply typed "npm install sqlite3" within the main directory
    of the site.


Please contact Chris Meehan or Liam White if for whatever reason the site
cannot be loaded in a manner which allows it to actually be assessed.
