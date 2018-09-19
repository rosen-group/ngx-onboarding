##Onboarding / Feature Introduction

Offers comparable functionality to libraries like [introjs](https://introjs.com/).
(Intro.js has nicer animations, though).

Messages can be configured in json files.

Issues for makeing this a "conformant" library...
- Substitute ngx translator
- Replace direct access to "window" with services etc

    https://juristr.com/blog/2016/09/ng2-get-window-ref/
    
    https://www.ryadel.com/en/angular-5-access-window-document-localstorage-browser-types-angular-universal/

- [done] What is with ViewEncapsulation? Material switches it off so we can do that too...    

- "public" ...No one else seems to use the public keyword...should be removed everywhere

- Introduce interface and standard implementation for storage

- [partial] Method for generalizing colors fonts sizes etc... (user customizable)
  [todo] still needed for colors

- [next iteration]Really need material for the menu? or allow users to use other menus?

- [done] Seems to work in IE now (was it missing lodash?) ~~Check why it does not work in IE currently (is it just animations or something else)~~
- [done] FireFox..works as long not in intranet and using https and the same time
- [done] Edge works



