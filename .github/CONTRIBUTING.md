# Lansing Codes Contributing Guide

Hi! We're really excited that you are interested in contributing to our tech
community tools. Before submitting your contribution, please make sure to read
through these guidelines.

- [Code of Conduct](https://www.lansing.codes/code-of-conduct/)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Development Setup](#development-setup)
- [Pull Request Guidelines](#pull-request-guidelines)

## Issue Reporting Guidelines

- If you would like to report a bug, use the
  [Bug report](https://github.com/lansingcodes/newsletter-events/issues/new?labels=bug&template=bug_report.md)
  template and fill in all of the details to the best of your abilities.

- If you would like to request a new feature, use the
  [Feature request](https://github.com/lansingcodes/newsletter-events/issues/new?labels=enhancement&template=feature_request.md)
  template. Provide as many details as possible, including visual mockups of the
  feature, descriptions of new user interactions, and an explanation of the
  benefits of the feature.

## Development Setup

If you want to run this website and make changes to it on your computer, some
initial setup is recommended.

This section starts with the basics like git and even the recommended editor.
There may be useful information here even if you're already familiar with
using git, VS Code. If you want to jump ahead, though, please read how

### Recommended software

If you're comfortable with using git, a terminal, and VS Code,
here's a quick list of the tools you'll need and some that are helpful to run this project:

- [git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) with these extensions:
  - Bracket Pair Colorizer by CoenraadS
  - ESLint by Dirk Baeumer
  - Prettier by Esben Petersen
  - VSCode Essentials Snippets by Roberto Achar
  - Live Server by Ritwick Dey

### Getting the source code

If you want to start your own newsletter website, click the _Fork_ button in the
top right of the [`lansingcodes/newsletter-events`](https://github.com/lansingcodes/newsletter-events) page
on GitHub. This will create your own copy of the code, allow you to get updates
from us, and make it easier to send us helpful improvements that you've made.

To get the code from GitHub, you will need to install
[`git`](https://git-scm.com/downloads) on your computer and then run `git clone`
to download the code from your computer.

If you are making changes to `lansingcodes/newsletter-events`, the full command will look like
this:

```sh
git clone https://github.com/lansingcodes/newsletter-events.git
```

If you forked this repository, the command will be different. Go to the page
where your copy of the code exists on GitHub and then click the _Clone or
download_ button to get the URL of the repository. Then run the following
command, substituting `REPOSITORY_URL` with the URL shown when you clicked the
_Clone or download_ button on your repository:

```sh
git clone REPOSITORY_URL
```

### Editing the code

If you want to look at the code and make changes to it, we highly recommend
using [Visual Studio Code](https://code.visualstudio.com/) (VS Code for short).
Follow the link to download and install the code editor.

After VS Code is installed, run it and click _Extensions_ from the gear icon
menu in the lower left of the editor. This will bring up a panel with a search
box.

Use the search box to find and install all of these extensions. They make the
experience of looking at and editing this project _super nice_.

- Bracket Pair Colorizer by CoenraadS
- ESLint by Dirk Baeumer
- Path Autocomplete by Mihai Vilcu
- Path Intellisense by Christian Kohler
- Prettier by Esben Petersen
- VSCode Essentials Snippets by Roberto Achar
- Live Server by Ritwick Dey

You should probably restart VS Code after installing all of these extensions.

After installation just go to index.html in the root folder and click on the Go Live icon in the blue menu bar on the bottom right hand corner of VS-Code


## Pull Request Guidelines

- The `main` branch is a snapshot of the latest in-flight release. All
  development should be done in dedicated branches.

- Checkout a development branch from the `main` branch. Similarly submit pull
  requests back to the `main` branch.

- Add your name (in the following format) to the CONTRIBUTORS.md file:

  \- Your Name (\[github] (https://github.com/your_github))

### Pull Requests

If you're making changes to the code and want to send a pull request to the
`lansingcodes` organization on GitHub, the easiest way is to make all of your
changes in a feature branch.

To create a feature branch, use these commands, replacing `new-branch` with the
name of your feature:

```sh
git fetch origin
git checkout -b new-branch origin/main
```

After you've made and tested your changes, these commands are helpful for
committing your changes to your branch. Again, substitute `new-branch` with the
name of your branch and `describe your changes` with an actual description of
your changes. If you send us commits with messages that aren't descriptive then
we won't accept them.

```sh
git add -A
git commit -m 'describe your changes'
git push origin new-branch
```

The output from this command will give you a link to GitHub that will start a
pull request. Complete the form and submit your changes. Someone will get to it
as soon as we can.

### Enhancements

- If adding a new feature, first create an issue with the `enhancement` label.
  Provide convincing reason to add this feature, provide mockups, and ask for
  discussion about the feature from other contributors. Wait until at least one
  administrator has greenlighted the feature before working on it.

- If fixing a bug:

  - Add `(fixes #xxxx)` (where #xxxx is the issue id) to your PR title. For
    example, `adjust margins on ultrawide screens (fixes #12)`.
  - Provide a detailed description of the bug in the pull request.

- Assign one or more reviewers to the pull request. At least one reviewer must
  approve the changes before the PR can be merged.

### Administrators

If you are an ADMINISTRATOR on this repository you can run the following command to deploy the project to GitHub Pages:

```sh
git fetch origin && git push --force origin origin/main:gh-pages
```

After a moment, the changes should then be available at https://lansingcodes.github.io/newsletter-events/



### We hope you enjoy working with our code!
