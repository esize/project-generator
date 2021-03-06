# Here's how to make this thing

NOTE: Project name will be project_name and description will be default_description default username is admin_username and password is admin_password and email is admin@email.com



* [x] Create a new folder with the project name
* [x] Copy the boilerplate from the templates folder into the project folder
* [x] Create the boilerplate projects:
  * [x] Frontend
   * [x] Raw HTML
   * [x] Vue
    - project_name in package.json, package-lock.json, READ.md
   * [x] Wordpress Theme
    - Uses project_name literally everywhere :(
  * [x] Desktop
   * [x] Node CLI
   * [x] Electron
  * [x] Backend
   * [x] Feathers
   * [x] Django
   * [x] Express
* [x] Don't create a subfolder if only one template is selected
* [x] Check if starting directory is empty
* [x] Pass in project name in command
* [x] Change boilerplate variables with the project name, description, and license
* [x] Put it on GitHub
  * [x] Login to GitHub
  * [x] Sign up for an oauth app
  * [x] Login the user on init
  * [x] Store the token in config
  * [x] Create a new repository based on the project name, description, and license
  * [x] Git add .
  * [x] Commit with the message "initial commit"
  * [x] Push to the new repository
* [ ] Create a .project-settings file to contain settings choosen on initialization
* [ ] Create a READ.md file and auto-populate with instructions from the various templates
* [ ] Use the firebase api to add firebase as a backend type
* [ ] Add commented modifiers to the templates:
 * [ ] Bootstrap
 * [ ] SCSS
 * [ ] GraphQL
   * [ ] Django
   * [ ] Feathers
   * [ ] Express
   * [ ] Vue
   * [ ] HTML
 * [ ] Basic Auth Configuration
   * [ ] OAuth
   * [ ] JWT
   * [ ] Cookies/Sessions
* [ ] Determine weather commented modifier sections should be included based on settings
* [ ] Use the init script to setup the cli on a new computer
  * [ ] Login to GitHub
  * [ ] Login to Firebase
  * [ ] Set default project folder
* [ ] Make it hostable right away
  * [ ] Docker/Kubernetes option
  * [ ] Heroku compatible
  * [ ] vercel.com (with npx now-config)
  * [ ] ngrok.com
  * [ ] Netlify
* [ ] Auto generate docs
  * [ ] REST API
  * [ ] GraphQL API
  * [ ] CSS classes/styling guide
* [ ] Project checklist generator
