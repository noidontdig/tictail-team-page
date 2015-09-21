# Alex Qin's Thoughts

Please go to:

* `http://localhost:5000/` for the team page
* `http://localhost:5000/admin` for the admin page

## Design

I wanted this project to reflect the current design of Tictail, so I used the Tictail colors, imitated the Tictail buttons, used similar animations, etc.

## Admin Page

* Used same form for adding and editing a member to keep things simple.
* Built with accessibility practices in mind.
* Built with responsiveness in mind (mobile + desktop view).
* If I had more time, I would have added:
  * Sorting the fields in the table
  * Input validation on individual fields in the add/edit form

## Team Page

* I thought a lot about what *WOW FACTOR* the team page could have. Since the current Tictail Team page is already very well made, I wanted to do something completely out of the ordinary. I was inspired by [http://jor.dance/](http://jor.dance/) to create the chat.
* Built with responsiveness in mind (mobile + tablet + desktop view).
* Because of time constraints, the team page is optimized for Webkit browsers. Almost no testing was done on other browsers.
*
* If I had more time, I would have added:
  * Resizable and responsive grid ([masonry](http://masonry.desandro.com/) type) for the team list
  * Pre -loading the avatar images with [imagesLoaded](http://imagesloaded.desandro.com/). I tried working on this for a while but ran into issues with the library not working for background images, and then with Google Chrome not wanting to hide broken image icons. Moved on because of time constraints.

## Tools/Technologies/Libraries used

* ReactJS
  * This was my first time building an app with ReactJS (other than the ReactJS tutorial), which was a lot of fun. I did my best to conform to ReactJS best practices and design patterns, however my lack of experience with it may show in the code.
* CSS
  * I chose to use CSS instead of Sass becasue of the scale of the project, but that would be my preference for production code.
* Bower
  * I didn't use Require because of the scale of the project, but that would be my preference for production code.
* JQuery
  * I tend to be sparse with my use of JQuery, but used it a bit more in this project because of time constraints.
* Animate.css + Wow.js
  * For some cool animations.

## Thanks!

I had a lot of fun with this challenge :) I hope you enjoy my version of Tictail's Team page!