var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            },
            {
                type: "input",
                name: "description",
                message: "Your project name",
                default: this.appname // Default to current folder name
            },
            {
                type: "confirm",
                name: "cool",
                message: "Would you like to enable the Cool feature?"
            },
            {
                type: "input",
                name: "title",
                message: "Your project title"
            }
        ]);

        this.log("app name", this.answers.name);
        this.log("cool feature", this.answers.cool);
    }

    app() {
        this.fs.copy(
            this.templatePath('app'),
            this.destinationPath('app'),
            // { title: this.answers.title } // user answer `title` used
        );
    }

    tasks() {
        this.fs.copy(
            this.templatePath('Gruntfile.js'),
            this.destinationPath('Gruntfile.js')
        );

        this.fs.copy(
            this.templatePath('grunt'),
            this.destinationPath('grunt')
        );
    }

    packageJSON () {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'), {
                name: slugify(this.appname),
                description: this.manifest.description
            }
        )
    }

};