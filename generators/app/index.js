const chalk     = require('chalk');
const yosay     = require('yosay');
const Generator = require('yeoman-generator');
const slugify   = require('slugify');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // init extension manifest data
        this.manifest = {
            permissions: {}
        };
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type   : 'input',
                name   : 'name',
                message: 'What would you like to call this extension?',
                default: this.appname
            },
            {
                type   : 'input',
                name   : 'shortName',
                message: 'And how would you call it if you only had 12 characters (short_name)?',
                default: answers => answers.name.substr(0, 11).trim()
            }, {
                name   : 'description',
                message: 'How would you like to describe this extension?',
                default: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }
        ]);
    }

    prepareData() {
        // Meta
        this.appname              = this.manifest.name = this.answers.name.replace(/"/g, '\\"');
        this.appShortName         = this.manifest.shortName = this.answers.shortName.replace(/"/g, '\\"');
        this.appDescription       = this.answers.description;
        this.manifest.description = this.answers.description.replace(/"/g, '\\"');
    }

    app() {
        this.fs.copy(
            this.templatePath('app'),
            this.destinationPath('app')
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

    packageJSON() {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                name       : slugify(this.appname),
                description: this.manifest.description
            }
        );
    }

    readme() {
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                name       : this.appname,
                description: this.appDescription
            }
        );
    }

    git() {
        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copy(
            this.templatePath('gitattributes'),
            this.destinationPath('.gitattributes')
        );
    }

    editorConfig() {
        this.fs.copy(
            this.templatePath('editorconfig'),
            this.destinationPath('.editorconfig')
        );
    }

    installing() {
        this.log('I\'m all done. Running ' + chalk.yellow('npm install') + ' for you to install the required dependencies. If this fails, try running the command yourself.');
        this.npmInstall();
    }

    end() {
        this.log(
            yosay('Please run ' + chalk.red('gulp') + ' or  ' + chalk.yellow('gulp --watch') + ' and load the generated dist into chrome.')
        );
    }

};